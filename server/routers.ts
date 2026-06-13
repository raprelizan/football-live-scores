import { COOKIE_NAME } from "@shared/const";
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
});

export type AppRouter = typeof appRouter;
