CREATE TABLE `adminLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`entityId` int,
	`changes` json,
	`ipAddress` varchar(50),
	`userAgent` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `adminLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `advertisements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`adType` varchar(50) NOT NULL,
	`adCode` text,
	`position` varchar(50) NOT NULL,
	`pageType` varchar(100),
	`imageUrl` text,
	`clickUrl` text,
	`isActive` boolean DEFAULT true,
	`startDate` timestamp,
	`endDate` timestamp,
	`impressions` int DEFAULT 0,
	`clicks` int DEFAULT 0,
	`createdBy` int,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advertisements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `liveStreams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`streamUrl` text NOT NULL,
	`streamType` varchar(50) NOT NULL,
	`quality` varchar(50),
	`language` varchar(50),
	`isActive` boolean DEFAULT true,
	`provider` varchar(100),
	`startTime` timestamp,
	`endTime` timestamp,
	`createdBy` int,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `liveStreams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matchBroadcastSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchId` int NOT NULL,
	`isBroadcasting` boolean DEFAULT false,
	`broadcastStartTime` timestamp,
	`broadcastEndTime` timestamp,
	`primaryStreamId` int,
	`showStats` boolean DEFAULT true,
	`showCommentary` boolean DEFAULT true,
	`enableChat` boolean DEFAULT false,
	`enableAds` boolean DEFAULT true,
	`adFrequency` int,
	`createdBy` int,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `matchBroadcastSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `streamQualityOptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`streamId` int NOT NULL,
	`quality` varchar(50) NOT NULL,
	`bitrate` varchar(50),
	`resolution` varchar(50),
	`url` text NOT NULL,
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `streamQualityOptions_id` PRIMARY KEY(`id`)
);
