import React, { createContext, useContext, ReactNode, useState } from "react";

interface Admin {
  id: number;
  name: string;
  role : string
  email : string
}

interface AuthContextType {
  admin?: Admin;
  isLoading : boolean 
  setIsLoading : React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ admin, children }: { admin?: Admin ; children: ReactNode }) {
  const [isLoading , setIsLoading] = useState<boolean>(false) ;
  return <AuthContext.Provider value={{ admin  , isLoading  , setIsLoading}}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
