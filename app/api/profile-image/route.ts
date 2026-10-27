import { database } from "@/lib/pulse-db";
import { decodeProfileImage, profileImageReference, profileImageUrl } from "@/lib/profile-images";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ref = profileImageReference(profileImageUrl(url.searchParams.get("id") || "", url.searchParams.get("kind") as "avatar" | "banner", url.searchParams.get("v") || ""));
  if (!ref) return new Response(null, { status: 404 });
  const column = ref.kind === "avatar" ? "avatar_url" : "banner_url";
  try {
    const row = await database().prepare(`SELECT i.data_url FROM profile_images i JOIN communities c ON c.id=i.profile_id WHERE i.profile_id=? AND i.kind=? AND i.version=? AND c.deleted_at='' AND c.${column}=?`)
      .bind(ref.id, ref.kind, ref.version, profileImageUrl(ref.id, ref.kind, ref.version)).first<{ data_url: string }>();
    const image = row && decodeProfileImage(row.data_url);
    if (!image) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
    const headers = { "Content-Type": image.mime, "Cache-Control": "public, max-age=300, must-revalidate", "X-Content-Type-Options": "nosniff", "ETag": `"${ref.version}"` };
    if (request.headers.get("if-none-match") === headers.ETag) return new Response(null, { status: 304, headers });
    return new Response(image.bytes, { headers });
  } catch { return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } }); }
}
