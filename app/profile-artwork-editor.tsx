"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { ProfileImage } from "./card-artwork";
import { imageCrop, PROFILE_IMAGE_LIMITS, type ProfileImageKind } from "@/lib/profile-images";

type Crop = { kind: ProfileImageKind; image: HTMLImageElement; url: string };
export default function ProfileArtworkEditor({ avatar, banner, name, disabled, onAvatar, onBanner, onBusyChange }: {
  avatar: string; banner: string; name: string; disabled: boolean;
  onAvatar: (value: string) => void; onBanner: (value: string) => void; onBusyChange: (value: boolean) => void;
}) {
  const id = useId();
  const photoInput = useRef<HTMLInputElement>(null), bannerInput = useRef<HTMLInputElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null), cropPanel = useRef<HTMLDivElement>(null), objectUrl = useRef(""), generation = useRef(0);
  const [crop, setCrop] = useState<Crop | null>(null), [processing, setProcessing] = useState(false);
  const [error, setError] = useState(""), [zoom, setZoom] = useState(1), [x, setX] = useState(50), [y, setY] = useState(50);
  const [failedBanner, setFailedBanner] = useState("");
  const busy = processing || !!crop;
  const accountPhoto = avatar.startsWith("/api/account/photo?");
  useEffect(() => { onBusyChange(busy); }, [busy, onBusyChange]);
  useEffect(() => { if (crop) { cropPanel.current?.focus({ preventScroll: true }); cropPanel.current?.scrollIntoView({ block: "nearest" }); } }, [crop]);
  useEffect(() => () => { generation.current++; if (objectUrl.current) URL.revokeObjectURL(objectUrl.current); }, []);

  function releaseCrop() {
    generation.current++;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = ""; setCrop(null); setProcessing(false);
  }
  async function choose(kind: ProfileImageKind, file: File) {
    setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10_000_000) {
      setError("Choose a JPG, PNG or WebP image up to 10 MB."); return;
    }
    const request = ++generation.current;
    setProcessing(true);
    const url = URL.createObjectURL(file); objectUrl.current = url;
    try {
      const image = new Image(); image.src = url; await image.decode();
      if (generation.current !== request) return;
      if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 60_000_000) throw Error();
      setZoom(1); setX(50); setY(50); setCrop({ kind, image, url });
    } catch {
      if (generation.current === request) { URL.revokeObjectURL(url); objectUrl.current = ""; setError("That image could not be opened. Try another JPG, PNG or WebP."); }
    } finally { if (generation.current === request) setProcessing(false); }
  }
  const draw = useCallback(() => {
    const surface = canvas.current;
    if (!surface || !crop) return null;
    const ctx = surface.getContext("2d"); if (!ctx) return null;
    const rect = imageCrop(crop.image.naturalWidth, crop.image.naturalHeight, surface.width, surface.height, zoom, x, y);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, surface.width, surface.height);
    ctx.drawImage(crop.image, rect.x, rect.y, rect.width, rect.height, 0, 0, surface.width, surface.height);
    return surface;
  }, [crop, zoom, x, y]);
  useEffect(() => { draw(); }, [draw]);
  function apply() {
    setError("");
    try {
      const surface = draw(); if (!surface || !crop) throw Error();
      let image = "";
      for (const quality of [0.88, 0.78, 0.68, 0.58, 0.48]) {
        image = surface.toDataURL("image/jpeg", quality);
        if (image.length <= PROFILE_IMAGE_LIMITS[crop.kind]) break;
      }
      if (image.length > PROFILE_IMAGE_LIMITS[crop.kind]) throw Error();
      (crop.kind === "avatar" ? onAvatar : onBanner)(image); releaseCrop();
    } catch { setError("That image could not be prepared. Try a smaller image."); }
  }
  const blocked = disabled || busy;
  return <section className="profile-artwork-editor" aria-labelledby={`${id}-title`}>
    <div className="profile-artwork-heading"><h2 id={`${id}-title`}>Profile images</h2><p>Add a photo and banner to make this profile easy to recognise.</p></div>
    <div className="profile-artwork-fields">
      <div className="profile-image-field"><strong>Profile photo</strong><div className="profile-photo-display"><ProfileImage key={avatar} url={avatar} name={name || "Community Pulse"} className="profile-upload-avatar"/></div>
        {accountPhoto && <small className="profile-artwork-hint">Using your account photo.</small>}
        <div className="profile-image-actions"><button type="button" className="secondary-btn" disabled={blocked} onClick={() => photoInput.current?.click()}><Upload size={16}/>{avatar && !accountPhoto ? "Replace photo" : "Upload photo"}</button>{avatar && !accountPhoto && <button type="button" className="text-link" disabled={blocked} onClick={() => onAvatar("")}>Remove photo</button>}</div>
        <input ref={photoInput} className="profile-image-file" tabIndex={-1} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload profile photo" disabled={blocked} onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void choose("avatar", file); }}/>
      </div>
      <div className="profile-image-field"><strong>Banner</strong><div className="profile-upload-banner">{banner && failedBanner !== banner ? <img src={banner} alt="Banner preview" referrerPolicy="no-referrer" onError={() => setFailedBanner(banner)}/> : <span><ImagePlus size={25}/>Add a wide image</span>}</div>
        <div className="profile-image-actions"><button type="button" className="secondary-btn" disabled={blocked} onClick={() => bannerInput.current?.click()}><Upload size={16}/>{banner ? "Replace banner" : "Upload banner"}</button>{banner && <button type="button" className="text-link" disabled={blocked} onClick={() => onBanner("")}>Remove banner</button>}</div>
        <input ref={bannerInput} className="profile-image-file" tabIndex={-1} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload profile banner" disabled={blocked} onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void choose("banner", file); }}/>
      </div>
    </div>
    <p className="profile-artwork-hint">JPG, PNG or WebP. Up to 10 MB each. Images are resized automatically and saved with your profile.</p>
    {processing && <p className="profile-image-progress" role="status">Preparing your image…</p>}
    {crop && <div ref={cropPanel} tabIndex={-1} className="profile-crop-editor" role="group" aria-label={crop.kind === "avatar" ? "Crop your photo" : "Position your banner"}><div className="profile-crop-heading"><strong>{crop.kind === "avatar" ? "Crop your photo" : "Position your banner"}</strong><span>{crop.kind === "avatar" ? "Square photo" : "Wide banner · 3:1"}</span></div>
      <canvas ref={canvas} className={crop.kind === "avatar" ? "profile-crop-canvas photo-crop" : "profile-crop-canvas banner-crop"} width={crop.kind === "avatar" ? 512 : 1500} height={crop.kind === "avatar" ? 512 : 500} role="img" aria-label={crop.kind === "avatar" ? "Profile photo crop preview" : "Banner crop preview"}/>
      <div className="profile-crop-controls"><label htmlFor={`${id}-zoom`}>Zoom<input id={`${id}-zoom`} type="range" min="1" max="3" step="0.01" value={zoom} disabled={disabled} onChange={e => setZoom(Number(e.target.value))}/></label><label htmlFor={`${id}-x`}>Horizontal position<input id={`${id}-x`} type="range" min="0" max="100" value={x} disabled={disabled} onChange={e => setX(Number(e.target.value))}/></label><label htmlFor={`${id}-y`}>Vertical position<input id={`${id}-y`} type="range" min="0" max="100" value={y} disabled={disabled} onChange={e => setY(Number(e.target.value))}/></label></div>
      <div className="profile-crop-actions"><button type="button" className="secondary-btn" disabled={disabled} onClick={releaseCrop}>Cancel crop</button><button type="button" className="primary-btn" disabled={disabled} onClick={apply}>{crop.kind === "avatar" ? "Use photo" : "Use banner"}</button></div>
    </div>}
    {error && <p className="form-error" role="alert">{error}</p>}
    <details className="profile-image-links"><summary>Use image links instead</summary><div className="form-row"><label>Profile photo link<input type="url" maxLength={2000} disabled={blocked} value={/^https?:\/\//.test(avatar) ? avatar : ""} onChange={e => onAvatar(e.target.value)} placeholder="https://…"/></label><label>Banner image link<input type="url" maxLength={2000} disabled={blocked} value={/^https?:\/\//.test(banner) ? banner : ""} onChange={e => onBanner(e.target.value)} placeholder="https://…"/></label></div><small>Pasting a direct image link replaces the image above.</small></details>
  </section>;
}
