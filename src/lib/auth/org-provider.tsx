import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { supabase } from "@/lib/supabase/client";

export type Organisation = {
  id: string;
  name: string;
  // Add other org fields as needed
};

interface OrgContextType {
  organisation: Organisation | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const OrgContext = createContext<OrgContextType>({
  organisation: null,
  isLoading: false,
  error: null,
  refresh: async () => {},
});

export const OrgProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = useCallback(async () => {
    if (!user) {
      setOrganisation(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("organisations")
        .select("*")
        .eq("id", user.organisationId)
        .single();
      if (error) throw error;
      setOrganisation(data as Organisation);
    } catch (err: any) {
      setError(err.message || "Failed to fetch organization");
      setOrganisation(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  const value = useMemo(
    () => ({ organisation, isLoading, error, refresh: fetchOrganization }),
    [organisation, isLoading, error, fetchOrganization]
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export const useOrgContext = () => useContext(OrgContext); 