export type ProfileImageKind = "avatar" | "banner";

export const PROFILE_IMAGE_LIMITS = { avatar: 250_000, banner: 550_000 } as const;
export const PROFILE_IMAGE_BODY_LIMIT = 816_000;
const uuid = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const imageReference = new RegExp(`^/api/profile-image\\?id=(${uuid})&kind=(avatar|banner)&v=(${uuid})$`, "i");

export function profileImageReference(value: string) {
  const match = imageReference.exec(value);
  return match ? { id: match[1], kind: match[2] as ProfileImageKind, version: match[3] } : null;
}

export function profileImageUrl(id: string, kind: ProfileImageKind, version: string) {
  return `/api/profile-image?id=${id}&kind=${kind}&v=${version}`;
}

export function decodeProfileImage(value: string) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (!match || match[2].length % 4 !== 0) return null;
  try {
    const raw = atob(match[2]);
    const valid = match[1] === "image/jpeg" ? raw.startsWith("\xff\xd8\xff")
      : match[1] === "image/png" ? raw.startsWith("\x89PNG\r\n\x1a\n")
      : raw.startsWith("RIFF") && raw.slice(8, 12) === "WEBP";
    return valid ? { mime: match[1], bytes: Uint8Array.from(raw, char => char.charCodeAt(0)) } : null;
  } catch { return null; }
}

export function validProfileImage(value: string, kind: ProfileImageKind) {
  if (!value) return true;
  if (value.startsWith("data:")) return value.length <= PROFILE_IMAGE_LIMITS[kind] && !!decodeProfileImage(value);
  if (profileImageReference(value)) return true;
  if (value.length > 2000) return false;
  try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; }
}

export function imageCrop(width: number, height: number, outputWidth: number, outputHeight: number, zoom: number, x: number, y: number) {
  const scale = Math.max(outputWidth / width, outputHeight / height) * Math.max(1, zoom);
  const cropWidth = outputWidth / scale, cropHeight = outputHeight / scale;
  return { x: (width - cropWidth) * Math.min(1, Math.max(0, x / 100)), y: (height - cropHeight) * Math.min(1, Math.max(0, y / 100)), width: cropWidth, height: cropHeight };
}
