"use client";
import { useId, useState } from "react";
import { searchCMProfiles } from "@/lib/cm-search";
import { ProfileImage } from "./card-artwork";
import type { Community } from "./pulse";
export default function CMPicker({profiles,value,onChange,label,multiple=false,allowSeparate=false}:{profiles:Community[];value:string[];onChange:(ids:string[])=>void;label:string;multiple?:boolean;allowSeparate?:boolean}){
 const [query,setQuery]=useState("");const group=useId();
 const selected=profiles.filter(p=>value.includes(p.id));
 const matches=searchCMProfiles(profiles,query,value);
 const row=(p:Community)=><label className="cm-search-result" key={p.id}><input type={multiple?"checkbox":"radio"} name={group} value={p.id} checked={value.includes(p.id)} disabled={multiple&&value.length>=10&&!value.includes(p.id)} onChange={()=>onChange(multiple?value.includes(p.id)?value.filter(id=>id!==p.id):[...value,p.id]:[p.id])}/><ProfileImage url={p.avatar_url} name={p.name} className="cm-search-avatar"/><span><strong>{p.name}</strong><small>{p.username?`@${p.username}`:"Community Pulse username not set"}{p.handle?` · X: @${p.handle.replace(/^@/,"")}`:""}</small></span></label>;
 return <fieldset className="cm-search"><legend>{label}</legend><input type="search" aria-label={`Search ${label}`} placeholder="Search name, @username or X handle" value={query} onChange={e=>setQuery(e.target.value)}/>{allowSeparate&&<label className="cm-search-result"><input type="radio" name={group} checked={!value.length} onChange={()=>onChange([])}/>Add a separate contact</label>}{!!selected.length&&<div className="cm-search-selected"><small>Selected{multiple?` (${selected.length}/10)`:""}</small>{selected.map(row)}</div>}<div className="cm-search-results">{matches.slice(0,20).map(row)}</div><p className="text-small muted" role="status">{!profiles.length?"CMs appear here after creating a profile.":!matches.length?selected.length?"No other CMs match your search.":"No CM found. Try their exact username or X handle.":matches.length>20?`${matches.length} matches. Showing 20; type more to narrow your search.`:`${matches.length} ${matches.length===1?"CM":"CMs"} found.`}</p></fieldset>;
}
