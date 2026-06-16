import { useState } from 'react';
import { useAdminAuth } from '@/_core/hooks/useAdminAuth';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Plus, Edit2, Trash2, Eye, EyeOff, LogOut } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { user, isAdmin, logout, isCheckingAuth } = useAdminAuth({
    redirectOnUnauthenticated: true,
  });
  const [activeTab, setActiveTab] = useState('stats');
  const [showStreamForm, setShowStreamForm] = useState(false);
  const [showAdForm, setShowAdForm] = useState(false);
  const [streamFormData, setStreamFormData] = useState({
    title: '',
    streamUrl: '',
    streamType: 'HLS',
    quality: '720p',
    matchId: 1,
  });
  const [adFormData, setAdFormData] = useState({
    title: '',
    adType: 'BANNER',
    position: 'TOP',
    adCode: '',
  });

  // Fetch admin data
  const stats = trpc.admin.getStats.useQuery(undefined, {
    enabled: isAdmin,
    refetchInterval: 30000,
  });

  const logs = trpc.admin.getLogs.useQuery({ limit: 50 }, {
    enabled: isAdmin,
    refetchInterval: 60000,
  });

  const streams = trpc.streams.list.useQuery(undefined, {
    enabled: isAdmin,
    refetchInterval: 30000,
  });

  const ads = trpc.ads.list.useQuery(undefined, {
    enabled: isAdmin,
    refetchInterval: 30000,
  });

  // Mutations
  const createStreamMutation = trpc.streams.create.useMutation({
    onSuccess: () => {
      toast.success('تم إضافة البث بنجاح');
      setShowStreamForm(false);
      setStreamFormData({
        title: '',
        streamUrl: '',
        streamType: 'HLS',
        quality: '720p',
        matchId: 1,
      });
      streams.refetch();
    },
    onError: (error) => {
      toast.error('خطأ في إضافة البث');
    },
  });

  const deleteStreamMutation = trpc.streams.delete.useMutation({
    onSuccess: () => {
      toast.success('تم حذف البث');
      streams.refetch();
    },
  });

  const createAdMutation = trpc.ads.create.useMutation({
    onSuccess: () => {
      toast.success('تم إضافة الإعلان بنجاح');
      setShowAdForm(false);
      setAdFormData({
        title: '',
        adType: 'BANNER',
        position: 'TOP',
        adCode: '',
      });
      ads.refetch();
    },
    onError: (error) => {
      toast.error('خطأ في إضافة الإعلان');
    },
  });

  const deleteAdMutation = trpc.ads.delete.useMutation({
    onSuccess: () => {
      toast.success('تم حذف الإعلان');
      ads.refetch();
    },
  });

  if (isCheckingAuth) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">غير مصرح</h1>
            <p className="text-muted-foreground">يجب أن تكون مسؤول للوصول إلى هذه الصفحة</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">لوحة الإدمن</h1>
              <p className="text-muted-foreground">مرحبا {user?.name || user?.username}،  إدارة المباريات والبث والإعلانات</p>
            </div>
            <Button
              onClick={() => logout()}
              variant="outline"
              className="gap-2 border-red-500/30 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6 bg-card border-border">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {stats.data?.activeStreams || 0}
                </div>
                <p className="text-sm text-muted-foreground">بث مباشر نشط</p>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {stats.data?.activeAds || 0}
                </div>
                <p className="text-sm text-muted-foreground">إعلانات نشطة</p>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {streams.data?.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">إجمالي البث</p>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  {ads.data?.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">إجمالي الإعلانات</p>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Card className="p-6 bg-card border-border">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="stats">الإحصائيات</TabsTrigger>
                <TabsTrigger value="streams">البث المباشر</TabsTrigger>
                <TabsTrigger value="ads">الإعلانات</TabsTrigger>
                <TabsTrigger value="logs">السجلات</TabsTrigger>
              </TabsList>

              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 bg-muted">
                    <h3 className="font-semibold text-foreground mb-2">نشاط المنصة</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">البث النشط:</span>
                        <span className="font-semibold">{stats.data?.activeStreams}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">الإعلانات:</span>
                        <span className="font-semibold">{stats.data?.activeAds}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Streams Tab */}
              <TabsContent value="streams" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">إدارة البث المباشر</h2>
                  <Button
                    onClick={() => setShowStreamForm(!showStreamForm)}
                    className="gap-2 bg-accent text-black hover:bg-accent/90"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة بث جديد
                  </Button>
                </div>

                {/* Add Stream Form */}
                {showStreamForm && (
                  <Card className="p-4 bg-muted border-border space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="عنوان البث"
                        value={streamFormData.title}
                        onChange={(e) => setStreamFormData({ ...streamFormData, title: e.target.value })}
                      />
                      <Input
                        placeholder="رابط البث"
                        value={streamFormData.streamUrl}
                        onChange={(e) => setStreamFormData({ ...streamFormData, streamUrl: e.target.value })}
                      />
                      <select
                        value={streamFormData.streamType}
                        onChange={(e) => setStreamFormData({ ...streamFormData, streamType: e.target.value })}
                        className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      >
                        <option value="HLS">HLS</option>
                        <option value="M3U8">M3U8</option>
                        <option value="DASH">DASH</option>
                      </select>
                      <Input
                        type="number"
                        placeholder="معرف المباراة"
                        value={streamFormData.matchId}
                        onChange={(e) => setStreamFormData({ ...streamFormData, matchId: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          createStreamMutation.mutate(streamFormData as any);
                        }}
                        disabled={createStreamMutation.isPending}
                        className="bg-accent text-black hover:bg-accent/90"
                      >
                        {createStreamMutation.isPending ? 'جاري الحفظ...' : 'حفظ البث'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowStreamForm(false)}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Streams List */}
                <div className="space-y-3">
                  {streams.isLoading ? (
                    <div className="flex justify-center py-8"><Spinner /></div>
                  ) : streams.data && streams.data.length > 0 ? (
                    streams.data.map((stream: any) => (
                      <Card key={stream.id} className="p-4 bg-muted border-border flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{stream.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {stream.streamType} • {stream.quality} • مباراة #{stream.matchId}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className={stream.isActive ? 'bg-green-600' : 'bg-gray-600'}>
                            {stream.isActive ? '🟢 نشط' : '⚫ غير نشط'}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteStreamMutation.mutate({ id: stream.id })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">لا توجد بثوث مباشرة</p>
                  )}
                </div>
              </TabsContent>

              {/* Ads Tab */}
              <TabsContent value="ads" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">إدارة الإعلانات</h2>
                  <Button
                    onClick={() => setShowAdForm(!showAdForm)}
                    className="gap-2 bg-accent text-black hover:bg-accent/90"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة إعلان جديد
                  </Button>
                </div>

                {/* Add Ad Form */}
                {showAdForm && (
                  <Card className="p-4 bg-muted border-border space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="عنوان الإعلان"
                        value={adFormData.title}
                        onChange={(e) => setAdFormData({ ...adFormData, title: e.target.value })}
                      />
                      <select
                        value={adFormData.adType}
                        onChange={(e) => setAdFormData({ ...adFormData, adType: e.target.value })}
                        className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      >
                        <option value="BANNER">بانر</option>
                        <option value="VIDEO">فيديو</option>
                        <option value="NATIVE">أصلي</option>
                        <option value="GOOGLE_ADSENSE">Google AdSense</option>
                      </select>
                      <select
                        value={adFormData.position}
                        onChange={(e) => setAdFormData({ ...adFormData, position: e.target.value })}
                        className="px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      >
                        <option value="TOP">أعلى</option>
                        <option value="SIDEBAR">الشريط الجانبي</option>
                        <option value="BOTTOM">أسفل</option>
                        <option value="INLINE">مدمج</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          createAdMutation.mutate(adFormData as any);
                        }}
                        disabled={createAdMutation.isPending}
                        className="bg-accent text-black hover:bg-accent/90"
                      >
                        {createAdMutation.isPending ? 'جاري الحفظ...' : 'حفظ الإعلان'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAdForm(false)}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Ads List */}
                <div className="space-y-3">
                  {ads.isLoading ? (
                    <div className="flex justify-center py-8"><Spinner /></div>
                  ) : ads.data && ads.data.length > 0 ? (
                    ads.data.map((ad: any) => (
                      <Card key={ad.id} className="p-4 bg-muted border-border flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{ad.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {ad.adType} • {ad.position}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className={ad.isActive ? 'bg-green-600' : 'bg-gray-600'}>
                            {ad.isActive ? '🟢 نشط' : '⚫ غير نشط'}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteAdMutation.mutate({ id: ad.id })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">لا توجد إعلانات</p>
                  )}
                </div>
              </TabsContent>

              {/* Logs Tab */}
              <TabsContent value="logs" className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground mb-4">سجل الأنشطة</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.isLoading ? (
                    <div className="flex justify-center py-8"><Spinner /></div>
                  ) : logs.data && logs.data.length > 0 ? (
                    logs.data.map((log: any) => (
                      <div key={log.id} className="p-3 bg-muted border border-border rounded-lg text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground font-medium">{log.action}</span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(log.createdAt).toLocaleString('ar-SA')}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs mt-1">
                          النوع: {log.entityType} • المعرف: {log.entityId || 'N/A'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">لا توجد سجلات</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
