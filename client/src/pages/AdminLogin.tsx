import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import Layout from '@/components/Layout';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to login');
        toast.error(data.error || 'Login failed');
        return;
      }

      toast.success('تم تسجيل الدخول بنجاح');
      // Redirect to admin dashboard
      navigate('/admin');
      
      // Refresh the page to update auth state
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="p-8 space-y-6 bg-card border-border">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Lock className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground">لوحة الإدارة</h1>
              <p className="text-muted-foreground">تسجيل الدخول للمسؤولين</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 text-right"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 text-right"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full bg-accent text-black hover:bg-accent/90 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-4 h-4 ml-2" />
                    جاري التسجيل...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="pt-4 border-t border-border text-center text-sm text-muted-foreground">
              <p>نسخة آمنة 🔒 للمسؤولين فقط</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
