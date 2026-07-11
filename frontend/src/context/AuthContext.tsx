import React, { createContext, useContext, useState } from "react";

interface AuthContextValue {
  userId: string | null;
  isAuthenticated: boolean;
  signInDemo: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  userId: null,
  isAuthenticated: false,
  signInDemo: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>("demo-user");
  const signInDemo = () => setUserId("demo-user");
  return (
    <AuthContext.Provider value={{ userId, isAuthenticated: !!userId, signInDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
