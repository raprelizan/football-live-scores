import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AR } from "@shared/translations";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

const topScorers = [
  { rank: 1, name: "Cristiano Ronaldo", team: "Real Madrid", goals: 42, assists: 8, matches: 35 },
  { rank: 2, name: "Lionel Messi", team: "Barcelona", goals: 41, assists: 12, matches: 34 },
  { rank: 3, name: "Luis Suárez", team: "Atletico Madrid", goals: 38, assists: 6, matches: 33 },
  { rank: 4, name: "Karim Benzema", team: "Real Madrid", goals: 35, assists: 7, matches: 32 },
  { rank: 5, name: "Antoine Griezmann", team: "Atletico Madrid", goals: 32, assists: 5, matches: 31 },
  { rank: 6, name: "Sergio García", team: "Sevilla", goals: 28, assists: 4, matches: 29 },
  { rank: 7, name: "Rodrigo Moreno", team: "Valencia", goals: 26, assists: 3, matches: 28 },
  { rank: 8, name: "Álvaro Negredo", team: "Sevilla", goals: 24, assists: 2, matches: 27 },
  { rank: 9, name: "Raúl García", team: "Atletico Madrid", goals: 22, assists: 1, matches: 26 },
  { rank: 10, name: "Vinícius Júnior", team: "Real Madrid", goals: 20, assists: 9, matches: 25 },
];

export default function Scorers() {
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
          <h1 className="text-4xl font-bold text-accent">{AR.nav.scorers}</h1>
          <p className="text-muted-foreground mt-2">أفضل الهدافين في البطولات</p>
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
              <SelectItem value="CL">دوري أبطال أوروبا</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Top Scorers */}
        <div className="space-y-3">
          {topScorers.map((scorer) => (
            <Card
              key={scorer.rank}
              className="p-4 border-accent/50 hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <Badge
                    variant="default"
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold"
                  >
                    {scorer.rank}
                  </Badge>

                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{scorer.name}</h3>
                    <p className="text-sm text-muted-foreground">{scorer.team}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">الأهداف</p>
                    <p className="text-2xl font-bold text-accent">{scorer.goals}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">التمريرات</p>
                    <p className="text-2xl font-bold text-green-500">{scorer.assists}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">المباريات</p>
                    <p className="text-2xl font-bold text-primary">{scorer.matches}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">المتوسط</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {(scorer.goals / scorer.matches).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Info */}
        <Card className="p-6 mt-8 border-muted">
          <h3 className="font-semibold text-foreground mb-4">معلومات الإحصائيات</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">أفضل هداف</p>
              <p className="text-lg font-bold text-accent">{topScorers[0].name}</p>
              <p className="text-sm text-green-500">{topScorers[0].goals} أهداف</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">أفضل معطي تمريرات</p>
              <p className="text-lg font-bold text-accent">{topScorers[1].name}</p>
              <p className="text-sm text-green-500">{topScorers[1].assists} تمريرات</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">أفضل نسبة أهداف</p>
              <p className="text-lg font-bold text-accent">
                {(topScorers[0].goals / topScorers[0].matches).toFixed(2)}
              </p>
              <p className="text-sm text-green-500">هدف لكل مباراة</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي الأهداف</p>
              <p className="text-lg font-bold text-accent">
                {topScorers.reduce((sum, s) => sum + s.goals, 0)}
              </p>
              <p className="text-sm text-green-500">من أفضل 10 هدافين</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
