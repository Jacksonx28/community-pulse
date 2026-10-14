"use client";
import { ThemeProvider } from "next-themes";
export function AppearanceProvider({children}:{children:React.ReactNode}){
 return <ThemeProvider attribute="class" forcedTheme="light" defaultTheme="light" enableSystem={false} enableColorScheme={false} storageKey="community-pulse-theme" disableTransitionOnChange>{children}</ThemeProvider>;
}
export function ThemeControl(){return null}
export function ThemeOptions(){return <p className="muted">Community Pulse uses a light appearance.</p>}
