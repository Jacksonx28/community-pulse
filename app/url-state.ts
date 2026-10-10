"use client";
import { useCallback, useEffect, useState } from "react";
export function useURLState<T extends string>(key:string,fallback:T,allowed?:readonly T[],initial?:T){
 const [value,setValue]=useState<T>(initial||fallback);const allowedKey=allowed?.join("|")||"";
 useEffect(()=>{const sync=()=>{const raw=new URLSearchParams(window.location.search).get(key);setValue(raw&&(!allowedKey||allowedKey.split("|").includes(raw))?raw as T:fallback)};sync();window.addEventListener("popstate",sync);window.addEventListener("pulse-url-change",sync);return()=>{window.removeEventListener("popstate",sync);window.removeEventListener("pulse-url-change",sync)}},[key,fallback,allowedKey]);
 const update=useCallback((next:T)=>{const url=new URL(window.location.href);if(next===fallback)url.searchParams.delete(key);else url.searchParams.set(key,next);if(key==='view')url.searchParams.delete('profile');if(url.href!==window.location.href){if(key==="q")window.history.replaceState(null,"",url);else window.history.pushState(null,"",url);window.dispatchEvent(new Event("pulse-url-change"))}setValue(next)},[key,fallback]);
 return [value,update] as const;
}
