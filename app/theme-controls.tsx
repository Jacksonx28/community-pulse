"use client";
import { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";

export function AppearanceProvider({children}:{children:React.ReactNode}){
 return <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="community-pulse-theme" disableTransitionOnChange>{children}</ThemeProvider>;
}
export function ThemeControl(){
 const {theme,setTheme}=useTheme();
 const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 const choice=mounted?theme||"system":"system";
 const Icon=choice==="dark"?Moon:choice==="light"?Sun:Monitor;
 return <DropdownMenu><DropdownMenuTrigger asChild><button className="theme-control" aria-label={`Appearance: ${choice}. Change theme`} title="Change appearance"><Icon size={19}/></button></DropdownMenuTrigger><DropdownMenuContent align="end" sideOffset={12} className="appearance-menu"><DropdownMenuLabel>Appearance</DropdownMenuLabel><DropdownMenuSeparator/><DropdownMenuRadioGroup value={choice} onValueChange={setTheme}><DropdownMenuRadioItem value="light"><Sun size={17}/>Light</DropdownMenuRadioItem><DropdownMenuRadioItem value="dark"><Moon size={17}/>Dark</DropdownMenuRadioItem><DropdownMenuRadioItem value="system"><Monitor size={17}/>System</DropdownMenuRadioItem></DropdownMenuRadioGroup><p className="appearance-note">System follows your device.</p></DropdownMenuContent></DropdownMenu>;
}

export function ThemeOptions(){
 const {theme,setTheme}=useTheme();
 const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 const options=[{value:"light",label:"Light",description:"A bright workspace",Icon:Sun},{value:"dark",label:"Dark",description:"A darker workspace",Icon:Moon},{value:"system",label:"System",description:"Follow your device",Icon:Monitor}];
 return <RadioGroup aria-label="Appearance" className="settings-theme-options" value={mounted?theme||"system":"system"} onValueChange={setTheme}>{options.map(({value,label,description,Icon})=><label className="settings-theme-option" key={value} htmlFor={`settings-theme-${value}`}><Icon size={21}/><span><strong>{label}</strong><small>{description}</small></span><RadioGroupItem id={`settings-theme-${value}`} value={value}/></label>)}</RadioGroup>;
}
