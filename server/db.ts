import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, matches, teams, competitions, standings, scorers, matchEvents } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Football-related queries
export async function getMatchesForToday() {
  const db = await getDb();
  if (!db) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    const result = await db
      .select()
      .from(matches)
      .where(
        and(
          gte(matches.utcDate, today),
          lte(matches.utcDate, tomorrow)
        )
      )
      .orderBy(matches.utcDate);
    return result;
  } catch (error) {
    console.error("Error fetching today's matches:", error);
    return [];
  }
}

export async function getLiveMatches() {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(matches)
      .where(eq(matches.status, "LIVE"))
      .orderBy(matches.utcDate);
    return result;
  } catch (error) {
    console.error("Error fetching live matches:", error);
    return [];
  }
}

export async function getMatchById(matchId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(matches)
      .where(eq(matches.id, matchId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching match:", error);
    return null;
  }
}

export async function getTeamById(teamId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching team:", error);
    return null;
  }
}

export async function getCompetitionById(competitionId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(competitions)
      .where(eq(competitions.id, competitionId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching competition:", error);
    return null;
  }
}

export async function getStandingsByCompetition(competitionId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(standings)
      .where(eq(standings.competitionId, competitionId))
      .orderBy(standings.position);
    return result;
  } catch (error) {
    console.error("Error fetching standings:", error);
    return [];
  }
}

export async function getScorersByCompetition(competitionId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(scorers)
      .where(eq(scorers.competitionId, competitionId))
      .orderBy(desc(scorers.goals))
      .limit(20);
    return result;
  } catch (error) {
    console.error("Error fetching scorers:", error);
    return [];
  }
}

export async function getMatchEvents(matchId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(matchEvents)
      .where(eq(matchEvents.matchId, matchId))
      .orderBy(matchEvents.minute);
    return result;
  } catch (error) {
    console.error("Error fetching match events:", error);
    return [];
  }
}

export async function getMatchesByCompetition(competitionId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(matches)
      .where(eq(matches.competitionId, competitionId))
      .orderBy(desc(matches.utcDate));
    return result;
  } catch (error) {
    console.error("Error fetching matches by competition:", error);
    return [];
  }
}
