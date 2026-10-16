import { database } from "@/lib/pulse-db";
export const dynamic="force-dynamic";
export async function GET(request:Request){
 const alias=new URL(request.url).searchParams.get("alias")||"";
 if(!/^[a-z0-9_]{3,30}$/.test(alias))return new Response(null,{status:404});
 try{const row=await database().prepare("SELECT a.avatar FROM accounts a WHERE a.username=? AND EXISTS (SELECT 1 FROM communities c WHERE c.owner_id=a.user_id AND c.kind='CM' AND c.deleted_at='')").bind(alias).first<{avatar:string}>();
 if(!row?.avatar)return new Response(null,{status:404});
 if(row.avatar.startsWith("https://"))return Response.redirect(row.avatar,302);
 const match=/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(row.avatar);if(!match)return new Response(null,{status:404});
 const bytes=Uint8Array.from(atob(match[2]),char=>char.charCodeAt(0));return new Response(bytes,{headers:{"Content-Type":match[1],"Cache-Control":"public, max-age=300","X-Content-Type-Options":"nosniff"}});
 }catch{return new Response(null,{status:503})}
}
