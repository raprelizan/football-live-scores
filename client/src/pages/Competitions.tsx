import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AR } from "@shared/translations";
import { Link } from "wouter";
import { ChevronLeft } from "lucide-react";

const competitions = [
  {
    id: "CL",
    name: "دوري أبطال أوروبا",
    englishName: "UEFA Champions League",
    country: "أوروبا",
    teams: 32,
    matches: 125,
    color: "from-blue-600 to-blue-800",
  },
  {
    id: "PL",
    name: "الدوري الإنجليزي الممتاز",
    englishName: "Premier League",
    country: "إنجلترا",
    teams: 20,
    matches: 380,
    color: "from-purple-600 to-purple-800",
  },
  {
    id: "LA",
    name: "الدوري الإسباني",
    englishName: "La Liga",
    country: "إسبانيا",
    teams: 20,
    matches: 380,
    color: "from-red-600 to-red-800",
  },
  {
    id: "SA",
    name: "الدوري الإيطالي",
    englishName: "Serie A",
    country: "إيطاليا",
    teams: 20,
    matches: 380,
    color: "from-green-600 to-green-800",
  },
  {
    id: "BL1",
    name: "الدوري الألماني",
    englishName: "Bundesliga",
    country: "ألمانيا",
    teams: 18,
    matches: 306,
    color: "from-yellow-600 to-yellow-800",
  },
  {
    id: "FL1",
    name: "الدوري الفرنسي",
    englishName: "Ligue 1",
    country: "فرنسا",
    teams: 20,
    matches: 380,
    color: "from-indigo-600 to-indigo-800",
  },
  {
    id: "WC",
    name: "كأس العالم",
    englishName: "FIFA World Cup",
    country: "العالم",
    teams: 32,
    matches: 64,
    color: "from-orange-600 to-orange-800",
  },
];

export default function Competitions() {
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
          <h1 className="text-4xl font-bold text-accent">{AR.nav.competitions}</h1>
          <p className="text-muted-foreground mt-2">تصفح أشهر البطولات العالمية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitions.map((comp) => (
            <Card
              key={comp.id}
              className="overflow-hidden border-accent/50 hover:border-accent transition-colors cursor-pointer group"
            >
              <div className={`bg-gradient-to-r ${comp.color} p-6 text-white`}>
                <h2 className="text-2xl font-bold mb-2">{comp.name}</h2>
                <p className="text-sm opacity-90">{comp.englishName}</p>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الدولة</p>
                    <p className="font-semibold text-foreground">{comp.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الفرق</p>
                    <p className="font-semibold text-foreground">{comp.teams}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">المباريات</p>
                    <p className="font-semibold text-accent">{comp.matches}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الحالة</p>
                    <Badge variant="outline">جاري</Badge>
                  </div>
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground group-hover:shadow-lg transition-shadow">
                  عرض المباريات
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
