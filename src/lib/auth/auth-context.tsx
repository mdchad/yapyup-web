import { createContext } from 'react'

type AuthenticatedUser = {
  id: string;
  email?: string;
  token: string;
  displayName: string;
  organisationId: string;
};

export interface AuthContextType {
  user: AuthenticatedUser | null
  isAuthenticated: boolean
  isAnonymous: boolean
  logout: () => void | Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAnonymous: false,
  logout: () => {},
})
