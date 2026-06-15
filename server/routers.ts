import { COOKIE_NAME } from "@shared/const";
import { liveStreams, advertisements, matchBroadcastSettings, adminLogs } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as footballService from "./services/footballDataService";
import { mockMatches } from "@shared/mockData";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  football: router({
    getTodayMatches: publicProcedure.query(async () => {
      const todayMatches = await db.getMatchesForToday();
      return todayMatches.length > 0 ? todayMatches : mockMatches;
    }),

    getLiveMatches: publicProcedure.query(async () => {
      const liveMatches = await db.getLiveMatches();
      return liveMatches.length > 0 ? liveMatches : mockMatches.filter((m) => m.status === "LIVE");
    }),

    getMatchDetails: publicProcedure
      .input(z.object({ matchId: z.number() }))
      .query(async ({ input }) => {
        const match = await db.getMatchById(input.matchId);
        return match || mockMatches.find((m) => m.id === input.matchId) || null;
      }),

    getMatchEvents: publicProcedure
      .input(z.object({ matchId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMatchEvents(input.matchId);
      }),

    getCompetitions: publicProcedure.query(async () => {
      return await footballService.getCompetitions();
    }),

    getStandings: publicProcedure
      .input(z.object({ competitionId: z.number() }))
      .query(async ({ input }) => {
        return await footballService.getStandings(input.competitionId);
      }),

    getScorers: publicProcedure
      .input(z.object({ competitionId: z.number() }))
      .query(async ({ input }) => {
        return await footballService.getScorers(input.competitionId);
      }),

    getMatchesByCompetition: publicProcedure
      .input(z.object({ competitionId: z.number() }))
      .query(async ({ input }) => {
        return await footballService.getMatches(input.competitionId);
      }),

    getTeamDetails: publicProcedure
      .input(z.object({ teamId: z.number() }))
      .query(async ({ input }) => {
        return await footballService.getTeamDetails(input.teamId);
      }),
  }),

  matches: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getMatchById(input.id);
      }),

    getEvents: publicProcedure
      .input(z.object({ matchId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMatchEvents(input.matchId);
      }),

    getStats: publicProcedure
      .input(z.object({ matchId: z.number() }))
      .query(async ({ input }) => {
        // Return mock stats for now
        return {
          possession: { home: 55, away: 45 },
          shots: { home: 12, away: 8 },
          shotsOnTarget: { home: 5, away: 3 },
          corners: { home: 6, away: 4 },
          fouls: { home: 10, away: 12 },
        };
      }),
  }),

  streams: router({
    getByMatch: publicProcedure
      .input(z.object({ matchId: z.number() }))
      .query(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) return [];
        
        const streams = await db_instance
          .select()
          .from(liveStreams)
          .where(eq(liveStreams.matchId, input.matchId));
        
        return streams.map(stream => ({
          ...stream,
          qualityOptions: [
            { quality: "720p", url: stream.streamUrl, isDefault: true },
            { quality: "1080p", url: stream.streamUrl },
            { quality: "480p", url: stream.streamUrl },
          ],
        }));
      }),

    create: publicProcedure
      .input(z.object({
        matchId: z.number(),
        title: z.string(),
        streamUrl: z.string(),
        streamType: z.enum(["HLS", "M3U8", "DASH"]),
        quality: z.string().optional(),
        language: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can create streams");
        }
        
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error("Database not available");
        
        const result = await db_instance.insert(liveStreams).values({
          ...input,
          createdBy: ctx.user.id,
        });
        
        return result;
      }),

    update: publicProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        streamUrl: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can update streams");
        }
        
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error("Database not available");
        
        const { id, ...updates } = input;
        await db_instance.update(liveStreams).set(updates).where(eq(liveStreams.id, id));
        
        return { success: true };
      }),
  }),

  ads: router({
    getByPosition: publicProcedure
      .input(z.object({ position: z.string(), pageType: z.string().optional() }))
      .query(async ({ input }) => {
        const db_instance = await db.getDb();
        if (!db_instance) return [];
        
        const ads = await db_instance
          .select()
          .from(advertisements)
          .where(
            and(
              eq(advertisements.position, input.position),
              eq(advertisements.isActive, true)
            )
          );
        
        return ads;
      }),

    create: publicProcedure
      .input(z.object({
        title: z.string(),
        adType: z.enum(["GOOGLE_ADSENSE", "BANNER", "VIDEO", "NATIVE"]),
        adCode: z.string().optional(),
        position: z.enum(["TOP", "SIDEBAR", "BOTTOM", "INLINE"]),
        pageType: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Only admins can create ads");
        }
        
        const db_instance = await db.getDb();
        if (!db_instance) throw new Error("Database not available");
        
        const result = await db_instance.insert(advertisements).values({
          ...input,
          createdBy: ctx.user.id,
        });
        
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;


