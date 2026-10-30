"use client";
import { Sheet,SheetContent,SheetHeader,SheetTitle,SheetDescription } from "@/components/ui/sheet";
export default function FilterSheet({open,onOpenChange,title,children,onReset,count}:{open:boolean;onOpenChange:(v:boolean)=>void;title:string;children:React.ReactNode;onReset:()=>void;count:number}){
 return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent className="filter-sheet" side="right"><SheetHeader><SheetTitle>{title}</SheetTitle><SheetDescription>Choose what matters. Results update as you filter.</SheetDescription></SheetHeader><div className="filter-sheet-fields">{children}</div><div className="filter-sheet-footer"><button type="button" className="secondary-btn" onClick={onReset}>Reset filters</button><button type="button" className="primary-btn" onClick={()=>onOpenChange(false)}>Show {count} {count===1?"result":"results"}</button></div></SheetContent></Sheet>;
}
