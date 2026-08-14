CREATE TABLE `content_revisions` (
	`id` text PRIMARY KEY NOT NULL,
	`document` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` integer NOT NULL,
	`schema_version` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `content_revisions_created_at_idx` ON `content_revisions` (`created_at`);