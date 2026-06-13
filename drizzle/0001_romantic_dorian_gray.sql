CREATE TABLE `apiCache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`endpoint` varchar(500) NOT NULL,
	`data` json,
	`expiresAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `apiCache_id` PRIMARY KEY(`id`),
	CONSTRAINT `apiCache_endpoint_unique` UNIQUE(`endpoint`)
);
--> statement-breakpoint
CREATE TABLE `apiUsage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestCount` int DEFAULT 0,
	`resetAt` timestamp,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `apiUsage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `competitions` (
	`id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`code` varchar(10),
	`areaName` varchar(255),
	`currentSeason` json,
	`lastUpdated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `competitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matchEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchId` int NOT NULL,
	`minute` int NOT NULL,
	`injuryTime` int,
	`type` varchar(50) NOT NULL,
	`team` varchar(50) NOT NULL,
	`player` varchar(255),
	`playerId` int,
	`playerIn` varchar(255),
	`playerInId` int,
	`card` varchar(50),
	`detail` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `matchEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int NOT NULL,
	`competitionId` int NOT NULL,
	`seasonId` int,
	`utcDate` timestamp,
	`status` varchar(50) NOT NULL,
	`minute` int,
	`injuryTime` int,
	`attendance` int,
	`venue` varchar(255),
	`matchday` int,
	`stage` varchar(100),
	`group` varchar(100),
	`homeTeamId` int NOT NULL,
	`awayTeamId` int NOT NULL,
	`homeTeamScore` int,
	`awayTeamScore` int,
	`homeTeamPenalties` int,
	`awayTeamPenalties` int,
	`winner` varchar(50),
	`duration` varchar(50),
	`lastUpdated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scorers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competitionId` int NOT NULL,
	`seasonId` int,
	`playerId` int,
	`playerName` varchar(255) NOT NULL,
	`teamId` int,
	`teamName` varchar(255),
	`goals` int NOT NULL,
	`assists` int,
	`penalties` int,
	`position` varchar(50),
	`lastUpdated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `scorers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `standings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competitionId` int NOT NULL,
	`seasonId` int,
	`type` varchar(50) NOT NULL,
	`group` varchar(100),
	`position` int NOT NULL,
	`teamId` int NOT NULL,
	`teamName` varchar(255) NOT NULL,
	`playedGames` int,
	`won` int,
	`draw` int,
	`lost` int,
	`points` int,
	`goalsFor` int,
	`goalsAgainst` int,
	`goalDifference` int,
	`lastUpdated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `standings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`shortName` varchar(50),
	`tla` varchar(10),
	`crest` text,
	`areaName` varchar(255),
	`founded` int,
	`clubColors` varchar(255),
	`venue` varchar(255),
	`website` varchar(255),
	`email` varchar(255),
	`phone` varchar(50),
	`lastUpdated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `teams_id` PRIMARY KEY(`id`)
);
