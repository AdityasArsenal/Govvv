"use client";

import * as React from "react";
import { supabase } from '@/lib/supabaseClient';
import { AuthHandler } from "@/components/AuthHandler";

export function UserGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any | null>(undefined);
  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (user === undefined) {
    // Loading state
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  if (!user) {
    // Only show AuthHandler (login button)
    return <div className="flex justify-center items-center h-screen"><AuthHandler /></div>;
  }
  // User is logged in, show app
  return <>{children}</>;
}
