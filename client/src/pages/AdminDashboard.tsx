import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("streams");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    streamUrl: "",
    streamType: "HLS",
    quality: "720p",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            غير مصرح
          </h1>
          <p className="text-muted-foreground">
            يجب أن تكون مسؤول للوصول إلى هذه الصفحة
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            لوحة الإدمن
          </h1>
          <p className="text-muted-foreground">
            إدارة المباريات والبث والإعلانات
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">12</div>
              <p className="text-sm text-muted-foreground">بث مباشر نشط</p>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">8</div>
              <p className="text-sm text-muted-foreground">إعلانات نشطة</p>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">156</div>
              <p className="text-sm text-muted-foreground">مباراة مدارة</p>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                2.5K
              </div>
              <p className="text-sm text-muted-foreground">عدد المشاهدات</p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="p-6 bg-card border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="streams">البث المباشر</TabsTrigger>
              <TabsTrigger value="ads">الإعلانات</TabsTrigger>
              <TabsTrigger value="matches">المباريات</TabsTrigger>
              <TabsTrigger value="logs">السجلات</TabsTrigger>
            </TabsList>

            {/* Live Streams Tab */}
            <TabsContent value="streams" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  إدارة البث المباشر
                </h2>
                <Button
                  onClick={() => setShowForm(!showForm)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  إضافة بث جديد
                </Button>
              </div>

              {/* Add Stream Form */}
              {showForm && (
                <Card className="p-4 bg-muted border-border space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="عنوان البث"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                    <Input
                      placeholder="رابط البث (M3U8/HLS)"
                      value={formData.streamUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, streamUrl: e.target.value })
                      }
                    />
                    <select
                      value={formData.streamType}
                      onChange={(e) =>
                        setFormData({ ...formData, streamType: e.target.value })
                      }
                      className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
                    >
                      <option value="HLS">HLS</option>
                      <option value="M3U8">M3U8</option>
                      <option value="DASH">DASH</option>
                    </select>
                    <Input
                      placeholder="الجودة (مثال: 720p)"
                      value={formData.quality}
                      onChange={(e) =>
                        setFormData({ ...formData, quality: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-accent text-black hover:bg-accent/90">
                      حفظ البث
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      إلغاء
                    </Button>
                  </div>
                </Card>
              )}

              {/* Streams List */}
              <div className="space-y-3">
                {[1, 2, 3].map((stream) => (
                  <Card
                    key={stream}
                    className="p-4 bg-muted border-border flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        مباراة مباشرة #{stream}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        HLS • 720p • نشط
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-600">
                        🟢 نشط
                      </Badge>
                      <Button size="icon" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Ads Tab */}
            <TabsContent value="ads" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  إدارة الإعلانات
                </h2>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  إضافة إعلان جديد
                </Button>
              </div>

              {/* Google AdSense Setup */}
              <Card className="p-4 bg-muted border-border">
                <h3 className="font-semibold text-foreground mb-3">
                  Google AdSense
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">
                      رمز Google AdSense
                    </label>
                    <textarea
                      placeholder="الصق رمز Google AdSense هنا"
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground mt-1"
                      rows={4}
                    />
                  </div>
                  <Button className="bg-accent text-black hover:bg-accent/90">
                    حفظ الرمز
                  </Button>
                </div>
              </Card>

              {/* Ads List */}
              <div className="space-y-3">
                {[1, 2].map((ad) => (
                  <Card
                    key={ad}
                    className="p-4 bg-muted border-border flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        إعلان #{ad}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Google AdSense • الشريط الجانبي
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-600">
                        🟢 نشط
                      </Badge>
                      <Button size="icon" variant="ghost">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Matches Tab */}
            <TabsContent value="matches" className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                إدارة المباريات
              </h2>
              <div className="space-y-3">
                {[1, 2, 3].map((match) => (
                  <Card
                    key={match}
                    className="p-4 bg-muted border-border flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        مباراة #{match}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        دوري أبطال أوروبا • 2026-06-15
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">مباشر</Badge>
                      <Button size="icon" variant="ghost">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Logs Tab */}
            <TabsContent value="logs" className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                سجل الأنشطة
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {[1, 2, 3, 4, 5].map((log) => (
                  <div
                    key={log}
                    className="p-3 bg-muted border border-border rounded-lg text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">
                        تم إضافة بث جديد
                      </span>
                      <span className="text-muted-foreground text-xs">
                        منذ 5 دقائق
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">
                      بواسطة: المسؤول • IP: 192.168.1.1
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
