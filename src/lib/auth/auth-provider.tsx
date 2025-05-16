import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context.tsx";
import {supabase} from "@/lib/supabase/client";

type AuthenticatedUser = {
  id: string;
  email?: string;
  token: string;
  displayName: string;
  organisationId: string;
};


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setUserState = useCallback((session: any) => {
    setUser(
      session && {
        id: session.user.id,
        email: session.user.email,
        token: session.access_token,
        displayName: session.user.email || "Anonymous",
        organisationId: session.user?.app_metadata?.tenant_id
      },
    );

    const _isAuthenticated = !!session;

    setIsAuthenticated(_isAuthenticated);
    setIsAnonymous(_isAuthenticated && (session?.user.is_anonymous || false));
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  useEffect(() => {
    const updateSessionOnStart = async () => {
      await supabase.auth.getUser();
      await supabase.auth.refreshSession();
      await supabase.auth.getSession().then(({ data: { session } }) => {
        setUserState(session);
      });
    };

    void updateSessionOnStart();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserState(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUserState]);

  const auth = useMemo(
    () => ({
      user,
      isAuthenticated,
      logout,
      isAnonymous,
    }),
    [isAuthenticated, isAnonymous, user, logout],
  );

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};