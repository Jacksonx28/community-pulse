export type SearchableCM={id:string;name:string;representative:string;account_display_name?:string;username?:string|null;handle:string};
export function searchCMProfiles<T extends SearchableCM>(profiles:T[],query:string,selected:string[]=[]):T[]{
 const q=query.trim().replace(/^@/,"").toLowerCase();
 return profiles.filter(p=>!selected.includes(p.id)&&`${p.name} ${p.account_display_name||""} ${p.representative} ${p.username||""} ${p.handle.replace(/^@/,"")}`.toLowerCase().includes(q)).sort((a,b)=>Number(b.username===q)-Number(a.username===q)||a.name.localeCompare(b.name));
}
