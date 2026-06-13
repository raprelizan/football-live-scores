import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { AR } from "@shared/translations";

export default function Privacy() {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-accent mb-8">{AR.pages.privacy.title}</h1>

          <div className="space-y-6">
            <Card className="p-6 border-accent/50 bg-accent/5">
              <h2 className="text-2xl font-bold text-accent mb-4">1. مقدمة</h2>
              <p className="text-foreground leading-relaxed">
                نحن نقدر خصوصيتك. هذه السياسة توضح كيفية جمعنا واستخدامنا ومعالجتنا لبيانات المستخدمين على موقع كورة
                لايف.
              </p>
            </Card>

            <Card className="p-6 border-primary/50 bg-primary/5">
              <h2 className="text-2xl font-bold text-primary mb-4">2. البيانات التي نجمعها</h2>
              <ul className="space-y-2 text-foreground">
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>معلومات الجهاز والمتصفح</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>سجل التصفح والتفاعلات</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>عنوان IP والموقع الجغرافي</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>البيانات المتعلقة بالمباريات والفرق المفضلة</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-green-500/50 bg-green-500/5">
              <h2 className="text-2xl font-bold text-green-500 mb-4">3. كيفية استخدام البيانات</h2>
              <ul className="space-y-2 text-foreground">
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>تحسين تجربة المستخدم</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>تحليل الاستخدام والأداء</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>تقديم محتوى مخصص</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>الامتثال للقوانين واللوائح</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-accent/50 bg-accent/5">
              <h2 className="text-2xl font-bold text-accent mb-4">4. حماية البيانات</h2>
              <p className="text-foreground leading-relaxed mb-4">
                نحن نتخذ تدابير أمان قوية لحماية بيانات المستخدمين من الوصول غير المصرح والفقدان والتعديل.
              </p>
              <p className="text-foreground leading-relaxed">
                يتم نقل جميع البيانات عبر اتصالات آمنة (HTTPS) ويتم تخزينها في خوادم محمية.
              </p>
            </Card>

            <Card className="p-6 border-primary/50 bg-primary/5">
              <h2 className="text-2xl font-bold text-primary mb-4">5. ملفات تعريف الارتباط</h2>
              <p className="text-foreground leading-relaxed">
                يستخدم الموقع ملفات تعريف الارتباط لتحسين تجربتك. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات
                المتصفح الخاص بك.
              </p>
            </Card>

            <Card className="p-6 border-green-500/50 bg-green-500/5">
              <h2 className="text-2xl font-bold text-green-500 mb-4">6. حقوقك</h2>
              <ul className="space-y-2 text-foreground">
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>الحق في الوصول إلى بيانات شخصية</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>الحق في تصحيح البيانات غير الدقيقة</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>الحق في حذف البيانات</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>الحق في الاعتراض على معالجة البيانات</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 border-accent/50 bg-accent/5">
              <h2 className="text-2xl font-bold text-accent mb-4">7. التواصل معنا</h2>
              <p className="text-foreground leading-relaxed mb-2">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا على:
              </p>
              <a
                href="mailto:privacy@footballlive.app"
                className="text-accent hover:text-accent/80 transition-colors"
              >
                privacy@footballlive.app
              </a>
            </Card>

            <Card className="p-6 border-muted bg-muted/30">
              <p className="text-sm text-muted-foreground">
                آخر تحديث: يونيو 2026
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
