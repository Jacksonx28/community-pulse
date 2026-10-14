"use client";
import { useState } from "react";
import { Users, Layers3, BriefcaseBusiness, Check, ArrowRight } from "lucide-react";
import { BrandMark } from "./brand";
import { profileSetupHref, type ProfileKind } from "@/lib/onboarding";
const roles=[{kind:"Community",title:"Represent a community / DAO",description:"Find opportunities and connect directly with projects.",Icon:Users},{kind:"Project",title:"Manage a project",description:"Offer spots, approve your CMs and find collaborators.",Icon:Layers3},{kind:"CM",title:"Work as a CM",description:"Show your experience and the teams you work with.",Icon:BriefcaseBusiness}] as const;
export default function WelcomeStart({displayName,onContinue,onExplore}:{displayName:string;onContinue:()=>void;onExplore:()=>void}){
 const [role,setRole]=useState<ProfileKind>("Community");
 const greeting=displayName.includes("@")?"Welcome":`Welcome, ${displayName.trim().split(/\s+/)[0]||"friend"}`;
 return <main className="welcome-start"><header className="welcome-start-header"><a className="brand-lockup" href="/"><BrandMark/><span>Community Pulse</span></a></header><section className="welcome-start-content"><p className="welcome-eyebrow">{greeting}</p><h1>Make yourself at home.</h1><p className="welcome-introduction">Start with the profile that fits you. You can use more than one role with this account.</p><div className="welcome-roles" role="group" aria-label="Choose your first profile">{roles.map(({kind,title,description,Icon})=><button type="button" key={kind} className="welcome-role" aria-pressed={role===kind} onClick={()=>setRole(kind)}><span className="welcome-role-icon"><Icon size={22}/></span><span className="welcome-role-copy"><strong>{title}</strong><small>{description}</small></span><Check className="welcome-role-check" size={19} aria-hidden="true"/></button>)}</div><a className="primary-btn full-width welcome-continue" href={profileSetupHref(role)} onClick={onContinue}>Continue as {role==="Community"?"Community / DAO":role==="CM"?"a CM":"a project"}<ArrowRight size={17}/></a><button type="button" className="welcome-explore" onClick={onExplore}>I’ll explore first<ArrowRight size={16}/></button></section></main>;
}
