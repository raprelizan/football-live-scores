import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AR } from "@shared/translations";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

const standings = [
  { rank: 1, team: "Real Madrid", played: 38, wins: 28, draws: 6, losses: 4, gf: 92, ga: 35, gd: 57, points: 90 },
  { rank: 2, team: "Barcelona", played: 38, wins: 27, draws: 5, losses: 6, gf: 88, ga: 38, gd: 50, points: 86 },
  { rank: 3, team: "Atletico Madrid", played: 38, wins: 24, draws: 8, losses: 6, gf: 75, ga: 32, gd: 43, points: 80 },
  { rank: 4, team: "Sevilla", played: 38, wins: 22, draws: 7, losses: 9, gf: 68, ga: 42, gd: 26, points: 73 },
  { rank: 5, team: "Valencia", played: 38, wins: 20, draws: 6, losses: 12, gf: 62, ga: 48, gd: 14, points: 66 },
];

export default function Standings() {
  const [selectedCompetition, setSelectedCompetition] = useState("LA");

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
          <h1 className="text-4xl font-bold text-accent">{AR.nav.standings}</h1>
          <p className="text-muted-foreground mt-2">ترتيب الفرق في البطولات</p>
        </div>

        {/* Competition Selector */}
        <Card className="p-6 mb-8 border-accent/50 bg-accent/5">
          <label className="block text-sm font-medium text-foreground mb-3">اختر البطولة</label>
          <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LA">الدوري الإسباني</SelectItem>
              <SelectItem value="PL">الدوري الإنجليزي</SelectItem>
              <SelectItem value="SA">الدوري الإيطالي</SelectItem>
              <SelectItem value="BL1">الدوري الألماني</SelectItem>
              <SelectItem value="FL1">الدوري الفرنسي</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Standings Table */}
        <Card className="overflow-hidden border-accent/50">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-muted bg-muted/50">
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">#</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">الفريق</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">لعب</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">ف</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">ت</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">خ</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">أ</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">ض</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">ف-ض</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-accent">نقاط</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-muted hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-right">
                      <Badge
                        variant={
                          row.rank <= 4
                            ? "default"
                            : row.rank === 5
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {row.rank}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {row.team}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                      {row.played}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-green-500 font-semibold">
                      {row.wins}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-yellow-500 font-semibold">
                      {row.draws}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-red-500 font-semibold">
                      {row.losses}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-foreground">
                      {row.gf}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-foreground">
                      {row.ga}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-accent font-semibold">
                      {row.gd > 0 ? "+" : ""}{row.gd}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-accent">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-6 mt-8 border-muted">
          <h3 className="font-semibold text-foreground mb-4">وسيلة الإيضاح</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-green-500">ف</span>
              <span className="text-sm text-muted-foreground">الفوز</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-yellow-500">ت</span>
              <span className="text-sm text-muted-foreground">التعادل</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-red-500">خ</span>
              <span className="text-sm text-muted-foreground">الخسارة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">أ</span>
              <span className="text-sm text-muted-foreground">الأهداف</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">ض</span>
              <span className="text-sm text-muted-foreground">الأهداف المستقبلة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-accent">ف-ض</span>
              <span className="text-sm text-muted-foreground">الفارق</span>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
