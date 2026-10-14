import { getUser } from "@/lib/auth";
import { database } from "@/lib/pulse-db";
import { communityInput, requestInput, responseInput, teamInput, readInput, reportInput, reviewInput } from "@/lib/pulse-validation";
export const dynamic="force-dynamic";
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{"Cache-Control":"no-store"}});
export async function GET(){
  try {
    const user=await getUser(); const db=database();
    const {results}=await db.prepare("SELECT c.*, COALESCE((SELECT SUM(r.approved_spots) FROM collaborations r WHERE r.target_id=c.id AND r.kind='Whitelist spots' AND r.status IN ('accepted','completed')),0) AS allocated_spots FROM communities c ORDER BY c.created_at DESC LIMIT 500").all();
    const contacts=(await db.prepare("SELECT project_id,cm_id FROM project_cm_contacts").all()).results as {project_id:string,cm_id:string}[];
    const team=(await db.prepare("SELECT pt.project_id,pt.cm_id,pt.status,p.name AS project_name,c.name AS cm_name,c.owner_id AS cm_owner,p.owner_id AS project_owner FROM project_team pt JOIN communities p ON p.id=pt.project_id AND p.kind IN ('Project','Community') JOIN communities c ON c.id=pt.cm_id AND c.kind='CM'").all()).results as {project_id:string,cm_id:string,status:string,project_name:string,cm_name:string,cm_owner:string,project_owner:string}[];
    const list=results.map(({owner_id,available_spots,allocated_spots,...row})=>{
      const canSeeAllocations=row.show_allocations!==0||owner_id===user?.userId||team.some(link=>link.project_id===row.id&&link.status==='accepted'&&link.cm_owner===user?.userId);
      return {...row,...(canSeeAllocations?{available_spots,allocated_spots}:{}),spots_available:Number(available_spots)>Number(allocated_spots),mine:owner_id===user?.userId,cm_ids:contacts.filter(link=>link.project_id===row.id).map(link=>link.cm_id),listed_project_ids:contacts.filter(link=>link.cm_id===row.id).map(link=>link.project_id),approved_cm_ids:team.filter(link=>link.project_id===row.id&&link.status==='accepted').map(link=>link.cm_id),approved_project_ids:team.filter(link=>link.cm_id===row.id&&link.status==='accepted').map(link=>link.project_id)};});
    const requests=user ? (await db.prepare(`SELECT r.*, s.name AS source_name, t.name AS target_name,
      CASE WHEN t.owner_id = ? OR EXISTS (SELECT 1 FROM project_team pt JOIN communities cm ON cm.id=pt.cm_id AND cm.kind='CM' WHERE pt.project_id=t.id AND t.kind IN ('Project','Community') AND pt.status='accepted' AND cm.owner_id=? AND (r.assigned_cm_id IS NULL OR r.assigned_cm_id=cm.id)) THEN 1 ELSE 0 END AS incoming,
      CASE WHEN COALESCE(reads.seen_at,'') < COALESCE(NULLIF(r.updated_at,''),r.created_at) THEN 1 ELSE 0 END AS unread
      FROM collaborations r JOIN communities s ON s.id=r.source_id JOIN communities t ON t.id=r.target_id LEFT JOIN request_reads reads ON reads.request_id=r.id AND reads.user_id=?
      WHERE s.owner_id=? OR t.owner_id=? OR EXISTS (SELECT 1 FROM project_team pt JOIN communities cm ON cm.id=pt.cm_id AND cm.kind='CM' WHERE pt.project_id=t.id AND t.kind IN ('Project','Community') AND pt.status='accepted' AND cm.owner_id=? AND (r.assigned_cm_id IS NULL OR r.assigned_cm_id=cm.id)) ORDER BY COALESCE(NULLIF(r.updated_at,''),r.created_at) DESC LIMIT 500`).bind(user.userId,user.userId,user.userId,user.userId,user.userId,user.userId).all()).results : [];
    const invitations=team.filter(t=>t.cm_owner===user?.userId||t.project_owner===user?.userId).map(({cm_owner,project_owner,...t})=>({...t,owner:project_owner===user?.userId,can_accept:cm_owner===user?.userId}));
    const reports=user?(await db.prepare("SELECT pr.id,pr.profile_id,pr.kind,pr.message,pr.status,pr.created_at,c.name AS profile_name,CASE WHEN c.owner_id=? THEN 1 ELSE 0 END AS can_review FROM profile_reports pr JOIN communities c ON c.id=pr.profile_id WHERE c.owner_id=? OR pr.reporter_id=? ORDER BY pr.created_at DESC LIMIT 100").bind(user.userId,user.userId,user.userId).all()).results:[];
    return json({communities:list,requests,invitations,reports,signedIn:!!user});
  }catch(error){console.error("Pulse read failed",error);return json({error:"The directory is temporarily unavailable. Please try again."},503)}
}
export async function POST(request:Request){
  try {
    const origin=request.headers.get("origin"); if(!origin||origin!==new URL(request.url).origin)return json({error:"Invalid request origin."},403);
    const user=await getUser();if(!user)return json({error:"Sign in to save or request a collaboration."},401);
    const raw=await request.text();if(raw.length>16000)return json({error:"Request is too large."},413);
    let body;try{body=JSON.parse(raw)}catch{return json({error:"Invalid request."},400)}
    const db=database(); const now=new Date().toISOString();
    if(body.action==="team"){
      const input=teamInput.safeParse(body.data);if(!input.success)return json({error:"Invalid team action."},400);
      const d=input.data;
      const project=await db.prepare("SELECT owner_id FROM communities WHERE id=? AND kind IN ('Project','Community')").bind(d.projectId).first<{owner_id:string}>();
      const cm=await db.prepare("SELECT owner_id FROM communities WHERE id=? AND kind='CM'").bind(d.cmId).first<{owner_id:string}>();
      if(!project||!cm)return json({error:"Choose a registered project or community and CM."},400);
      if(d.mode==='invite'||d.mode==='revoke'){
        if(project.owner_id!==user.userId)return json({error:"Only the profile owner can approve CMs and manage inbox invitations."},403);
        if(d.mode==='revoke'){await db.prepare("DELETE FROM project_team WHERE project_id=? AND cm_id=?").bind(d.projectId,d.cmId).run();return json({id:d.projectId})}
        await db.prepare("INSERT INTO project_team (project_id,cm_id,status,created_at) VALUES (?,?,'invited',?) ON CONFLICT(project_id,cm_id) DO UPDATE SET status='invited',created_at=excluded.created_at WHERE project_team.status='declined'").bind(d.projectId,d.cmId,now).run();
      }else{
        if(cm.owner_id!==user.userId)return json({error:"Only this CM can respond to the invitation."},403);
        const result=await db.prepare("UPDATE project_team SET status=? WHERE project_id=? AND cm_id=? AND status='invited'").bind(d.mode==='accept'?'accepted':'declined',d.projectId,d.cmId).run();
        if(!result.meta.changes)return json({error:"This invitation has changed. Refresh and try again."},409);
      }
      return json({id:d.projectId});
    }
    if(body.action==='read'){
      const input=readInput.safeParse(body.data);if(!input.success)return json({error:"Invalid request."},400);
      const access=await db.prepare("SELECT r.id FROM collaborations r JOIN communities s ON s.id=r.source_id JOIN communities t ON t.id=r.target_id WHERE r.id=? AND (s.owner_id=? OR t.owner_id=? OR EXISTS (SELECT 1 FROM project_team pt JOIN communities cm ON cm.id=pt.cm_id AND cm.kind='CM' WHERE pt.project_id=t.id AND t.kind IN ('Project','Community') AND pt.status='accepted' AND cm.owner_id=? AND (r.assigned_cm_id IS NULL OR r.assigned_cm_id=cm.id)))").bind(input.data.id,user.userId,user.userId,user.userId).first();
      if(!access)return json({error:"Request not found."},404);
      await db.prepare("INSERT INTO request_reads (request_id,user_id,seen_at) VALUES (?,?,?) ON CONFLICT(request_id,user_id) DO UPDATE SET seen_at=excluded.seen_at").bind(input.data.id,user.userId,now).run();return json({id:input.data.id});
    }
    if(body.action==='report'){
      const input=reportInput.safeParse(body.data);if(!input.success)return json({error:"Describe the issue in 20 to 1,000 characters."},400);
      const d=input.data;const target=await db.prepare("SELECT id FROM communities WHERE id=?").bind(d.profileId).first();if(!target)return json({error:"Profile not found."},404);
      const recent=await db.prepare("SELECT COUNT(*) AS n FROM profile_reports WHERE reporter_id=? AND created_at>?").bind(user.userId,new Date(Date.now()-3600000).toISOString()).first<{n:number}>();if((recent?.n||0)>=5)return json({error:"You have submitted several reviews. Please try again later."},429);
      const id=crypto.randomUUID();await db.prepare("INSERT INTO profile_reports (id,profile_id,reporter_id,kind,message,created_at) VALUES (?,?,?,?,?,?)").bind(id,d.profileId,user.userId,d.kind,d.message,now).run();return json({id},201);
    }
    if(body.action==='review'){
      const input=reviewInput.safeParse(body.data);if(!input.success)return json({error:"Invalid review."},400);
      const d=input.data;const result=await db.prepare("UPDATE profile_reports SET status=? WHERE id=? AND status='pending' AND EXISTS (SELECT 1 FROM communities c WHERE c.id=profile_reports.profile_id AND c.owner_id=?)").bind(d.status,d.id,user.userId).run();if(!result.meta.changes)return json({error:"You cannot update this review, or it has already changed."},403);return json({id:d.id});
    }
    if(body.action==="community"){
      const input=communityInput.safeParse(body.data);if(!input.success)return json({error:input.error.issues[0].message},400);
      const d=input.data;
      const cmIds=d.kind!=="CM"?[...new Set(d.projectCMIds)]:[];
      for(const cmId of cmIds){const cm=await db.prepare("SELECT kind FROM communities WHERE id=?").bind(cmId).first<{kind:string}>();if(cm?.kind!=="CM")return json({error:"Choose an existing CM profile."},400);}
      const saveCMs=async(projectId:string)=>{await db.batch([db.prepare("DELETE FROM project_cm_contacts WHERE project_id=?").bind(projectId),...cmIds.map(cmId=>db.prepare("INSERT INTO project_cm_contacts (project_id,cm_id) VALUES (?,?)").bind(projectId,cmId))])};
      if(d.kind==="Project"&&d.spotsListed&&d.spotsDeadline<now.slice(0,10))return json({error:"Choose today or a future spot deadline."},400);
      let managerId=d.id||crypto.randomUUID();
      if(d.managerProfileId){
        const linked=await db.prepare("SELECT owner_id,manager_id,id,representative FROM communities WHERE id=? AND kind IN ('Project','CM')").bind(d.managerProfileId).first<{owner_id:string,manager_id:string,id:string,representative:string}>();
        if(!linked||linked.owner_id!==user.userId)return json({error:"Choose a CM from a project you manage."},403);
        if(d.representative!==linked.representative)return json({error:"Use the linked CM’s name, or select a separate CM profile."},400);
        managerId=linked.manager_id||linked.id;
      }
      if(d.id){
        const existing=await db.prepare("SELECT owner_id,manager_id FROM communities WHERE id=?").bind(d.id).first<{owner_id:string,manager_id:string}>();
        if(!existing||existing.owner_id!==user.userId)return json({error:"You cannot edit this profile."},403);
        if(!d.managerProfileId)managerId=existing.manager_id||d.id;
        const allocated=await db.prepare("SELECT COALESCE(SUM(approved_spots),0) AS n FROM collaborations WHERE target_id=? AND kind='Whitelist spots' AND status IN ('accepted','completed')").bind(d.id).first<{n:number}>();
        if(d.spotsListed&&d.availableSpots<(allocated?.n||0))return json({error:"The total allocation cannot be less than already approved spots."},400);
        const profileUpdate=await db.prepare("UPDATE communities SET name=?,kind=?,ecosystem=?,description=?,representative=?,role=?,handle=?,official_url=?,open=?,project_category=?,handles_spots=?,updated_at=?,x_user_id=?,discord_user_id=?,manager_id=?,audience_size=?,interests=?,past_collaborations=?,avatar_url=?,banner_url=?,availability=?,current_projects=?,contact_route=?,spots_listed=?,available_spots=?,spots_deadline=?,eligibility=?,hiring=?,hiring_details=?,compensation=?,show_allocations=? WHERE id=? AND owner_id=? AND (?=0 OR ?>=COALESCE((SELECT SUM(approved_spots) FROM collaborations WHERE target_id=communities.id AND kind='Whitelist spots' AND status IN ('accepted','completed')),0))")
          .bind(d.name,d.kind,d.ecosystem,d.description,d.representative,d.role,d.handle.replace(/^@/,""),d.officialUrl,d.open?1:0,d.kind==="Project"?d.projectCategory:"Other",d.kind==="Project"&&d.handlesSpots?1:0,now,d.xUserId,d.discordUserId,managerId,d.audienceSize,d.interests,d.pastCollaborations,d.avatarUrl,d.bannerUrl,d.availability,d.currentProjects,d.contactRoute,d.kind==="Project"&&d.spotsListed?1:0,d.availableSpots,d.spotsDeadline,d.eligibility,d.kind==="Project"&&d.hiring?1:0,d.hiringDetails,d.compensation,d.showAllocations?1:0,d.id,user.userId,d.spotsListed?1:0,d.availableSpots).run();
        if(!profileUpdate.meta.changes)return json({error:"The allocation changed while you were editing. Refresh and try again."},409);
        await saveCMs(d.id);
        return json({id:d.id});
      }
      const id=crypto.randomUUID();
      const count=await db.prepare("SELECT COUNT(*) AS n FROM communities WHERE owner_id=?").bind(user.userId).first<{n:number}>();
      if((count?.n||0)>=20)return json({error:"The pilot supports up to 20 profiles per account."},400);
      await db.prepare(`INSERT INTO communities (id,owner_id,name,kind,ecosystem,description,representative,role,handle,official_url,open,created_at,project_category,handles_spots,updated_at,x_user_id,discord_user_id,manager_id,audience_size,interests,past_collaborations,avatar_url,banner_url,availability,current_projects,contact_route,spots_listed,available_spots,spots_deadline,eligibility,hiring,hiring_details,compensation,show_allocations) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .bind(id,user.userId,d.name,d.kind,d.ecosystem,d.description,d.representative,d.role,d.handle.replace(/^@/,""),d.officialUrl,d.open?1:0,now,d.kind==="Project"?d.projectCategory:"Other",d.kind==="Project"&&d.handlesSpots?1:0,now,d.xUserId,d.discordUserId,managerId,d.audienceSize,d.interests,d.pastCollaborations,d.avatarUrl,d.bannerUrl,d.availability,d.currentProjects,d.contactRoute,d.kind==="Project"&&d.spotsListed?1:0,d.availableSpots,d.spotsDeadline,d.eligibility,d.kind==="Project"&&d.hiring?1:0,d.hiringDetails,d.compensation,d.showAllocations?1:0).run();
      await saveCMs(id);
      return json({id},201);
    }
    if(body.action==="request"){
      const input=requestInput.safeParse(body.data);if(!input.success)return json({error:input.error.issues[0].message},400);
      const d=input.data;
      if(d.deadline<now.slice(0,10))return json({error:"Choose today or a future deadline."},400);
      const recent=await db.prepare("SELECT COUNT(*) AS n FROM collaborations r JOIN communities c ON c.id=r.source_id WHERE c.owner_id=? AND r.created_at>?").bind(user.userId,new Date(Date.now()-3600000).toISOString()).first<{n:number}>();
      if((recent?.n||0)>=30)return json({error:"You have sent several requests. Please try again later."},429);
      const source=await db.prepare("SELECT owner_id,kind FROM communities WHERE id=?").bind(d.sourceId).first<{owner_id:string,kind:string}>();
      const target=await db.prepare("SELECT owner_id,open,kind,handles_spots,spots_listed,available_spots,spots_deadline,hiring,availability FROM communities WHERE id=?").bind(d.targetId).first<{owner_id:string,open:number,kind:string,handles_spots:number,spots_listed:number,available_spots:number,spots_deadline:string,hiring:number,availability:string}>();
      if(!source||source.owner_id!==user.userId)return json({error:"Choose a profile you manage."},403);
      if(!target||!target.open)return json({error:"This profile is not accepting requests."},400);
      if(target.kind==="Project"&&d.kind==="Whitelist spots"&&!target.handles_spots)return json({error:"This project contact has not listed whitelist allocations as their responsibility."},400);
      if(d.kind==="Hire CM"&&(!["Project","Community"].includes(source.kind)||target.kind!=="CM"||target.availability==="Busy"))return json({error:"A project or community can approach an available CM."},400);
      if(d.kind==="CM application"&&(source.kind!=="CM"||target.kind!=="Project"||!target.hiring))return json({error:"Choose your CM profile and a project currently hiring."},400);
      if(d.kind==="Whitelist spots"&&target.kind==="CM")return json({error:"Choose a project to request its allocation."},400);
      if(d.kind==="Whitelist spots"&&target.spots_listed){
        const used=await db.prepare("SELECT COALESCE(SUM(approved_spots),0) AS n FROM collaborations WHERE target_id=? AND kind='Whitelist spots' AND status IN ('accepted','completed')").bind(d.targetId).first<{n:number}>();
        if(target.spots_deadline<now.slice(0,10)||d.spots>target.available_spots-(used?.n||0))return json({error:"This spot listing has expired or does not have enough remaining spots."},400);
      }
      if(d.assignedCMId){
        const contact=await db.prepare("SELECT pt.cm_id FROM project_team pt JOIN communities cm ON cm.id=pt.cm_id AND cm.kind='CM' WHERE pt.project_id=? AND pt.cm_id=? AND pt.status='accepted'").bind(d.targetId,d.assignedCMId).first();
        if(!['Project','Community'].includes(target.kind)||!contact)return json({error:"Choose a CM who has accepted this team’s invitation."},400);
      }
      if(d.sourceId===d.targetId)return json({error:"Choose a different partner."},400);
      const id=crypto.randomUUID();
      await db.prepare("INSERT INTO collaborations (id,source_id,target_id,title,kind,spots,deadline,message,status,created_at,community_platform,assigned_cm_id,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
      .bind(id,d.sourceId,d.targetId,d.title,d.kind,d.spots,d.deadline,d.message,"pending",now,d.communityPlatform,d.assignedCMId||null,now).run();return json({id},201);
    }
    if(body.action==="respond"){
      const input=responseInput.safeParse(body.data);if(!input.success)return json({error:"Invalid collaboration update."},400);
      const d=input.data;
      const row=await db.prepare(`SELECT r.*,s.owner_id AS sender,t.owner_id AS recipient FROM collaborations r JOIN communities s ON s.id=r.source_id JOIN communities t ON t.id=r.target_id WHERE r.id=?`).bind(d.id).first<{sender:string,recipient:string,status:string,spots:number,kind:string,target_id:string,assigned_cm_id:string|null}>();
      if(!row)return json({error:"Request not found."},404);
      const delegated=await db.prepare("SELECT pt.cm_id FROM project_team pt JOIN communities cm ON cm.id=pt.cm_id AND cm.kind='CM' JOIN communities p ON p.id=pt.project_id AND p.kind IN ('Project','Community') WHERE pt.project_id=? AND pt.status='accepted' AND cm.owner_id=? AND (? IS NULL OR pt.cm_id=?)").bind(row.target_id,user.userId,row.assigned_cm_id,row.assigned_cm_id).first();
      if(d.status==="cancelled"?row.sender!==user.userId:row.recipient!==user.userId&&!delegated)return json({error:"You cannot update this request."},403);
      if(d.status==="completed"?row.status!=="accepted":d.status==="discussing"?row.status!=="pending":!["pending","discussing"].includes(row.status))return json({error:"This request has already changed. Refresh and try again."},409);
      const approved=d.status==="accepted"?(d.approvedSpots??row.spots):0;
      if(d.status==="accepted"&&row.kind==="Whitelist spots"&&(approved<1||approved>row.spots))return json({error:"Approved spots must be between 1 and the requested amount."},400);
      const result=await db.prepare("UPDATE collaborations SET status=?, updated_at=?, approved_spots=CASE WHEN ?='accepted' THEN ? ELSE approved_spots END WHERE id=? AND status=? AND (CASE WHEN ?='cancelled' THEN EXISTS (SELECT 1 FROM communities s WHERE s.id=collaborations.source_id AND s.owner_id=?) ELSE EXISTS (SELECT 1 FROM communities t WHERE t.id=collaborations.target_id AND (t.owner_id=? OR (t.kind IN ('Project','Community') AND EXISTS (SELECT 1 FROM project_team pt JOIN communities cm ON cm.id=pt.cm_id AND cm.kind='CM' WHERE pt.project_id=t.id AND pt.status='accepted' AND cm.owner_id=? AND (collaborations.assigned_cm_id IS NULL OR collaborations.assigned_cm_id=cm.id))))) END) AND (?!='accepted' OR kind!='Whitelist spots' OR NOT EXISTS (SELECT 1 FROM communities c WHERE c.id=collaborations.target_id AND c.spots_listed=1 AND (? + COALESCE((SELECT SUM(other.approved_spots) FROM collaborations other WHERE other.target_id=c.id AND other.kind='Whitelist spots' AND other.status IN ('accepted','completed')),0)>c.available_spots OR c.spots_deadline<?)))")
        .bind(d.status,now,d.status,approved,d.id,row.status,d.status,user.userId,user.userId,user.userId,d.status,approved,now.slice(0,10)).run();
      if(!result.meta.changes)return json({error:"This request or its available allocation has changed. Refresh and try again."},409);
      return json({id:d.id,status:d.status});
    }
    return json({error:"Unknown action."},400);
  }catch(error){console.error("Pulse write failed",error);return json({error:"We could not save this. Your input is still here; please try again."},503)}
}
