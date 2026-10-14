ALTER TABLE `collaborations` ADD `completion_requested_by` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `collaborations` ADD `completion_requested_side` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `collaborations` ADD `completion_requested_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `collaborations` ADD `completion_confirmed_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `collaborations` ADD `completion_version` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `collaborations` ADD `credited_cm_id` text REFERENCES communities(id);--> statement-breakpoint
CREATE INDEX `collaborations_credit_idx` ON `collaborations` (`credited_cm_id`);