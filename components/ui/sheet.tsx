"use client";
// Adapted from EasyUI Sheet (MIT), retaining Radix focus and keyboard management.
import * as React from "react";
import { AnimatePresence,motion,useDragControls,useReducedMotion,type PanInfo } from "framer-motion";
import { ArrowLeft,XIcon } from "lucide-react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
const Context=React.createContext({open:false,setOpen:(_v:boolean)=>{}});
function Sheet({open:controlled,defaultOpen=false,onOpenChange,children,...props}:React.ComponentProps<typeof SheetPrimitive.Root>){
 const [internal,setInternal]=React.useState(defaultOpen);const open=controlled??internal;
 const change=React.useCallback((next:boolean)=>{if(controlled===undefined)setInternal(next);onOpenChange?.(next)},[controlled,onOpenChange]);
 return <Context.Provider value={{open,setOpen:change}}><SheetPrimitive.Root {...props} open={open} onOpenChange={change}>{children}</SheetPrimitive.Root></Context.Provider>;
}
function SheetTrigger(props:React.ComponentProps<typeof SheetPrimitive.Trigger>){return <SheetPrimitive.Trigger {...props}/>}
function SheetClose(props:React.ComponentProps<typeof SheetPrimitive.Close>){return <SheetPrimitive.Close {...props}/>}
function SheetContent({className,children,side="right",showCloseButton=true,closeLabel="Close",...props}:React.ComponentProps<typeof SheetPrimitive.Content>&{side?:"top"|"right"|"bottom"|"left";showCloseButton?:boolean;closeLabel?:string}){
 const {open,setOpen}=React.useContext(Context);const controls=useDragControls();const reduced=useReducedMotion();const [compact,setCompact]=React.useState(false);
 React.useEffect(()=>{const q=window.matchMedia("(max-width: 639px)");const sync=()=>setCompact(q.matches);sync();q.addEventListener("change",sync);return()=>q.removeEventListener("change",sync)},[]);
 const edge=compact?"bottom":side;const horizontal=edge==="left"||edge==="right";const from=edge==="bottom"?{y:"100%"}:edge==="top"?{y:"-100%"}:edge==="left"?{x:"-100%"}:{x:"100%"};
 const dismiss=(_:unknown,info:PanInfo)=>{const offset=horizontal?info.offset.x:info.offset.y;const velocity=horizontal?info.velocity.x:info.velocity.y;const sign=edge==="left"||edge==="top"?-1:1;if(offset*sign>76||velocity*sign>600)setOpen(false)};
 return <AnimatePresence>{open&&<SheetPrimitive.Portal forceMount>
  <SheetPrimitive.Overlay forceMount asChild><motion.div className="pulse-drawer-scrim" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:reduced?0:0.18}}/></SheetPrimitive.Overlay>
  <SheetPrimitive.Content {...props} forceMount asChild><motion.div data-slot="sheet-content" data-edge={edge} className={cn("pulse-drawer",className)} initial={reduced?false:from} animate={{x:0,y:0}} exit={reduced?undefined:from} transition={{type:"spring",stiffness:380,damping:38,mass:0.9}} drag={horizontal?"x":"y"} dragControls={controls} dragListener={false} dragConstraints={{left:0,right:0,top:0,bottom:0}} dragElastic={0.22} dragMomentum={false} onDragEnd={dismiss}>
   <div className="pulse-drawer-chrome">{compact&&<button type="button" aria-label="Drag down to dismiss panel" tabIndex={-1} className="pulse-drawer-grab" onPointerDown={event=>controls.start(event)} onClick={()=>setOpen(false)}><span/></button>}{showCloseButton&&<div className="overlay-close-bar"><SheetPrimitive.Close className="overlay-close-button" aria-label={closeLabel==="Back"?"Back to directory":"Close panel"}>{closeLabel==="Back"?<ArrowLeft size={19}/>:<XIcon size={19}/>}<span>{closeLabel}</span></SheetPrimitive.Close></div>}</div>
   <div className="overlay-sheet-body">{children}</div>
  </motion.div></SheetPrimitive.Content>
 </SheetPrimitive.Portal>}</AnimatePresence>;
}
function SheetHeader({className,...props}:React.ComponentProps<"div">){return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 p-4",className)} {...props}/>}
function SheetFooter({className,...props}:React.ComponentProps<"div">){return <div className={cn("mt-auto flex flex-col gap-2 p-4",className)} {...props}/>}
function SheetTitle({className,...props}:React.ComponentProps<typeof SheetPrimitive.Title>){return <SheetPrimitive.Title data-slot="sheet-title" className={cn("font-semibold text-foreground",className)} {...props}/>}
function SheetDescription({className,...props}:React.ComponentProps<typeof SheetPrimitive.Description>){return <SheetPrimitive.Description data-slot="sheet-description" className={cn("text-sm text-muted-foreground",className)} {...props}/>}
export {Sheet,SheetTrigger,SheetClose,SheetContent,SheetHeader,SheetTitle,SheetDescription,SheetFooter};
