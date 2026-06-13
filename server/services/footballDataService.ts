import { ENV } from "../_core/env";
import { mockCompetitions, mockMatches, mockTeams, mockStandings, mockScorers } from "../../shared/mockData";

const API_BASE_URL = "https://api.football-data.org/v4";
const CACHE_DURATION = 30 * 1000; // 30 seconds for live data

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache: Map<string, CacheEntry> = new Map();

async function fetchFromAPI(endpoint: string) {
  if (!ENV.footballDataApiKey) {
    console.warn("Football-Data API key not configured, using mock data");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "X-Auth-Token": ENV.footballDataApiKey,
      },
    });

    if (response.status === 401) {
      console.error("Football-Data API: Unauthorized - invalid API key");
      return null;
    }

    if (response.status === 429) {
      console.warn("Football-Data API: Rate limit exceeded");
      return null;
    }

    if (!response.ok) {
      console.error(`Football-Data API error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Football-Data API fetch error:", error);
    return null;
  }
}

function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCachedData(key: string, data: unknown) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export async function getCompetitions() {
  const cacheKey = "competitions";
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const data = await fetchFromAPI("/competitions");
  if (data?.competitions) {
    setCachedData(cacheKey, data.competitions);
    return data.competitions;
  }

  return mockCompetitions;
}

export async function getMatches(competitionId?: number) {
  const endpoint = competitionId ? `/competitions/${competitionId}/matches` : "/matches";
  const cacheKey = `matches:${competitionId || "all"}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const data = await fetchFromAPI(endpoint);
  if (data?.matches) {
    setCachedData(cacheKey, data.matches);
    return data.matches;
  }

  return mockMatches;
}

export async function getMatchDetails(matchId: number) {
  const cacheKey = `match:${matchId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const data = await fetchFromAPI(`/matches/${matchId}`);
  if (data?.match) {
    setCachedData(cacheKey, data.match);
    return data.match;
  }

  // Return mock match details
  const mockMatch = mockMatches.find((m) => m.id === matchId);
  return mockMatch || null;
}

export async function getStandings(competitionId: number) {
  const cacheKey = `standings:${competitionId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const data = await fetchFromAPI(`/competitions/${competitionId}/standings`);
  if (data?.standings) {
    setCachedData(cacheKey, data.standings);
    return data.standings;
  }

  return mockStandings;
}

export async function getScorers(competitionId: number) {
  const cacheKey = `scorers:${competitionId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const data = await fetchFromAPI(`/competitions/${competitionId}/scorers`);
  if (data?.scorers) {
    setCachedData(cacheKey, data.scorers);
    return data.scorers;
  }

  return mockScorers;
}

export async function getTeams(competitionId: number) {
  const cacheKey = `teams:${competitionId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const data = await fetchFromAPI(`/competitions/${competitionId}/teams`);
  if (data?.teams) {
    setCachedData(cacheKey, data.teams);
    return data.teams;
  }

  return mockTeams;
}

export async function getTeamDetails(teamId: number) {
  const cacheKey = `team:${teamId}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const data = await fetchFromAPI(`/teams/${teamId}`);
  if (data?.team) {
    setCachedData(cacheKey, data.team);
    return data.team;
  }

  // Return mock team details
  const mockTeam = mockTeams.find((t) => t.id === teamId);
  return mockTeam || null;
}

export function clearCache() {
  cache.clear();
}

export function getCacheStats() {
  return {
    size: cache.size,
    entries: Array.from(cache.keys()),
  };
}
