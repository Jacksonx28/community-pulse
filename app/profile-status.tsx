import { BadgeCheck, Info } from "lucide-react";
import type { Community } from "./pulse";
export default function ProfileStatus({profile}:{profile:Community}){
 const approved=profile.kind==="CM"&&!!profile.approved_project_ids?.length;
 const Icon=approved?BadgeCheck:Info;
 return <span className={`status-pill profile-status ${approved?"affiliation-approved":"affiliation-reported"}`} title={approved?"A listed project or community owner invited this CM and the CM accepted. This confirms the affiliation, not independent identity verification.":"These details were supplied by the profile creator."}><Icon size={13}/>{approved?"Owner approved":"Self-reported"}</span>;
}
