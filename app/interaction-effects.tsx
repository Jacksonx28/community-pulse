"use client";
import { useEffect } from "react";

export default function InteractionEffects(){
 useEffect(()=>{
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const animations=new Map<HTMLElement,Animation>();
  const feedback=(event:MouseEvent)=>{
   if(reduced.matches||!(event.target instanceof Element))return;
   const target=event.target.closest<HTMLElement>('button, a, [role="menuitem"], [role="radio"]');
   if(!target||target.matches(':disabled, [aria-disabled="true"]'))return;
   animations.get(target)?.cancel();
   const transform=getComputedStyle(target).transform;
   const base=transform==="none"?"":transform;
   const animation=target.animate([{transform:`${base} scale(1)`},{transform:`${base} scale(.965)`},{transform:`${base} scale(1)`}],{duration:210,easing:"cubic-bezier(.2,.8,.2,1)"});
   animations.set(target,animation);
   animation.onfinish=()=>{if(animations.get(target)===animation)animations.delete(target)};
  };
  const stop=()=>{if(reduced.matches){animations.forEach(a=>a.cancel());animations.clear()}};
  document.addEventListener("click",feedback,true);reduced.addEventListener("change",stop);
  return ()=>{document.removeEventListener("click",feedback,true);reduced.removeEventListener("change",stop);animations.forEach(a=>a.cancel())};
 },[]);
 return null;
}
