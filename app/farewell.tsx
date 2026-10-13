import { BrandMark } from "./brand";

function WaveArtwork(){
 return <svg className="farewell-art" viewBox="0 0 640 300" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two colourful friends waving goodbye beneath a heart">
  <rect width="640" height="300" rx="20" fill="#FFF58A"/>
  <path d="M0 262C103 229 187 278 293 245C416 207 500 245 640 212V300H0V262Z" fill="#FFE345"/>
  <path d="M110 300V191C110 166 130 146 155 146H212C240 146 263 169 263 197V300" fill="#3559F4"/>
  <circle cx="184" cy="111" r="44" fill="#3559F4"/>
  <circle cx="172" cy="105" r="4" fill="#111B30"/><circle cx="196" cy="105" r="4" fill="#111B30"/>
  <path d="M172 120Q184 133 196 120" stroke="#111B30" strokeWidth="4" strokeLinecap="round"/>
  <path d="M121 177L87 221" stroke="#3559F4" strokeWidth="28" strokeLinecap="round"/>
  <g className="farewell-wave"><path d="M242 180L283 142L275 84" stroke="#3559F4" strokeWidth="28" strokeLinecap="round"/><path d="M275 84L260 62M275 84L276 55M275 84L294 64" stroke="#3559F4" strokeWidth="10" strokeLinecap="round"/></g>
  <path d="M384 300V204C384 176 407 153 435 153H479C507 153 530 176 530 204V300" fill="#FF7628"/>
  <circle cx="456" cy="119" r="42" fill="#FF7628"/>
  <circle cx="444" cy="114" r="4" fill="#111B30"/><circle cx="468" cy="114" r="4" fill="#111B30"/>
  <path d="M444 128Q456 141 468 128" stroke="#111B30" strokeWidth="4" strokeLinecap="round"/>
  <path d="M398 184L362 151L368 108M515 187L552 225" stroke="#FF7628" strokeWidth="26" strokeLinecap="round"/>
  <path d="M329 80C300 61 310 37 329 49C348 37 358 61 329 80Z" fill="#FF7628"/>
  <path d="M63 77L68 59M570 98L587 88M316 117L322 127" stroke="#111B30" strokeWidth="4" strokeLinecap="round"/>
  <circle cx="557" cy="47" r="6" fill="#3559F4"/><circle cx="74" cy="136" r="5" fill="#FF7628"/>
 </svg>;
}
export default function Farewell({signedOut=false,error=false}:{signedOut?:boolean;error?:boolean}){
 return <main className="farewell-shell"><div className="farewell-wrap">
  <a className="farewell-brand" href="/"><BrandMark/><span>Community Pulse</span></a>
  <WaveArtwork/>
  <section className="farewell-message"><p className="farewell-eyebrow">{signedOut?"See you around":"A little break?"}</p>
   <h1>{signedOut?<>We’ll miss <em>your energy.</em></>:<>Heading <em>out?</em></>}</h1>
   <p>{signedOut?"You’re signed out. Come back whenever you’re ready to make your next connection.":"We’ll keep your place in the community. Sign out for now, or stay a little longer."}</p>
   {error&&<p className="farewell-error" role="alert">We couldn’t sign you out. Please try again.</p>}
   <div className="farewell-actions">{signedOut?<><a className="primary-btn" href="/login">Sign back in <span aria-hidden="true">↗</span></a><a className="secondary-btn" href="/">Browse the directory</a></>:<><form action="/auth/logout" method="post"><button className="primary-btn" type="submit">Sign out for now</button></form><a className="secondary-btn" href="/">I’ll stay</a></>}</div>
   <p className="farewell-footnote">Good connections are worth coming back for.</p>
  </section>
 </div></main>;
}
