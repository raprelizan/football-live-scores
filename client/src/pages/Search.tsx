import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AR } from "@shared/translations";
import { mockTeams, mockMatches } from "@shared/mockData";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search as SearchIcon, ChevronLeft } from "lucide-react";
import LazyImage from "@/components/LazyImage";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredResults = useMemo(() => {
    let results = {
      teams: [] as typeof mockTeams,
      matches: [] as typeof mockMatches,
    };

    // Filter teams
    if (searchQuery.trim()) {
      results.teams = mockTeams.filter(
        (team) =>
          team.name.includes(searchQuery) ||
          team.shortName.includes(searchQuery) ||
          team.tla.includes(searchQuery)
      );
    }

    // Filter matches
    let matchesFiltered = mockMatches;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      matchesFiltered = matchesFiltered.filter((match) => {
        const homeTeam = mockTeams.find((t) => t.id === match.homeTeamId);
        const awayTeam = mockTeams.find((t) => t.id === match.awayTeamId);
        return (
          homeTeam?.name.toLowerCase().includes(query) ||
          homeTeam?.shortName.toLowerCase().includes(query) ||
          awayTeam?.name.toLowerCase().includes(query) ||
          awayTeam?.shortName.toLowerCase().includes(query)
        );
      });
    }

    if (selectedCompetition !== "ALL") {
      matchesFiltered = matchesFiltered.filter((m) => m.competitionId === parseInt(selectedCompetition));
    }

    if (selectedStatus !== "ALL") {
      matchesFiltered = matchesFiltered.filter((m) => m.status === selectedStatus);
    }

    if (startDate || endDate) {
      matchesFiltered = matchesFiltered.filter((m) => {
        const matchDate = new Date(m.utcDate);
        if (startDate && matchDate < new Date(startDate)) return false;
        if (endDate && matchDate > new Date(endDate)) return false;
        return true;
      });
    }

    results.matches = matchesFiltered;
    return results;
  }, [searchQuery, selectedCompetition, selectedStatus, startDate, endDate]);

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <Link href="/">
            <a className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4">
              <ChevronLeft className="w-4 h-4" />
              العودة للرئيسية
            </a>
          </Link>
          <h1 className="text-4xl font-bold text-accent">البحث والتصفية</h1>
          <p className="text-muted-foreground mt-2">ابحث عن المباريات والفرق</p>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-8 border-accent/50 bg-accent/5">
          <div className="flex items-center gap-2 mb-4">
            <SearchIcon className="w-5 h-5 text-accent" />
            <Input
              type="text"
              placeholder="ابحث عن فريق أو مباراة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">البطولة</label>
              <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">جميع البطولات</SelectItem>
                  <SelectItem value="1">دوري أبطال أوروبا</SelectItem>
                  <SelectItem value="2">الدوري الإنجليزي</SelectItem>
                  <SelectItem value="3">الدوري الإسباني</SelectItem>
                  <SelectItem value="4">الدوري الإيطالي</SelectItem>
                  <SelectItem value="5">الدوري الألماني</SelectItem>
                  <SelectItem value="6">الدوري الفرنسي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">حالة المباراة</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">جميع الحالات</SelectItem>
                  <SelectItem value="SCHEDULED">لم تبدأ</SelectItem>
                  <SelectItem value="LIVE">مباشر</SelectItem>
                  <SelectItem value="FINISHED">انتهت</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">من التاريخ</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">إلى التاريخ</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="mt-2 text-accent hover:text-accent/80"
            >
              مسح تصفية التاريخ
            </Button>
          )}
        </Card>

        {/* Results */}
        <div className="space-y-8">
          {/* Teams Results */}
          {filteredResults.teams.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-accent mb-4">الفرق ({filteredResults.teams.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResults.teams.map((team) => (
                  <Card key={team.id} className="p-4 border-primary/50 hover:border-primary transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      {team.crest && (
                        <LazyImage
                          src={team.crest}
                          alt={team.name}
                          className="w-12 h-12 object-contain"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-foreground">{team.name}</h3>
                        <p className="text-sm text-muted-foreground">{team.shortName}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Matches Results */}
          {filteredResults.matches.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-accent mb-4">المباريات ({filteredResults.matches.length})</h2>
              <div className="space-y-3">
                {filteredResults.matches.map((match) => {
                  const homeTeam = mockTeams.find((t) => t.id === match.homeTeamId);
                  const awayTeam = mockTeams.find((t) => t.id === match.awayTeamId);

                  const getStatusBadge = () => {
                    switch (match.status) {
                      case "LIVE":
                        return (
                          <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">
                            مباشر
                          </Badge>
                        );
                      case "FINISHED":
                        return <Badge variant="secondary">انتهت</Badge>;
                      case "SCHEDULED":
                        return <Badge variant="outline">لم تبدأ</Badge>;
                      default:
                        return <Badge variant="outline">{match.status}</Badge>;
                    }
                  };

                  return (
                    <Link key={match.id} href={`/match/${match.id}`}>
                      <a>
                        <Card className="p-4 border-accent/50 hover:border-accent transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusBadge()}
                                <span className="text-xs text-muted-foreground">
                                  {match.utcDate ? new Date(match.utcDate).toLocaleDateString("ar-SA") : ""}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-foreground">{homeTeam?.shortName}</span>
                                  {homeTeam?.crest && (
                                    <LazyImage
                                      src={homeTeam.crest}
                                      alt={homeTeam.name}
                                      className="w-6 h-6 object-contain"
                                    />
                                  )}
                                </div>

                                <div className="text-center">
                                  {match.status === "FINISHED" || match.status === "LIVE" ? (
                                    <span className="font-bold text-accent">
                                      {match.homeTeamScore} - {match.awayTeamScore}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">vs</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  {awayTeam?.crest && (
                                    <LazyImage
                                      src={awayTeam.crest}
                                      alt={awayTeam.name}
                                      className="w-6 h-6 object-contain"
                                    />
                                  )}
                                  <span className="font-semibold text-foreground">{awayTeam?.shortName}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </a>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredResults.teams.length === 0 && filteredResults.matches.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">لم نجد نتائج تطابق بحثك</p>
              <p className="text-sm text-muted-foreground">
                حاول البحث عن فريق أو مباراة أخرى
              </p>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
