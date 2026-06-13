import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { AR } from "@shared/translations";

export default function About() {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-accent mb-8">{AR.pages.about.title}</h1>

          <Card className="p-8 mb-8 border-accent/50 bg-accent/5">
            <h2 className="text-2xl font-bold text-accent mb-4">عن كورة لايف</h2>
            <p className="text-foreground mb-4 leading-relaxed">
              {AR.pages.about.description}
            </p>
            <p className="text-foreground mb-4 leading-relaxed">
              نحن نوفر لك تجربة متكاملة لمتابعة أحدث نتائج المباريات والإحصائيات من أشهر البطولات العالمية مثل دوري
              أبطال أوروبا والدوري الإنجليزي والدوري الإسباني والدوري الإيطالي والدوري الألماني والدوري الفرنسي
              وكأس العالم.
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 border-primary/50 bg-primary/5">
              <h3 className="text-xl font-bold text-primary mb-3">🎯 مهمتنا</h3>
              <p className="text-foreground text-sm leading-relaxed">
                توفير منصة موثوقة وسريعة لمتابعة مباريات كرة القدم بشكل مباشر وحي مع أحدث الإحصائيات والتحليلات.
              </p>
            </Card>

            <Card className="p-6 border-accent/50 bg-accent/5">
              <h3 className="text-xl font-bold text-accent mb-3">⚡ الميزات</h3>
              <p className="text-foreground text-sm leading-relaxed">
                تحديث فوري كل 30 ثانية، واجهة عربية كاملة، وضع ليلي ونهاري، وبيانات موثوقة من Football-Data.org.
              </p>
            </Card>
          </div>

          <Card className="p-8 border-green-500/50 bg-green-500/5">
            <h2 className="text-2xl font-bold text-green-500 mb-4">البطولات المدعومة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span className="text-foreground">{AR.competitions.championsLeague}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span className="text-foreground">{AR.competitions.premierLeague}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span className="text-foreground">{AR.competitions.laLiga}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span className="text-foreground">{AR.competitions.serieA}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span className="text-foreground">{AR.competitions.bundesliga}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span className="text-foreground">{AR.competitions.ligue1}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
