import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, matches, teams, competitions, standings, scorers, matchEvents, liveStreams, advertisements, adminLogs } from "../drizzle/schema";
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

// User queries
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
    return result[0] || undefined;
  } catch (error) {
    console.error("Error fetching user by openId:", error);
    return undefined;
  }
}

export async function createAdminUser(data: {
  username: string;
  passwordHash: string;
  name: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const openId = `admin_${data.username}_${Date.now()}`;
    const result = await db.insert(users).values({
      openId,
      username: data.username,
      passwordHash: data.passwordHash,
      name: data.name,
      email: null,
      loginMethod: 'password',
      role: 'admin',
      isActive: true,
      lastSignedIn: new Date(),
    });

    const createdUser = await db.select().from(users).where(eq(users.username, data.username)).limit(1);
    return createdUser[0];
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

export async function updateUserLastSignedIn(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
    return true;
  } catch (error) {
    console.error("Error updating user last signed in:", error);
    return false;
  }
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

// Live Streams queries
export async function getLiveStreamsByMatch(matchId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(liveStreams)
      .where(and(eq(liveStreams.matchId, matchId), eq(liveStreams.isActive, true)))
      .orderBy(liveStreams.createdAt);
    return result;
  } catch (error) {
    console.error("Error fetching live streams:", error);
    return [];
  }
}

export async function createLiveStream(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(liveStreams).values(data);
    return result;
  } catch (error) {
    console.error("Error creating live stream:", error);
    throw error;
  }
}

export async function updateLiveStream(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(liveStreams).set(data).where(eq(liveStreams.id, id));
    return true;
  } catch (error) {
    console.error("Error updating live stream:", error);
    throw error;
  }
}

export async function deleteLiveStream(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(liveStreams).set({ isActive: false }).where(eq(liveStreams.id, id));
    return true;
  } catch (error) {
    console.error("Error deleting live stream:", error);
    throw error;
  }
}

// Advertisements queries
export async function getAdvertisementsByPosition(position: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select()
      .from(advertisements)
      .where(and(eq(advertisements.position, position), eq(advertisements.isActive, true)))
      .orderBy(advertisements.createdAt);
    return result;
  } catch (error) {
    console.error("Error fetching advertisements:", error);
    return [];
  }
}

export async function createAdvertisement(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(advertisements).values(data);
    return result;
  } catch (error) {
    console.error("Error creating advertisement:", error);
    throw error;
  }
}

export async function updateAdvertisement(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(advertisements).set(data).where(eq(advertisements.id, id));
    return true;
  } catch (error) {
    console.error("Error updating advertisement:", error);
    throw error;
  }
}

export async function deleteAdvertisement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db.update(advertisements).set({ isActive: false }).where(eq(advertisements.id, id));
    return true;
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    throw error;
  }
}

// Admin logs queries
export async function createAdminLog(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const result = await db.insert(adminLogs).values(data);
    return result;
  } catch (error) {
    console.error("Error creating admin log:", error);
    throw error;
  }
}

export async function getAdminLogs(adminId?: number, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  try {
    let query = db.select().from(adminLogs);
    
    if (adminId) {
      query = query.where(eq(adminLogs.adminId, adminId));
    }
    
    const result = await query
      .orderBy(desc(adminLogs.createdAt))
      .limit(limit);
    return result;
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    return [];
  }
}
