"use client";

import React, { createContext, useContext, useState } from "react";
import { User } from "@prisma/client";

export type UserContextType = {
  supabaseUser: unknown;
  tofilUser: User | null;
  setUser: (user: { supabaseUser: unknown; tofilUser: User | null }) => void;
};

const UserContext = createContext<{
  supabaseUser: unknown;
  tofilUser: User | null;
  setUser: (user: { supabaseUser: unknown; tofilUser: User | null }) => void;
}>({
  supabaseUser: null,
  tofilUser: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<unknown>(null);
  const [tofilUser, setTofilUser] = useState<User | null>(null);

  const setUser = ({ supabaseUser, tofilUser }: { supabaseUser: unknown; tofilUser: User | null }) => {
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