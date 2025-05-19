"use client";

import React, { createContext, useContext, useState } from "react";
import { User as SupabaseUser } from '@supabase/supabase-js';

export type TofilUser = {
  id: string;
  email: string;
  type: 'OWNER' | 'CONTRACTOR' | 'ADMIN' | 'MANAGER';
  managerLocationId?: string;
  created_at?: string;
  updated_at?: string;
};

export type UserContextType = {
  supabaseUser: SupabaseUser | null;
  tofilUser: TofilUser | null;
  setUser: (user: { supabaseUser: SupabaseUser | null; tofilUser: TofilUser | null }) => void;
};

const UserContext = createContext<UserContextType>({
  supabaseUser: null,
  tofilUser: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [tofilUser, setTofilUser] = useState<TofilUser | null>(null);

  const setUser = ({ supabaseUser, tofilUser }: { supabaseUser: SupabaseUser | null; tofilUser: TofilUser | null }) => {
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