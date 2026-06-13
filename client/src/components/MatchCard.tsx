import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { AR } from "@shared/translations";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Match {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  homeTeamScore?: number | null;
  awayTeamScore?: number | null;
  status: string;
  minute?: number | null;
  utcDate?: string;
  venue?: string;
}

interface Team {
  id: number;
  name: string;
  shortName?: string;
  crest?: string;
}

interface MatchCardProps {
  match: any;
  homeTeam: Team;
  awayTeam: Team;
}

export default function MatchCard({ match, homeTeam, awayTeam }: MatchCardProps) {
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
      case "POSTPONED":
        return <Badge variant="outline">{AR.matches.postponed}</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">{AR.matches.cancelled}</Badge>;
      default:
        return <Badge variant="outline">{match.status}</Badge>;
    }
  };

  const getStatusColor = () => {
    switch (match.status) {
      case "LIVE":
        return "border-red-500/50 bg-red-500/5";
      case "FINISHED":
        return "border-muted bg-muted/30";
      case "SCHEDULED":
        return "border-primary/50 bg-primary/5";
      default:
        return "border-border";
    }
  };

  const matchTime = match.utcDate ? format(new Date(match.utcDate), "HH:mm", { locale: ar }) : "-";
  const matchDate = match.utcDate
    ? format(new Date(match.utcDate), "EEEE، d MMMM", { locale: ar })
    : "";

  return (
    <Link href={`/match/${match.id}`}>
      <a>
        <Card
          className={`p-4 hover:shadow-lg transition-all cursor-pointer border-2 ${getStatusColor()}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-muted-foreground">{matchDate}</div>
            {getStatusBadge()}
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Home Team */}
            <div className="flex-1 flex flex-col items-center gap-2">
              {homeTeam.crest && (
                <img
                  src={homeTeam.crest}
                  alt={homeTeam.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23ddd'/%3E%3C/svg%3E";
                  }}
                />
              )}
              <div className="text-center">
                <p className="text-sm font-semibold line-clamp-2">{homeTeam.shortName || homeTeam.name}</p>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-2xl font-bold text-accent">
                {match.homeTeamScore !== null && match.homeTeamScore !== undefined
                  ? match.homeTeamScore
                  : "-"}{" "}
                -{" "}
                {match.awayTeamScore !== null && match.awayTeamScore !== undefined
                  ? match.awayTeamScore
                  : "-"}
              </div>
              <div className="text-xs text-muted-foreground">
                {match.status === "LIVE" && match.minute ? `${match.minute}'` : matchTime}
              </div>
            </div>

            {/* Away Team */}
            <div className="flex-1 flex flex-col items-center gap-2">
              {awayTeam.crest && (
                <img
                  src={awayTeam.crest}
                  alt={awayTeam.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23ddd'/%3E%3C/svg%3E";
                  }}
                />
              )}
              <div className="text-center">
                <p className="text-sm font-semibold line-clamp-2">{awayTeam.shortName || awayTeam.name}</p>
              </div>
            </div>
          </div>

          {match.venue && (
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground text-center">
              {match.venue}
            </div>
          )}
        </Card>
      </a>
    </Link>
  );
}
