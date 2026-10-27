CREATE TABLE `profile_images` (
	`profile_id` text NOT NULL,
	`kind` text NOT NULL,
	`version` text NOT NULL,
	`data_url` text NOT NULL,
	`updated_at` text NOT NULL,
	PRIMARY KEY(`profile_id`, `kind`),
	FOREIGN KEY (`profile_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE cascade
);
