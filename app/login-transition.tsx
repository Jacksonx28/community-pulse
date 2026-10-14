"use client";
import { useEffect, useState } from "react";
import BrandLoading from "./brand-loading";
export default function LoginTransition({children}:{children:React.ReactNode}){
 const [leaving,setLeaving]=useState(false);
 useEffect(()=>{const reset=()=>setLeaving(false);window.addEventListener("pageshow",reset);return()=>window.removeEventListener("pageshow",reset)},[]);
 return <div className="login-transition" onClick={event=>{if(event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0)return;const target=event.target instanceof Element?event.target.closest('a[href^="/auth/start?"]'):null;if(target)setLeaving(true)}}>{children}{leaving&&<div className="login-transition-overlay"><BrandLoading message="Connecting you securely to sign in…"/></div>}</div>;
}
