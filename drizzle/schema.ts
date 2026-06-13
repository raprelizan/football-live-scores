import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Competitions table
export const competitions = mysqlTable("competitions", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 10 }),
  areaName: varchar("areaName", { length: 255 }),
  currentSeason: json("currentSeason"),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Competition = typeof competitions.$inferSelect;
export type InsertCompetition = typeof competitions.$inferInsert;

// Teams table
export const teams = mysqlTable("teams", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("shortName", { length: 50 }),
  tla: varchar("tla", { length: 10 }),
  crest: text("crest"),
  areaName: varchar("areaName", { length: 255 }),
  founded: int("founded"),
  clubColors: varchar("clubColors", { length: 255 }),
  venue: varchar("venue", { length: 255 }),
  website: varchar("website", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

// Matches table
export const matches = mysqlTable("matches", {
  id: int("id").primaryKey(),
  competitionId: int("competitionId").notNull(),
  seasonId: int("seasonId"),
  utcDate: timestamp("utcDate"),
  status: varchar("status", { length: 50 }).notNull(), // SCHEDULED, LIVE, FINISHED, POSTPONED, CANCELLED
  minute: int("minute"),
  injuryTime: int("injuryTime"),
  attendance: int("attendance"),
  venue: varchar("venue", { length: 255 }),
  matchday: int("matchday"),
  stage: varchar("stage", { length: 100 }),
  group: varchar("group", { length: 100 }),
  homeTeamId: int("homeTeamId").notNull(),
  awayTeamId: int("awayTeamId").notNull(),
  homeTeamScore: int("homeTeamScore"),
  awayTeamScore: int("awayTeamScore"),
  homeTeamPenalties: int("homeTeamPenalties"),
  awayTeamPenalties: int("awayTeamPenalties"),
  winner: varchar("winner", { length: 50 }), // HOME, AWAY, DRAW
  duration: varchar("duration", { length: 50 }),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

// Match Events table (goals, cards, substitutions)
export const matchEvents = mysqlTable("matchEvents", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  minute: int("minute").notNull(),
  injuryTime: int("injuryTime"),
  type: varchar("type", { length: 50 }).notNull(), // GOAL, CARD, SUBSTITUTION, VAR_REVIEW
  team: varchar("team", { length: 50 }).notNull(), // HOME, AWAY
  player: varchar("player", { length: 255 }),
  playerId: int("playerId"),
  playerIn: varchar("playerIn", { length: 255 }),
  playerInId: int("playerInId"),
  card: varchar("card", { length: 50 }), // YELLOW_CARD, RED_CARD
  detail: text("detail"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type MatchEvent = typeof matchEvents.$inferSelect;
export type InsertMatchEvent = typeof matchEvents.$inferInsert;

// Standings table
export const standings = mysqlTable("standings", {
  id: int("id").autoincrement().primaryKey(),
  competitionId: int("competitionId").notNull(),
  seasonId: int("seasonId"),
  type: varchar("type", { length: 50 }).notNull(), // TOTAL, HOME, AWAY
  group: varchar("group", { length: 100 }),
  position: int("position").notNull(),
  teamId: int("teamId").notNull(),
  teamName: varchar("teamName", { length: 255 }).notNull(),
  playedGames: int("playedGames"),
  won: int("won"),
  draw: int("draw"),
  lost: int("lost"),
  points: int("points"),
  goalsFor: int("goalsFor"),
  goalsAgainst: int("goalsAgainst"),
  goalDifference: int("goalDifference"),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Standing = typeof standings.$inferSelect;
export type InsertStanding = typeof standings.$inferInsert;

// Scorers table
export const scorers = mysqlTable("scorers", {
  id: int("id").autoincrement().primaryKey(),
  competitionId: int("competitionId").notNull(),
  seasonId: int("seasonId"),
  playerId: int("playerId"),
  playerName: varchar("playerName", { length: 255 }).notNull(),
  teamId: int("teamId"),
  teamName: varchar("teamName", { length: 255 }),
  goals: int("goals").notNull(),
  assists: int("assists"),
  penalties: int("penalties"),
  position: varchar("position", { length: 50 }),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Scorer = typeof scorers.$inferSelect;
export type InsertScorer = typeof scorers.$inferInsert;

// API Cache table
export const apiCache = mysqlTable("apiCache", {
  id: int("id").autoincrement().primaryKey(),
  endpoint: varchar("endpoint", { length: 500 }).notNull().unique(),
  data: json("data"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type ApiCache = typeof apiCache.$inferSelect;
export type InsertApiCache = typeof apiCache.$inferInsert;

// API Usage table for rate limiting
export const apiUsage = mysqlTable("apiUsage", {
  id: int("id").autoincrement().primaryKey(),
  requestCount: int("requestCount").default(0),
  resetAt: timestamp("resetAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type ApiUsage = typeof apiUsage.$inferSelect;
export type InsertApiUsage = typeof apiUsage.$inferInsert;