"use client";
import { CheckCheck, Clock3 } from "lucide-react";
import type { Collaboration } from "./pulse";
export default function CompletionControls({request:r,userId,busy,onUpdate}:{request:Collaboration;userId?:string;busy:boolean;onUpdate:(mode:"request"|"confirm"|"ongoing")=>void}){
 if(!["accepted","completed"].includes(r.status))return null;
 if(r.completion_confirmed_at)return <section className="completion-panel confirmed"><h3><CheckCheck size={19}/>Completion confirmed by both sides</h3><p>This collaboration counts toward both profiles.{r.credited_cm_id?" The assigned CM also receives credit.":" No separate CM credit was assigned."}</p></section>;
 const pending=!!r.completion_requested_by;
 const canConfirm=pending&&r.completion_requested_side!==r.completion_side&&r.completion_requested_by!==userId;
 return <section className="completion-panel"><h3><Clock3 size={19}/>{pending?"Awaiting completion confirmation":"Finish this collaboration"}</h3><p>{pending?canConfirm?"The other side marked this collaboration as done. Confirm only when the agreed work is complete.":"Your side marked this as done. It will count after the other side confirms.":r.status==="completed"?"This older completion has not been confirmed by both sides. Request confirmation to add it to your track record.":"Either side can mark the work done. It counts only after the other side confirms."}</p><div className="completion-actions">{!pending?<button className="primary-btn" disabled={busy} onClick={()=>onUpdate("request")}>Mark as completed</button>:<>{canConfirm&&<button className="primary-btn" disabled={busy} onClick={()=>onUpdate("confirm")}>Confirm completion</button>}<button className="secondary-btn" disabled={busy} onClick={()=>onUpdate("ongoing")}>{canConfirm?"Still ongoing":"Withdraw completion request"}</button></>}</div><small>Existing approved spots stay reserved while confirmation is pending.</small></section>;
}
