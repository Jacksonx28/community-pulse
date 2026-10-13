import Farewell from "../farewell";
export const dynamic = "force-dynamic";
export default async function SignOut({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 const params=await searchParams;
 return <Farewell error={params.error==="failed"}/>;
}
