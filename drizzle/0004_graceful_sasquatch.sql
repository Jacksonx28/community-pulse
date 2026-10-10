ALTER TABLE `communities` ADD `avatar_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `availability` text DEFAULT 'Available for hire' NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `current_projects` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `contact_route` text DEFAULT 'CM' NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `spots_listed` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `available_spots` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `spots_deadline` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `eligibility` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `hiring` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `hiring_details` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `compensation` text DEFAULT '' NOT NULL;