import { BrandMark } from "./brand";
export default function BrandLoading({message="Your next connection starts here."}:{message?:string}){
 return <div className="brand-loading" role="status" aria-live="polite"><div className="brand-loading-inner"><div className="brand-loading-mark"><BrandMark/></div><h1>Welcome to Community Pulse</h1><p>{message}</p><span className="brand-loading-track" aria-hidden="true"/></div></div>;
}
