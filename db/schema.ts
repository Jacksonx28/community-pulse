import { sqliteTable, text, integer, index, primaryKey, uniqueIndex } from "drizzle-orm/sqlite-core";
export const communities = sqliteTable("communities", {
  username: text("username"),
  id: text("id").primaryKey(), ownerId: text("owner_id").notNull(), name: text("name").notNull(),
  kind: text("kind").notNull(), ecosystem: text("ecosystem").notNull(), description: text("description").notNull(),
  representative: text("representative").notNull(), role: text("role").notNull(), handle: text("handle").notNull(),
  officialUrl: text("official_url").notNull(), open: integer("open").notNull().default(1), createdAt: text("created_at").notNull(),
  projectCategory: text("project_category").notNull().default("Other"),
  handlesSpots: integer("handles_spots").notNull().default(0),
  updatedAt: text("updated_at").notNull().default(""),
  managerId: text("manager_id").notNull().default(""),
  audienceSize: integer("audience_size").notNull().default(0),
  interests: text("interests").notNull().default(""),
  pastCollaborations: text("past_collaborations").notNull().default(""),
  avatarUrl: text("avatar_url").notNull().default(''),
  bannerUrl: text("banner_url").notNull().default(''),
  availability: text("availability").notNull().default('Available for hire'),
  currentProjects: text("current_projects").notNull().default(''),
  contactRoute: text("contact_route").notNull().default('CM'),
  spotsListed: integer("spots_listed").notNull().default(0),
  showAllocations: integer("show_allocations").notNull().default(1),
  availableSpots: integer("available_spots").notNull().default(0),
  spotsDeadline: text("spots_deadline").notNull().default(''),
  eligibility: text("eligibility").notNull().default(''),
  hiring: integer("hiring").notNull().default(0),
  hiringDetails: text("hiring_details").notNull().default(''),
  compensation: text("compensation").notNull().default(''),
  xUserId: text("x_user_id").notNull().default(""),
  discordUserId: text("discord_user_id").notNull().default(""),
}, t=>[index("communities_owner_idx").on(t.ownerId), uniqueIndex("communities_username_unique").on(t.username)]);
export const collaborations = sqliteTable("collaborations", {
  completionRequestedBy: text("completion_requested_by").notNull().default(""),
  completionRequestedSide: text("completion_requested_side").notNull().default(""),
  completionRequestedAt: text("completion_requested_at").notNull().default(""),
  completionConfirmedAt: text("completion_confirmed_at").notNull().default(""),
  completionVersion: integer("completion_version").notNull().default(0),
  creditedCMId: text("credited_cm_id").references(()=>communities.id),
  assignedCMId: text("assigned_cm_id").references(()=>communities.id),
  updatedAt: text("updated_at").notNull().default(""),
  id: text("id").primaryKey(), sourceId: text("source_id").notNull().references(()=>communities.id),
  targetId: text("target_id").notNull().references(()=>communities.id), title: text("title").notNull(),
  communityPlatform: text("community_platform").notNull().default("Not specified"),
  kind: text("kind").notNull(), spots: integer("spots").notNull(), approvedSpots: integer("approved_spots").notNull().default(0),
  deadline: text("deadline").notNull(), message: text("message").notNull(), status: text("status").notNull().default("pending"), createdAt: text("created_at").notNull(),
}, t=>[index("collaborations_source_idx").on(t.sourceId),index("collaborations_target_idx").on(t.targetId),index("collaborations_credit_idx").on(t.creditedCMId)]);

export const projectCMContacts=sqliteTable("project_cm_contacts",{
 projectId:text("project_id").notNull().references(()=>communities.id),
 cmId:text("cm_id").notNull().references(()=>communities.id),
},t=>[primaryKey({columns:[t.projectId,t.cmId]})]);

export const projectTeam=sqliteTable("project_team",{
 projectId:text("project_id").notNull().references(()=>communities.id),
 cmId:text("cm_id").notNull().references(()=>communities.id),
 status:text("status").notNull().default("invited"),
 createdAt:text("created_at").notNull(),
},t=>[primaryKey({columns:[t.projectId,t.cmId]}),index("project_team_cm_idx").on(t.cmId)]);
export const requestReads=sqliteTable("request_reads",{
 requestId:text("request_id").notNull().references(()=>collaborations.id),
 userId:text("user_id").notNull(),seenAt:text("seen_at").notNull(),
},t=>[primaryKey({columns:[t.requestId,t.userId]})]);
export const profileReports=sqliteTable("profile_reports",{
 id:text("id").primaryKey(),profileId:text("profile_id").notNull().references(()=>communities.id),
 reporterId:text("reporter_id").notNull(),kind:text("kind").notNull(),message:text("message").notNull(),
 status:text("status").notNull().default("pending"),createdAt:text("created_at").notNull(),
},t=>[index("profile_reports_profile_idx").on(t.profileId)]);

// Personal account identity, independent of managed project and community profiles.
export const accounts=sqliteTable("accounts",{
 userId:text("user_id").primaryKey(),username:text("username").notNull(),
 displayName:text("display_name").notNull(),avatar:text("avatar").notNull().default(""),
 updatedAt:text("updated_at").notNull(),
},t=>[uniqueIndex("accounts_username_unique").on(t.username)]);
