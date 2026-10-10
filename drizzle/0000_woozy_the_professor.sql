CREATE TABLE `collaborations` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`target_id` text NOT NULL,
	`title` text NOT NULL,
	`kind` text NOT NULL,
	`spots` integer NOT NULL,
	`approved_spots` integer DEFAULT 0 NOT NULL,
	`deadline` text NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`source_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `collaborations_source_idx` ON `collaborations` (`source_id`);--> statement-breakpoint
CREATE INDEX `collaborations_target_idx` ON `collaborations` (`target_id`);--> statement-breakpoint
CREATE TABLE `communities` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_id` text NOT NULL,
	`name` text NOT NULL,
	`kind` text NOT NULL,
	`ecosystem` text NOT NULL,
	`description` text NOT NULL,
	`representative` text NOT NULL,
	`role` text NOT NULL,
	`handle` text NOT NULL,
	`official_url` text NOT NULL,
	`open` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `communities_owner_idx` ON `communities` (`owner_id`);