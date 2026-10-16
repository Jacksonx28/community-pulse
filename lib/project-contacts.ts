export type ProjectContact={username?:string|null;kind:string;name:string;ecosystem:string;description:string;representative:string;role:string;handle:string;open:number;project_category?:string;handles_spots?:number;example?:boolean;search_contacts?:string};
export type ContactFilters={query:string;ecosystem:string;role:string;category:string;allocationsOnly:boolean;openOnly:boolean};
export function filterProjectContacts<T extends ProjectContact>(profiles:T[],filters:ContactFilters):T[]{
  const query=filters.query.trim().toLowerCase();
  return profiles.filter(p=>p.kind==="Project"&&!p.example&&
    (filters.ecosystem==="All ecosystems"||p.ecosystem===filters.ecosystem)&&
    (filters.role==="All roles"||p.role===filters.role)&&
    (filters.category==="All project types"||(p.project_category||"Other")===filters.category)&&
    (!filters.allocationsOnly||!!p.handles_spots)&&(!filters.openOnly||!!p.open)&&
    `${p.username||""} @${p.username||""} ${p.name} ${p.representative} ${p.handle} @${p.handle} ${p.role} ${p.description} ${p.search_contacts||""}`.toLowerCase().includes(query));
}

export function groupProjectContacts<T extends {id:string;manager_id?:string}>(profiles:T[]){
 const groups=new Map<string,{id:string;projects:T[]}>();
 for(const profile of profiles){const id=profile.manager_id||profile.id;const group=groups.get(id)||{id,projects:[]};group.projects.push(profile);groups.set(id,group)}
 return [...groups.values()];
}
