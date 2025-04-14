import { useContext } from "react";
import {AuthContext} from "@/lib/auth/auth-context";

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};