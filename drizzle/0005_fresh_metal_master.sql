CREATE TABLE `project_cm_contacts` (
	`project_id` text NOT NULL,
	`cm_id` text NOT NULL,
	PRIMARY KEY(`project_id`, `cm_id`),
	FOREIGN KEY (`project_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cm_id`) REFERENCES `communities`(`id`) ON UPDATE no action ON DELETE no action
);
