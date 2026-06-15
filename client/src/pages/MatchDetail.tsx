import { useRoute } from "wouter";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Spinner } from "@/components/ui/spinner";
import { AR } from "@shared/translations";
import { mockTeams, mockMatchEvents } from "@shared/mockData";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function MatchDetail() {
  const [, params] = useRoute("/match/:id");
  const matchId = params?.id ? parseInt(params.id) : 0;

  const { data: match, isLoading } = trpc.football.getMatchDetails.useQuery(
    { matchId },
    { enabled: matchId > 0, refetchInterval: 60000 }
  );

  const { data: events = [] } = trpc.football.getMatchEvents.useQuery(
    { matchId },
    { enabled: matchId > 0, refetchInterval: 60000 }
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (!match) {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">{AR.messages.noData}</p>
            <Link href="/">
              <a>
                <Button variant="outline">{AR.buttons.back}</Button>
              </a>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  const homeTeam = mockTeams.find((t) => t.id === match.homeTeamId) || {
    id: match.homeTeamId,
    name: "Unknown",
    shortName: "UNK",
  };
  const awayTeam = mockTeams.find((t) => t.id === match.awayTeamId) || {
    id: match.awayTeamId,
    name: "Unknown",
    shortName: "UNK",
  };

  const matchEvents = events.length > 0 ? events : mockMatchEvents.filter((e) => e.matchId === matchId);

  const getStatusBadge = () => {
    switch (match.status) {
      case "LIVE":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">
            {AR.matches.live}
          </Badge>
        );
      case "FINISHED":
        return <Badge variant="secondary">{AR.matches.finished}</Badge>;
      case "SCHEDULED":
        return <Badge variant="outline">{AR.matches.notStarted}</Badge>;
      default:
        return <Badge variant="outline">{match.status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Link href="/">
            <a className="hover:text-accent transition-colors">{AR.nav.home}</a>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span>{homeTeam.shortName} vs {awayTeam.shortName}</span>
        </div>

        {/* Match Header */}
        <Card className="p-8 mb-8 border-accent/50 bg-accent/5">
          <div className="flex items-center justify-between mb-6">
            <div>{getStatusBadge()}</div>
            {match.status === "LIVE" && match.minute && (
              <div className="text-lg font-bold text-red-500">{match.minute}'</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Home Team */}
            <div className="flex flex-col items-center gap-4">
              {(homeTeam as any).crest && (
                <img
                  src={(homeTeam as any).crest}
                  alt={homeTeam.name}
                  className="w-20 h-20 object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23ddd'/%3E%3C/svg%3E";
                  }}
                />
              )}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-accent">{homeTeam.name}</h2>
                <p className="text-sm text-muted-foreground">{AR.teams.home}</p>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-4">
              <div className="text-6xl font-bold text-accent">
                {match.homeTeamScore !== null && match.homeTeamScore !== undefined
                  ? match.homeTeamScore
                  : "-"}{" "}
                -{" "}
                {match.awayTeamScore !== null && match.awayTeamScore !== undefined
                  ? match.awayTeamScore
                  : "-"}
              </div>
              {match.venue && (
                <p className="text-sm text-muted-foreground text-center">{match.venue}</p>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center gap-4">
              {(awayTeam as any).crest && (
                <img
                  src={(awayTeam as any).crest}
                  alt={awayTeam.name}
                  className="w-20 h-20 object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23ddd'/%3E%3C/svg%3E";
                  }}
                />
              )}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-accent">{awayTeam.name}</h2>
                <p className="text-sm text-muted-foreground">{AR.teams.away}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">الأحداث</TabsTrigger>
            <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
            <TabsTrigger value="lineups">التشكيلة</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            {matchEvents.length > 0 ? (
              <div className="space-y-3">
                {matchEvents.map((event) => (
                  <Card key={event.id} className="p-4 border-muted">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{event.minute}'</Badge>
                        <div>
                          <p className="font-semibold text-foreground">{event.player}</p>
                          <p className="text-sm text-muted-foreground">{event.type}</p>
                        </div>
                      </div>
                      <Badge
                        variant={event.team === "HOME" ? "default" : "secondary"}
                      >
                        {event.team === "HOME" ? homeTeam.shortName : awayTeam.shortName}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">{AR.messages.noData}</p>
              </Card>
            )}
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 border-primary/50 bg-primary/5">
                <h3 className="font-semibold text-primary mb-4">{AR.stats.possession}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-1/2 bg-primary"></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">50%</span>
                </div>
              </Card>

              <Card className="p-6 border-accent/50 bg-accent/5">
                <h3 className="font-semibold text-accent mb-4">{AR.stats.shots}</h3>
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">8</span>
                  <span className="text-2xl font-bold">6</span>
                </div>
              </Card>

              <Card className="p-6 border-green-500/50 bg-green-500/5">
                <h3 className="font-semibold text-green-500 mb-4">{AR.stats.passes}</h3>
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">450</span>
                  <span className="text-2xl font-bold">420</span>
                </div>
              </Card>

              <Card className="p-6 border-red-500/50 bg-red-500/5">
                <h3 className="font-semibold text-red-500 mb-4">{AR.stats.fouls}</h3>
                <div className="flex justify-between">
                  <span className="text-2xl font-bold">12</span>
                  <span className="text-2xl font-bold">14</span>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Lineups Tab */}
          <TabsContent value="lineups" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Home Team Lineup */}
              <Card className="p-6 border-primary/50 bg-primary/5">
                <h3 className="font-semibold text-primary mb-4">{homeTeam.shortName}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">{AR.teams.lineup}</p>
                  <div className="space-y-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                      <div key={num} className="flex items-center gap-2 text-sm">
                        <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold">
                          {num}
                        </span>
                        <span className="text-foreground">Player {num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Away Team Lineup */}
              <Card className="p-6 border-accent/50 bg-accent/5">
                <h3 className="font-semibold text-accent mb-4">{awayTeam.shortName}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">{AR.teams.lineup}</p>
                  <div className="space-y-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                      <div key={num} className="flex items-center gap-2 text-sm">
                        <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold">
                          {num}
                        </span>
                        <span className="text-foreground">Player {num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
