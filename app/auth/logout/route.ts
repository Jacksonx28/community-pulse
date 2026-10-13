import { authClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
function redirect(path:string,origin:string){
 const response=NextResponse.redirect(new URL(path,origin),303);
 response.headers.set("Cache-Control","private, no-store");
 return response;
}
export async function POST(request: Request) {
 const url=new URL(request.url);
 if(request.headers.get("origin")!==url.origin)return new Response("Invalid origin",{status:403});
 try {
  const client=await authClient();
  const {error}=await client.auth.signOut({scope:"local"});
  if(error)return redirect("/signout?error=failed",url.origin);
 }catch{return redirect("/signout?error=failed",url.origin)}
 return redirect("/signed-out",url.origin);
}
export async function GET(request:Request){return redirect("/signout",new URL(request.url).origin)}
