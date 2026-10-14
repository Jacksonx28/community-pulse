import { BadgeCheck, Info } from "lucide-react";
import type { Community } from "./pulse";
export default function ProfileStatus({profile}:{profile:Community}){
 const approved=profile.kind==="CM"&&!!profile.approved_project_ids?.length;
 const Icon=approved?BadgeCheck:Info;
 return <span className={`status-pill profile-status ${approved?"affiliation-approved":"affiliation-reported"}`} title={approved?"A listed project or community owner invited this CM and the CM accepted. This confirms the affiliation, not independent identity verification.":"These details were supplied by the profile creator."}><Icon size={13}/>{approved?"Owner approved":"Self-reported"}</span>;
}

export function CollaborationCount({profile}:{profile:Community}){const count=profile.confirmed_collaborations||0;return <span className="collaboration-count" title="Completed collaborations confirmed by both partner sides. Older one-sided completions are excluded.">{count} confirmed {count===1?"collaboration":"collaborations"}</span>}
