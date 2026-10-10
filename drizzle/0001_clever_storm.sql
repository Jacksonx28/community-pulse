ALTER TABLE `communities` ADD `project_category` text DEFAULT 'Other' NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `handles_spots` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `communities` ADD `updated_at` text DEFAULT '' NOT NULL;