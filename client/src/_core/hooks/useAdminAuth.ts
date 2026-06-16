import { useCallback, useEffect, useMemo, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type UseAdminAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAdminAuth(options?: UseAdminAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = '/admin/login' } = options ?? {};
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
      toast.success('تم تسجيل الخروج');
      window.location.href = '/admin/login';
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('خطأ في تسجيل الخروج');
    }
  }, [logoutMutation]);

  const state = useMemo(() => {
    const user = meQuery.data;
    const isAdmin = user?.role === 'admin';
    return {
      user: isAdmin ? user : null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: !!user,
      isAdmin,
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  useEffect(() => {
    setIsCheckingAuth(meQuery.isLoading);
  }, [meQuery.isLoading]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (isCheckingAuth) return;
    if (state.isAdmin) return;
    if (typeof window === 'undefined') return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, isCheckingAuth, state.isAdmin]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
    isCheckingAuth,
  };
}
