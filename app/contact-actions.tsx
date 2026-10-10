"use client";
import { useState } from "react";
import { Copy, ExternalLink, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { contactLinks } from "@/lib/contact-links";
import type { Community } from "./pulse";
import { toast } from "sonner";
export default function ContactActions({contact,message="",showDraft=false}:{contact:Community;message?:string;showDraft?:boolean}){
 const [draft,setDraft]=useState(message);
 const [preview,setPreview]=useState<"X"|"Discord"|null>(null);const links=contactLinks(contact,draft);
 const copy=async()=>{try{await navigator.clipboard.writeText(draft);toast.success("Collaboration message copied.")}catch{toast.error("Could not copy automatically. Select the message below and copy it.")}};
 return <div className="contact-actions"><div className="contact-method-buttons">{contact.prototype?<><button className="secondary-btn" onClick={()=>setPreview("X")}><MessageSquare size={16}/>Preview X DM</button><button className="secondary-btn" onClick={()=>setPreview("Discord")}><MessageSquare size={16}/>Preview Discord</button></>:<>{links.xDm?<a className="secondary-btn" href={links.xDm} target="_blank" rel="noreferrer"><MessageSquare size={16}/>Message on X<ExternalLink size={13}/></a>:links.xProfile?<a className="secondary-btn" href={links.xProfile} target="_blank" rel="noreferrer"><ExternalLink size={15}/>Open X profile</a>:null}{links.discordProfile&&<a className="secondary-btn" href={links.discordProfile} target="_blank" rel="noreferrer"><MessageSquare size={16}/>Open Discord profile<ExternalLink size={13}/></a>}</>}{showDraft&&message&&<button className="secondary-btn" onClick={()=>void copy()}><Copy size={15}/>Copy message</button>}</div>
 {!contact.prototype&&<p className="contact-method-note">{links.discordProfile?"On Discord, choose Message on the profile. ":""}{links.xDm||links.discordProfile?"Messaging depends on the recipient’s privacy settings.":"Direct message links appear when the representative supplies their numeric account IDs."}</p>}
 {contact.prototype&&<p className="contact-method-note">Prototype contact. These previews do not open or message a real account.</p>}
 {showDraft&&message&&<div className="collaboration-message-preview"><label htmlFor="contact-draft">Edit your collaboration message</label><textarea id="contact-draft" aria-label="Collaboration message draft" value={draft} onChange={e=>setDraft(e.target.value)} rows={9} maxLength={4000}/><small>Edits apply to the message you copy or open on X. Your saved request remains unchanged.</small></div>}
 <Dialog open={!!preview} onOpenChange={open=>!open&&setPreview(null)}><DialogContent className="pulse-dialog"><DialogHeader><DialogTitle>{preview} conversation preview</DialogTitle><DialogDescription>{contact.representative} · prototype contact. No message will be sent.</DialogDescription></DialogHeader><div className="demo-chat"><span className="demo-chat-label">Draft to {contact.representative}</span><p>{draft||`Hi ${contact.representative}, I’d like to discuss a collaboration for my community.`}</p><span className="demo-chat-label">Prototype only · not sent</span></div></DialogContent></Dialog>
 </div>;
}
