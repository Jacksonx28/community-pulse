ALTER TABLE `communities` ADD `manager_id` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `audience_size` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `interests` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `past_collaborations` text DEFAULT '' NOT NULL;