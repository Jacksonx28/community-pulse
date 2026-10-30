"use client";
// Adapted from EasyUI Morphing Button (MIT). See THIRD_PARTY_LICENSES/EasyUI-MIT.txt.
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export type SubmissionStatus="idle"|"loading"|"success"|"error";
export type MorphingButtonProps=Omit<ButtonHTMLAttributes<HTMLButtonElement>,"onAnimationStart"|"onDrag"|"onDragEnd"|"onDragStart"|"style">&{status:SubmissionStatus;idleText:string;loadingText?:string;successText?:string;errorText?:string};
export function MorphingButton({status,idleText,loadingText="Saving…",successText="Saved",errorText="Try again",className,disabled,...props}:MorphingButtonProps){
 const reduced=useReducedMotion();
 const labels={idle:idleText,loading:loadingText,success:successText,error:errorText};
 const Icon=status==="loading"?Loader2:status==="success"?Check:status==="error"?AlertCircle:null;
 return <motion.button {...props} className={cn("primary-btn morphing-submit",className)} data-status={status} aria-busy={status==="loading"} aria-label={labels[status]} disabled={disabled||status==="loading"||status==="success"} whileTap={reduced||disabled?undefined:{scale:0.985}} transition={{type:"spring",stiffness:450,damping:36}}>
  <span className="morphing-size-guide" aria-hidden>{[idleText,loadingText,successText,errorText].map((s,i)=><span key={i}>{s}</span>)}</span>
  <AnimatePresence mode="wait" initial={false}><motion.span key={status} className="morphing-label" initial={reduced?false:{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={reduced?undefined:{opacity:0,y:-4}} transition={{duration:reduced?0:0.12}}>{Icon&&<Icon size={17} className={status==="loading"?"submission-spinner":""}/>}<span>{labels[status]}</span></motion.span></AnimatePresence>
  <span className="sr-only" role="status" aria-live="polite">{status==="success"?successText:status==="error"?"Save failed. Check the message above and try again.":""}</span>
 </motion.button>;
}
export function feedbackPause(){return new Promise<void>(resolve=>window.setTimeout(resolve,700))}
