"use client";

import React, { createContext, useContext, useState } from "react";

export type UserContextType = {
  supabaseUser: unknown;
  tofilUser: unknown;
  setUser: (user: { supabaseUser: unknown; tofilUser: unknown }) => void;
};

const UserContext = createContext<{
  supabaseUser: unknown;
  tofilUser: unknown;
  setUser: (user: { supabaseUser: unknown; tofilUser: unknown }) => void;
}>({
  supabaseUser: null,
  tofilUser: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<unknown>(null);
  const [tofilUser, setTofilUser] = useState<unknown>(null);

  const setUser = ({ supabaseUser, tofilUser }: { supabaseUser: unknown; tofilUser: unknown }) => {
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