CREATE TABLE `rfq_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`name` text NOT NULL,
	`organization` text DEFAULT '' NOT NULL,
	`phone` text NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`topic` text NOT NULL,
	`product_slug` text DEFAULT '' NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`quantity` text DEFAULT '' NOT NULL,
	`timeline` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`consent` integer DEFAULT false NOT NULL,
	`source_url` text DEFAULT '' NOT NULL,
	`user_agent` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rfq_submissions_reference_unique` ON `rfq_submissions` (`reference`);