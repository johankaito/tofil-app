"use client";

import React, { createContext, useContext, useState } from "react";

export type UserContextType = {
  supabaseUser: unknown;
  tofilUser: any;
  setUser: (user: { supabaseUser: unknown; tofilUser: any }) => void;
};

const UserContext = createContext<{
  supabaseUser: unknown;
  tofilUser: any;
  setUser: (user: { supabaseUser: unknown; tofilUser: any }) => void;
}>({
  supabaseUser: null,
  tofilUser: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<unknown>(null);
  const [tofilUser, setTofilUser] = useState<any>(null);

  const setUser = ({ supabaseUser, tofilUser }: { supabaseUser: unknown; tofilUser: any }) => {
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