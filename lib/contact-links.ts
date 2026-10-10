export type ContactIdentity={handle?:string;x_user_id?:string;discord_user_id?:string;prototype?:boolean};
export function contactLinks(contact:ContactIdentity,message=""){
  if(contact.prototype)return {xDm:null,xProfile:null,discordProfile:null};
  const handle=/^[A-Za-z0-9_]{1,15}$/.test(contact.handle||"")?contact.handle:null;
  const xId=/^[1-9]\d{0,19}$/.test(contact.x_user_id||"")?contact.x_user_id:null;
  const discordId=/^[1-9]\d{16,19}$/.test(contact.discord_user_id||"")?contact.discord_user_id:null;
  const params=xId?new URLSearchParams({recipient_id:xId,...(message?{text:message}:{})}):null;
  return {xDm:params?`https://x.com/messages/compose?${params.toString()}`:null,
    xProfile:handle?`https://x.com/${handle}`:null,discordProfile:discordId?`https://discord.com/users/${discordId}`:null};
}
