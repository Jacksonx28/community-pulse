import { z } from "zod";
export const accountAlias=z.string().trim().transform(v=>v.replace(/^@/,"").toLowerCase()).pipe(z.string().regex(/^[a-z0-9_]{3,30}$/,"Use 3 to 30 letters, numbers or underscores for your alias."));
const photo=z.string().max(350000,"Choose a smaller photo.").refine(value=>{
 if(!value)return true;
 if(value.startsWith("https://")){try{return new URL(value).protocol==="https:"&&value.length<=2000}catch{return false}}
 if(!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(value))return false;
 try{const bytes=atob(value.split(",")[1]);return value.startsWith("data:image/jpeg;")?bytes.startsWith("\xff\xd8\xff"):value.startsWith("data:image/png;")?bytes.startsWith("\x89PNG\r\n\x1a\n"):bytes.startsWith("RIFF")&&bytes.slice(8,12)==="WEBP"}catch{return false}
},"Choose a JPG, PNG or WebP photo.");
export const accountInput=z.object({displayName:z.string().trim().min(2,"Enter your name or display name.").max(80),username:accountAlias,avatar:photo}).strict();
