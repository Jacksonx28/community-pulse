ALTER TABLE `communities` ADD `username` text;--> statement-breakpoint
CREATE UNIQUE INDEX `communities_username_unique` ON `communities` (`username`);