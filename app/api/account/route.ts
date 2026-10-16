import { getUser } from "@/lib/auth";
import { database } from "@/lib/pulse-db";
import { accountAlias, accountInput } from "@/lib/account-validation";
export const dynamic="force-dynamic";
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"private, no-store"}});
export async function GET(request:Request){
 try{const user=await getUser();if(!user)return json({error:"Sign in to manage your account."},401);
 const input=accountAlias.safeParse(new URL(request.url).searchParams.get("username"));if(!input.success)return json({available:false,error:input.error.issues[0].message},400);
 const taken=await database().prepare("SELECT user_id FROM accounts WHERE username=?").bind(input.data).first<{user_id:string}>();return json({available:!taken||taken.user_id===user.userId});
 }catch{return json({error:"Availability could not be checked. Try again."},503)}
}
export async function POST(request:Request){
 try{if(request.headers.get("origin")!==new URL(request.url).origin)return json({error:"Invalid request origin."},403);
 const user=await getUser();if(!user)return json({error:"Sign in to manage your account."},401);
 const raw=await request.text();if(raw.length>360000)return json({error:"Choose a smaller photo."},413);
 let body;try{body=JSON.parse(raw)}catch{return json({error:"Invalid account details."},400)}
 const input=accountInput.safeParse(body);if(!input.success)return json({error:input.error.issues[0].message},400);
 const d=input.data;const db=database();const taken=await db.prepare("SELECT user_id FROM accounts WHERE username=? AND user_id<>?").bind(d.username,user.userId).first();if(taken)return json({error:"That alias is taken. Choose another."},409);
 await db.prepare("INSERT INTO accounts (user_id,username,display_name,avatar,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET username=excluded.username,display_name=excluded.display_name,avatar=excluded.avatar,updated_at=excluded.updated_at").bind(user.userId,d.username,d.displayName,d.avatar,new Date().toISOString()).run();return json({saved:true});
 }catch(error){if(String(error).includes("accounts.username"))return json({error:"That alias is taken. Choose another."},409);return json({error:"Your account could not be saved. Please try again."},503)}
}
