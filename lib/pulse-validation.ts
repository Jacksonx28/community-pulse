import { z } from "zod";
const webUrl=z.string().trim().max(400).refine(value=>{try {return ["https:","http:"].includes(new URL(value).protocol)}catch{return false}},"Enter a valid website URL.");
export const communityInput=z.object({
  id:z.string().uuid().optional(),
  name:z.string().trim().min(2).max(80),kind:z.enum(["Community","Project","CM"]),ecosystem:z.enum(["Multichain","Ethereum","Base","Solana","Robinhood Chain","Arc","Sui","Other"]),
  description:z.string().trim().min(10).max(600),representative:z.string().trim().min(2).max(80),
  role:z.enum(["Community manager","Collab manager","Founder","Partnerships lead"]),
  handle:z.string().trim().regex(/^(?:@?[A-Za-z0-9_]{1,15})?$/, "Enter an X handle, without a URL."),officialUrl:z.union([webUrl,z.literal("")]),open:z.boolean(),
  projectCategory:z.enum(["NFT","Gaming","DeFi","Infrastructure","Other"]).default("Other"),
  handlesSpots:z.boolean().default(false),
  projectCMIds:z.array(z.string().uuid()).max(10).default([]),
  managerProfileId:z.union([z.string().uuid(),z.literal("")]).default(""),
  audienceSize:z.number().int().min(0).max(100000000).default(0),
  interests:z.string().trim().max(300).default(""),
  pastCollaborations:z.string().trim().max(600).default(""),
  avatarUrl:z.union([webUrl,z.literal("")]).default(""),
  bannerUrl:z.union([webUrl,z.literal("")]).default(""),
  availability:z.enum(["Available for hire","Open to more projects","Busy"]).default("Available for hire"),
  currentProjects:z.string().trim().max(400).default(""),
  contactRoute:z.enum(["CM","Project team"]).default("CM"),
  spotsListed:z.boolean().default(false),availableSpots:z.number().int().min(0).max(1000000).default(0),
  spotsDeadline:z.string().regex(/^(?:\d{4}-\d{2}-\d{2})?$/).default(""),eligibility:z.string().trim().max(600).default(""),
  hiring:z.boolean().default(false),hiringDetails:z.string().trim().max(600).default(""),compensation:z.string().trim().max(200).default(""),
  xUserId:z.string().regex(/^(?:[1-9]\d{0,19})?$/, "Enter a numeric X user ID, or leave it blank.").default(""),
  discordUserId:z.string().regex(/^(?:[1-9]\d{16,19})?$/, "Enter a numeric Discord user ID, or leave it blank.").default(""),
}).strict().superRefine((d,ctx)=>{
 if(d.kind!=="CM"&&!d.officialUrl)ctx.addIssue({code:"custom",message:"Add an official project or community link."});
 if(d.kind==="Project"&&d.spotsListed&&(!d.handlesSpots||!d.spotsDeadline||!d.eligibility||d.availableSpots<1))ctx.addIssue({code:"custom",message:"Spot listings need an allocation, deadline, eligibility, and allocation responsibility."});
 if(d.kind==="Project"&&d.hiring&&!d.hiringDetails)ctx.addIssue({code:"custom",message:"Describe the CM role you are hiring for."});
});
export const requestInput=z.object({communityPlatform:z.enum(["Discord","Telegram","X","Not specified"]).default("Not specified"),assignedCMId:z.string().uuid().nullable().optional(),sourceId:z.string().uuid(),targetId:z.string().uuid(),title:z.string().trim().min(3).max(100),
  kind:z.enum(["Whitelist spots","Joint Space","Campaign","Partnership","Hire CM","CM application"]),spots:z.number().int().min(0).max(10000),
  deadline:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(x=>!Number.isNaN(Date.parse(x))),message:z.string().trim().min(10).max(1500),
}).strict().refine(x=>x.kind==="Whitelist spots"?x.spots>0:x.spots===0,{message:"Request at least one whitelist spot; other request types must have zero spots."});
export const responseInput=z.object({id:z.string().uuid(),status:z.enum(["discussing","accepted","declined","cancelled","completed"]),approvedSpots:z.number().int().min(0).max(10000).optional()}).strict();
export const teamInput=z.object({projectId:z.string().uuid(),cmId:z.string().uuid(),mode:z.enum(["invite","accept","decline","revoke"])}).strict();
export const readInput=z.object({id:z.string().uuid()}).strict();
export const reportInput=z.object({profileId:z.string().uuid(),kind:z.enum(["Incorrect contact","Claim profile"]),message:z.string().trim().min(20).max(1000)}).strict();
export const reviewInput=z.object({id:z.string().uuid(),status:z.enum(["reviewed","dismissed"])}).strict();
