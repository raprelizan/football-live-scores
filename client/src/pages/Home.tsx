import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import MatchCard from "@/components/MatchCard";
import { trpc } from "@/lib/trpc";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { AR } from "@shared/translations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTeams } from "@shared/mockData";

interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamScore?: number | null;
  awayTeamScore?: number | null;
  status: string;
  minute?: number | null;
  utcDate?: string | Date | null;
  venue?: string | null;
}

export default function Home() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch today's matches
  const todayMatches = trpc.football.getTodayMatches.useQuery(undefined, {
    refetchInterval: 30000,
  });

  // Fetch live matches
  const liveMatches = trpc.football.getLiveMatches.useQuery(undefined, {
    refetchInterval: 30000,
  });

  // Update last updated time when data changes
  useEffect(() => {
    if (todayMatches.data || liveMatches.data) {
      setLastUpdated(new Date());
    }
  }, [todayMatches.data, liveMatches.data]);

  // Get team details
  const getTeam = (teamId: number) => {
    return mockTeams.find((t) => t.id === teamId) || { id: teamId, name: "Unknown", shortName: "UNK" };
  };

  // Organize matches by status
  const organizeMatches = (matches: Match[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const live = matches.filter((m) => m.status === "LIVE");
    const upcoming = matches.filter((m) => {
      const matchDate = m.utcDate ? new Date(m.utcDate) : null;
      return m.status === "SCHEDULED" && matchDate && matchDate >= new Date();
    });
    const finished = matches.filter((m) => m.status === "FINISHED");

    return { live, upcoming, finished };
  };

  const allMatches = todayMatches.data || [];
  const { live, upcoming, finished } = organizeMatches(allMatches);

  const isLoading = todayMatches.isLoading || liveMatches.isLoading;

  return (
    <Layout>
      <div className="container py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-accent mb-2">{AR.app.title}</h1>
          <p className="text-muted-foreground">{AR.app.description}</p>
          <div className="mt-4 text-sm text-muted-foreground">
            {AR.messages.lastUpdated}{" "}
            {lastUpdated.toLocaleTimeString("ar-SA", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>

        {/* Live Matches Section */}
        {live.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              {AR.matches.live}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {live.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  homeTeam={getTeam(match.homeTeamId)}
                  awayTeam={getTeam(match.awayTeamId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tabs for Today's Matches */}
        <div className="mb-12">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">
                {AR.matches.upcoming} ({upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="finished">
                {AR.matches.finishedMatches} ({finished.length})
              </TabsTrigger>
              <TabsTrigger value="live">
                {AR.matches.live} ({live.length})
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Matches */}
            <TabsContent value="upcoming" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : upcoming.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcoming.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      homeTeam={getTeam(match.homeTeamId)}
                      awayTeam={getTeam(match.awayTeamId)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">{AR.messages.noMatches}</p>
                </Card>
              )}
            </TabsContent>

            {/* Finished Matches */}
            <TabsContent value="finished" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : finished.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {finished.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      homeTeam={getTeam(match.homeTeamId)}
                      awayTeam={getTeam(match.awayTeamId)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">{AR.messages.noMatches}</p>
                </Card>
              )}
            </TabsContent>

            {/* Live Matches Tab */}
            <TabsContent value="live" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : live.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {live.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      homeTeam={getTeam(match.homeTeamId)}
                      awayTeam={getTeam(match.awayTeamId)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">{AR.messages.noMatches}</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <Card className="p-6 border-accent/50 bg-accent/5">
            <div className="text-3xl font-bold text-accent mb-2">{allMatches.length}</div>
            <p className="text-muted-foreground">{AR.messages.loadingMatches}</p>
          </Card>
          <Card className="p-6 border-primary/50 bg-primary/5">
            <div className="text-3xl font-bold text-primary mb-2">{live.length}</div>
            <p className="text-muted-foreground">{AR.matches.live}</p>
          </Card>
          <Card className="p-6 border-green-500/50 bg-green-500/5">
            <div className="text-3xl font-bold text-green-500 mb-2">{finished.length}</div>
            <p className="text-muted-foreground">{AR.matches.finishedMatches}</p>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
