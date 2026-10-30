"use client";
import { useEffect,useRef,useState } from "react";
import { Compass,ArrowRight } from "lucide-react";
import { ProductTour,type TourStep } from "@/components/pulse-ui/product-tour";
const steps:TourStep[]=[
 {target:'[data-tour="project-basics"]',title:"Introduce your project",body:"Add your project’s name and a short description. Communities use these details to understand who they’re collaborating with.",placement:"right"},
 {target:'[data-tour="project-cms"]',title:"Add the people behind your collabs",body:"Search and list your CMs here. After saving, invite them from your project profile. Their acceptance confirms the affiliation and activates inbox access.",placement:"right"},
 {target:'[data-tour="project-spots"]',title:"Give communities a way in",body:"Turn on Offer whitelist spots, choose an allocation and deadline, and explain who can apply. Save your profile when you’re ready. This tour doesn’t publish anything.",placement:"right"}
];
export default function ProjectSetupTour(){
 const [open,setOpen]=useState(false);const before=useRef<boolean[]>([]);const trigger=useRef<HTMLButtonElement>(null);
 const reveal=(index:number)=>{const target=steps[index].target;if(typeof target!=="string")return;const el=document.querySelector<HTMLElement>(target);if(el instanceof HTMLDetailsElement)el.open=true;};
 const start=()=>{before.current=["project-cms","project-spots"].map(id=>!!document.querySelector<HTMLDetailsElement>(`[data-tour="${id}"]`)?.open);setOpen(true)};
 useEffect(()=>{if(new URLSearchParams(window.location.search).get("tour")==="project")start()},[]);
 const close=()=>{setOpen(false);["project-cms","project-spots"].forEach((id,i)=>{const el=document.querySelector<HTMLDetailsElement>(`[data-tour="${id}"]`);if(el)el.open=before.current[i]||false});requestAnimationFrame(()=>trigger.current?.focus({preventScroll:true}))};
 return <><div className="project-tour-intro"><Compass size={20}/><div><strong>A little help getting started</strong><p>Three steps to make your project ready for collabs.</p></div><button ref={trigger} type="button" className="text-link" onClick={start}>Take a quick tour<ArrowRight size={15}/></button></div><ProductTour open={open} steps={steps} onStepChange={reveal} onClose={close}/></>;
}
