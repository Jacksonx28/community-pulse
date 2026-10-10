"use client";
import { useState } from "react";

export function ProfileImage({url,name,className=""}:{url?:string;name:string;className?:string}){
 const [failed,setFailed]=useState("");
 const initials=name.trim().split(/\s+/).map(part=>part[0]).join("").slice(0,2).toUpperCase();
 return <span className={`profile-image ${className}`}>{url&&failed!==url?<img src={url} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={()=>setFailed(url)}/>:initials||"CP"}</span>;
}
export default function CardArtwork({bannerUrl,avatarUrl,name,index}:{bannerUrl?:string;avatarUrl?:string;name:string;index:number}){
 const [failed,setFailed]=useState("");
 return <div className={`card-artwork artwork-${index%4}`}>
  {bannerUrl&&failed!==bannerUrl&&<img className="card-banner" src={bannerUrl} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={()=>setFailed(bannerUrl)}/>}
  <ProfileImage url={avatarUrl} name={name} className="card-identity"/>
 </div>;
}
