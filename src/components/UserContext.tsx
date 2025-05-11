import React, { createContext, useContext, useState } from "react";

export type UserContextType = {
  supabaseUser: any;
  tofilUser: any;
  setUser: (user: { supabaseUser: any; tofilUser: any }) => void;
};

const UserContext = createContext<{
  supabaseUser: any;
  tofilUser: any;
  setUser: (user: { supabaseUser: any; tofilUser: any }) => void;
}>({
  supabaseUser: null,
  tofilUser: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [tofilUser, setTofilUser] = useState<any>(null);

  const setUser = ({ supabaseUser, tofilUser }: { supabaseUser: any; tofilUser: any }) => {
    setSupabaseUser(supabaseUser);
    setTofilUser(tofilUser);
  };

  return (
    <UserContext.Provider value={{ supabaseUser, tofilUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 