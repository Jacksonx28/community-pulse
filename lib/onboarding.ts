export const profileKinds = ["Community", "Project", "CM"] as const;
export type ProfileKind = typeof profileKinds[number];
export function profileKind(value: unknown): ProfileKind | null {
 return typeof value === "string" && profileKinds.includes(value as ProfileKind) ? value as ProfileKind : null;
}
export function profileSetupHref(kind: ProfileKind) {
 return `/?view=profiles&create=${encodeURIComponent(kind)}`;
}
export const profileSetupTitles: Record<ProfileKind, string> = {
 Community: "Create your community profile",
 Project: "Create your project profile",
 CM: "Create your CM profile",
};
