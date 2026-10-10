import Pulse from "./pulse";
import { getUser, signInPath, signOutPath } from "@/lib/auth";
export const dynamic="force-dynamic";
export default async function Home({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const user=await getUser();const params=await searchParams;const initialView=params.view==="profiles"?"profiles":params.view==="inbox"?"inbox":"discover";return <Pulse initialView={initialView} initialHelp={params.help==="roles"} signedIn={!!user} displayName={user?.displayName||"Your workspace"} email={user?.email||""} signInHref={signInPath("/")} signOutHref={signOutPath()}/>;}
