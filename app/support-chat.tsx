"use client";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { supportAnswer, helpTopics, type SupportAnswer } from "@/lib/support-answers";
type Message={id:number;role:"user"|"help";text:string;answer?:SupportAnswer};
export default function SupportChat({onNavigate}:{onNavigate:(view:"discover"|"inbox"|"profiles")=>void}){
 const [open,setOpen]=useState(false);const [input,setInput]=useState("");const [messages,setMessages]=useState<Message[]>([{id:0,role:"help",text:"Hi! I can explain profiles, requests, spots, and hiring. What would you like help with?"}]);
 const [launcherVisible,setLauncherVisible]=useState(false);const [typingId,setTypingId]=useState<number|null>(null);const [characters,setCharacters]=useState(0);const [reducedMotion,setReducedMotion]=useState(false);
 const nextId=useRef(1);const log=useRef<HTMLDivElement>(null);const follow=useRef(true);
 useEffect(()=>{
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");const preference=()=>setReducedMotion(media.matches);preference();media.addEventListener("change",preference);
  const reveal=()=>setLauncherVisible(window.scrollY>120||document.documentElement.scrollHeight<=window.innerHeight+120);
  reveal();window.addEventListener("scroll",reveal,{passive:true});window.addEventListener("resize",reveal);
  const resize=new ResizeObserver(reveal);resize.observe(document.body);
  return ()=>{media.removeEventListener("change",preference);window.removeEventListener("scroll",reveal);window.removeEventListener("resize",reveal);resize.disconnect()};
 },[]);
 useEffect(()=>{if(open&&follow.current&&log.current)log.current.scrollTop=log.current.scrollHeight},[messages,open,characters]);
 useEffect(()=>{
  if(typingId===null)return;
  const message=messages.find(m=>m.id===typingId);
  if(!message||reducedMotion||!open){setTypingId(null);return}
  let count=0;setCharacters(0);
  const timer=window.setInterval(()=>{count=Math.min(count+4,message.text.length);setCharacters(count);if(count===message.text.length){window.clearInterval(timer);setTypingId(null)}},24);
  return ()=>window.clearInterval(timer);
 },[typingId,messages,reducedMotion,open]);
 const ask=(question:string)=>{
  const trimmed=question.trim();if(!trimmed)return;
  const answer=supportAnswer(trimmed);const userId=nextId.current++;const replyId=nextId.current++;
  follow.current=true;setCharacters(0);setTypingId(reducedMotion?null:replyId);setMessages(previous=>[...previous.slice(-38),{id:userId,role:"user",text:trimmed},{id:replyId,role:"help",text:answer.text,answer}]);setInput("");
 };
 return <>{launcherVisible&&<button className="support-launcher support-launcher-enter" aria-label="Open Community Pulse help" onClick={()=>setOpen(true)}><MessageCircle size={20}/><span>Help</span></button>}<Sheet open={open} onOpenChange={setOpen}><SheetContent className="support-sheet"><SheetHeader><SheetTitle>Community Pulse help</SheetTitle><SheetDescription>Preset answers · no live agent connected</SheetDescription></SheetHeader><div ref={log} className="support-log" role="log" aria-live="polite" aria-label="Help conversation" onScroll={()=>{if(log.current)follow.current=log.current.scrollHeight-log.current.scrollTop-log.current.clientHeight<80}}>{messages.map(message=>{
 const typing=message.id===typingId;
 return <div key={message.id} className={`support-bubble support-${message.role} support-message-enter`}><small>{message.role==="user"?"You":"Quick help"}</small>{typing?<><p aria-hidden="true">{message.text.slice(0,characters)}<span className="support-typing-cursor"/></p><span className="sr-only">Quick help is typing a reply.</span></>:<p>{message.text}</p>}{!typing&&message.answer?.view&&<button className="text-link" onClick={()=>{onNavigate(message.answer!.view!);setOpen(false)}}>{message.answer.action}</button>}</div>
 })}</div><div className="support-topics">{helpTopics.map(topic=><button key={topic} onClick={()=>ask(topic)}>{topic}</button>)}</div><form className="support-input" onSubmit={e=>{e.preventDefault();ask(input)}}><input aria-label="Ask about Community Pulse" value={input} maxLength={500} onChange={e=>setInput(e.target.value)} placeholder="Ask about Community Pulse…"/><button type="submit" disabled={!input.trim()} aria-label="Ask help assistant"><Send size={18}/></button></form></SheetContent></Sheet></>;
}
