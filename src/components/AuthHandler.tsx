"use client";

import * as React from "react";
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function AuthHandler() {
  const { toast } = useToast();
  const [user, setUser] = React.useState<any>(null);

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

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) toast({ variant: "destructive", title: "Login Failed", description: error.message });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({ title: "Logged Out", description: "You have been logged out successfully." });
  };

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <Button onClick={handleLogout} variant="destructive">Logout</Button>
      ) : (
        <Button onClick={handleLogin}>Login with Google</Button>
      )}
    </div>
  );
}