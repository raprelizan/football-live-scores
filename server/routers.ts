import { COOKIE_NAME } from '@shared/const';
import { liveStreams, advertisements, matchBroadcastSettings, adminLogs } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { getSessionCookieOptions } from './_core/cookies';
import { systemRouter } from './_core/systemRouter';
import { publicProcedure, router, adminProcedure, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import * as db from './db';
import * as footballService from './services/footballDataService';
import { mockMatches } from '@shared/mockData';

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
      return liveMatches.length > 0 ? liveMatches : mockMatches.filter((m) => m.status === 'LIVE');
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
        const streams = await db.getLiveStreamsByMatch(input.matchId);
        return streams.map(stream => ({
          ...stream,
          qualityOptions: [
            { quality: '720p', url: stream.streamUrl, isDefault: true },
            { quality: '1080p', url: stream.streamUrl },
            { quality: '480p', url: stream.streamUrl },
          ],
        }));
      }),

    list: adminProcedure
      .query(async () => {
        const db_instance = await db.getDb();
        if (!db_instance) return [];
        
        const streams = await db_instance
          .select()
          .from(liveStreams);
        
        return streams;
      }),

    create: adminProcedure
      .input(z.object({
        matchId: z.number(),
        title: z.string(),
        streamUrl: z.string(),
        streamType: z.enum(['HLS', 'M3U8', 'DASH']),
        quality: z.string().optional(),
        language: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const result = await db.createLiveStream({
            ...input,
            createdBy: ctx.user?.id,
          });
          
          // Log action
          await db.createAdminLog({
            adminId: ctx.user?.id,
            action: 'CREATE_STREAM',
            entityType: 'liveStream',
            entityId: null,
            changes: input,
            ipAddress: ctx.req.ip,
            userAgent: ctx.req.get('user-agent'),
          });
          
          return { success: true, result };
        } catch (error) {
          console.error('Error creating stream:', error);
          throw new Error('Failed to create stream');
        }
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        streamUrl: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const { id, ...updates } = input;
          await db.updateLiveStream(id, updates);
          
          // Log action
          await db.createAdminLog({
            adminId: ctx.user?.id,
            action: 'UPDATE_STREAM',
            entityType: 'liveStream',
            entityId: id,
            changes: updates,
            ipAddress: ctx.req.ip,
            userAgent: ctx.req.get('user-agent'),
          });
          
          return { success: true };
        } catch (error) {
          console.error('Error updating stream:', error);
          throw new Error('Failed to update stream');
        }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        try {
          await db.deleteLiveStream(input.id);
          
          // Log action
          await db.createAdminLog({
            adminId: ctx.user?.id,
            action: 'DELETE_STREAM',
            entityType: 'liveStream',
            entityId: input.id,
            changes: null,
            ipAddress: ctx.req.ip,
            userAgent: ctx.req.get('user-agent'),
          });
          
          return { success: true };
        } catch (error) {
          console.error('Error deleting stream:', error);
          throw new Error('Failed to delete stream');
        }
      }),
  }),

  ads: router({
    getByPosition: publicProcedure
      .input(z.object({ position: z.string(), pageType: z.string().optional() }))
      .query(async ({ input }) => {
        return await db.getAdvertisementsByPosition(input.position);
      }),

    list: adminProcedure
      .query(async () => {
        const db_instance = await db.getDb();
        if (!db_instance) return [];
        
        const ads = await db_instance
          .select()
          .from(advertisements);
        
        return ads;
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string(),
        adType: z.enum(['GOOGLE_ADSENSE', 'BANNER', 'VIDEO', 'NATIVE']),
        adCode: z.string().optional(),
        position: z.enum(['TOP', 'SIDEBAR', 'BOTTOM', 'INLINE']),
        pageType: z.string().optional(),
        imageUrl: z.string().optional(),
        clickUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const result = await db.createAdvertisement({
            ...input,
            createdBy: ctx.user?.id,
          });
          
          // Log action
          await db.createAdminLog({
            adminId: ctx.user?.id,
            action: 'CREATE_AD',
            entityType: 'advertisement',
            entityId: null,
            changes: input,
            ipAddress: ctx.req.ip,
            userAgent: ctx.req.get('user-agent'),
          });
          
          return { success: true, result };
        } catch (error) {
          console.error('Error creating ad:', error);
          throw new Error('Failed to create advertisement');
        }
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        adCode: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          const { id, ...updates } = input;
          await db.updateAdvertisement(id, updates);
          
          // Log action
          await db.createAdminLog({
            adminId: ctx.user?.id,
            action: 'UPDATE_AD',
            entityType: 'advertisement',
            entityId: id,
            changes: updates,
            ipAddress: ctx.req.ip,
            userAgent: ctx.req.get('user-agent'),
          });
          
          return { success: true };
        } catch (error) {
          console.error('Error updating ad:', error);
          throw new Error('Failed to update advertisement');
        }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        try {
          await db.deleteAdvertisement(input.id);
          
          // Log action
          await db.createAdminLog({
            adminId: ctx.user?.id,
            action: 'DELETE_AD',
            entityType: 'advertisement',
            entityId: input.id,
            changes: null,
            ipAddress: ctx.req.ip,
            userAgent: ctx.req.get('user-agent'),
          });
          
          return { success: true };
        } catch (error) {
          console.error('Error deleting ad:', error);
          throw new Error('Failed to delete advertisement');
        }
      }),
  }),

  admin: router({
    getLogs: adminProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input, ctx }) => {
        return await db.getAdminLogs(ctx.user?.id, input.limit || 100);
      }),

    getStats: adminProcedure
      .query(async ({ ctx }) => {
        try {
          const db_instance = await db.getDb();
          if (!db_instance) {
            return {
              activeStreams: 0,
              activeAds: 0,
              totalMatches: 0,
              totalViews: 0,
            };
          }

          const activeStreams = await db_instance
            .select()
            .from(liveStreams)
            .where(eq(liveStreams.isActive, true));

          const activeAds = await db_instance
            .select()
            .from(advertisements)
            .where(eq(advertisements.isActive, true));

          return {
            activeStreams: activeStreams.length,
            activeAds: activeAds.length,
            totalMatches: 0,
            totalViews: 0,
          };
        } catch (error) {
          console.error('Error fetching admin stats:', error);
          return {
            activeStreams: 0,
            activeAds: 0,
            totalMatches: 0,
            totalViews: 0,
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
