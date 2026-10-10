CREATE TABLE `profile_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`reporter_id` text NOT NULL,
	`kind` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `profile_reports_profile_idx` ON `profile_reports` (`profile_id`);--> statement-breakpoint
CREATE TABLE `project_team` (
	`project_id` text NOT NULL,
	`cm_id` text NOT NULL,
	`status` text DEFAULT 'invited' NOT NULL,
	`created_at` text NOT NULL,
	PRIMARY KEY(`project_id`, `cm_id`),
	FOREIGN KEY (`project_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cm_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `project_team_cm_idx` ON `project_team` (`cm_id`);--> statement-breakpoint
CREATE TABLE `request_reads` (
	`request_id` text NOT NULL,
	`user_id` text NOT NULL,
	`seen_at` text NOT NULL,
	PRIMARY KEY(`request_id`, `user_id`),
	FOREIGN KEY (`request_id`) REFERENCES `collaborations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `collaborations` ADD `assigned_cm_id` text REFERENCES communities(id);--> statement-breakpoint
ALTER TABLE `collaborations` ADD `updated_at` text DEFAULT '' NOT NULL;