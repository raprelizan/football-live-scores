import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import VideoPlayer from "@/components/VideoPlayer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

export default function LiveMatch() {
  const { matchId } = useParams<{ matchId: string }>();
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch match details
  const { data: match, isLoading: matchLoading } = trpc.matches.getById.useQuery(
    { id: parseInt(matchId || "0") },
    { enabled: !!matchId, refetchInterval: autoRefresh ? 60000 : false }
  );

  // Fetch live streams for this match
  const { data: streams, isLoading: streamsLoading } = trpc.streams.getByMatch.useQuery(
    { matchId: parseInt(matchId || "0") },
    { enabled: !!matchId }
  );

  // Fetch match events (goals, cards, etc)
  const { data: events } = trpc.matches.getEvents.useQuery(
    { matchId: parseInt(matchId || "0") },
    { enabled: !!matchId, refetchInterval: autoRefresh ? 60000 : false }
  );

  // Fetch match statistics
  const { data: stats } = trpc.matches.getStats.useQuery(
    { matchId: parseInt(matchId || "0") },
    { enabled: !!matchId }
  );

  if (matchLoading || streamsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">المباراة غير موجودة</h1>
          <p className="text-muted-foreground">لم نتمكن من العثور على بيانات هذه المباراة</p>
        </div>
      </div>
    );
  }

  const primaryStream = streams?.[0];
  const qualityOptions = primaryStream?.qualityOptions || [
    { quality: "720p", url: primaryStream?.streamUrl || "", isDefault: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Ad Space - Top */}
      <div className="bg-muted border-b border-border p-4 text-center">
        <div
          id="ad-top"
          className="h-24 bg-gray-700 rounded flex items-center justify-center text-muted-foreground"
        >
          <span>إعلان - Google AdSense</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Match Header */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    مباراة مباشرة
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        match.status === "LIVE"
                          ? "destructive"
                          : match.status === "FINISHED"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {match.status === "LIVE"
                        ? "🔴 مباشر"
                        : match.status === "FINISHED"
                          ? "✅ انتهت"
                          : "⏰ قريباً"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(match.utcDate || "").toLocaleString("ar-SA")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Score */}
              <div className="text-center py-6 border-t border-border">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      الفريق المضيف
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-accent">
                      {match.homeTeamScore} - {match.awayTeamScore}
                    </div>
                    {match.status === "LIVE" && match.minute && (
                      <p className="text-sm text-muted-foreground mt-2">
                        الدقيقة {match.minute}
                      </p>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      الفريق الضيف
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Video Player */}
            {primaryStream && (
              <Card className="p-4 bg-card border-border">
                <VideoPlayer
                  streamUrl={primaryStream.streamUrl}
                  title={`مباراة مباشرة`}
                  qualityOptions={qualityOptions}
                  onQualityChange={setSelectedQuality}
                />
              </Card>
            )}

            {/* Tabs for Details */}
            <Card className="p-6 bg-card border-border">
              <Tabs defaultValue="events" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="events">الأحداث</TabsTrigger>
                  <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
                  <TabsTrigger value="lineups">التشكيلة</TabsTrigger>
                </TabsList>

                {/* Events Tab */}
                <TabsContent value="events" className="space-y-4">
                  {events && events.length > 0 ? (
                    <div className="space-y-3">
                      {events.map((event: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                        >
                          <span className="font-bold text-accent">
                            {event.minute}'
                          </span>
                          <span className="text-sm">
                            {event.type === "GOAL" && "⚽"}
                            {event.type === "CARD" && "🟨"}
                            {event.type === "SUBSTITUTION" && "🔄"}
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              {event.player}
                            </p>
                            {event.detail && (
                              <p className="text-xs text-muted-foreground">
                                {event.detail}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline">
                            {event.team === "HOME" ? "الضيف" : "المضيف"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      لا توجد أحداث حتى الآن
                    </p>
                  )}
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats" className="space-y-4">
                  {stats ? (
                    <div className="space-y-4">
                      {Object.entries(stats).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {key}
                            </span>
                            <span className="font-semibold text-foreground">
                              {(value as any)?.home} - {(value as any)?.away}
                            </span>
                          </div>
                          <div className="flex gap-2 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="bg-accent"
                              style={{
                                width: `${((value as any)?.home / ((value as any)?.home + (value as any)?.away)) * 100}%`,
                              }}
                            />
                            <div className="flex-1 bg-secondary" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      لا توجد إحصائيات متاحة
                    </p>
                  )}
                </TabsContent>

                {/* Lineups Tab */}
                <TabsContent value="lineups" className="space-y-4">
                  <p className="text-center text-muted-foreground py-8">
                    التشكيلة الأساسية قريباً
                  </p>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ad Space - Sidebar */}
            <div
              id="ad-sidebar"
              className="bg-muted border border-border rounded-lg p-4 h-96 flex items-center justify-center text-muted-foreground text-center"
            >
              <span>إعلان - Google AdSense</span>
            </div>

            {/* Auto Refresh Toggle */}
            <Card className="p-4 bg-card border-border">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  تحديث تلقائي
                </label>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoRefresh ? "bg-accent" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoRefresh ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                تحديث كل دقيقة
              </p>
            </Card>

            {/* Stream Info */}
            {primaryStream && (
              <Card className="p-4 bg-card border-border">
                    <h3 className="font-semibold text-foreground mb-3">
                      معلومات البث 📡
                    </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">النوع</p>
                    <p className="font-semibold text-foreground">
                      {primaryStream.streamType}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">الجودة</p>
                    <p className="font-semibold text-foreground">
                      {selectedQuality}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">المزود</p>
                    <p className="font-semibold text-foreground">
                      {primaryStream.provider || "غير محدد"}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Ad Space - Bottom */}
      <div className="bg-muted border-t border-border p-4 text-center">
        <div
          id="ad-bottom"
          className="h-24 bg-gray-700 rounded flex items-center justify-center text-muted-foreground"
        >
          <span>إعلان - Google AdSense</span>
        </div>
      </div>
    </div>
  );
}
