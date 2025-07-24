"use client";

import * as React from "react";
import { supabase } from '@/lib/supabaseClient';
import { AuthHandler } from "@/components/AuthHandler";

export function UserGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any | null>(undefined);
  const [hasAccess, setHasAccess] = React.useState(false);

  React.useEffect(() => {
    // Check for existing access
    if (localStorage.getItem('hasShared') === 'true') {
      setHasAccess(true);
    }

    // Get user session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Listen for visibility change to grant access after app switch
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && localStorage.getItem('shareInitiated') === 'true') {
        localStorage.setItem('hasShared', 'true');
        setHasAccess(true);
        localStorage.removeItem('shareInitiated');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      authListener.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'Check out this app!',
      text: 'Share this with 5 groups on WhatsApp to get 5 days of free access!',
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        // Set a flag that sharing has been initiated. Access will be granted on return.
        localStorage.setItem('shareInitiated', 'true');
      } else {
        // Fallback for browsers that don't support Web Share API
        alert('Please share this link: ' + shareData.url);
        // For the fallback, we'll grant access directly as we can't detect an app switch.
        localStorage.setItem('hasShared', 'true');
        setHasAccess(true);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // If sharing fails, we still set the initiated flag so access is granted on return.
      localStorage.setItem('shareInitiated', 'true');
    }
  };

  if (user === undefined) {
    // Loading state
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    // Only show AuthHandler (login button)
    return <div className="flex justify-center items-center h-screen"><AuthHandler /></div>;
  }

  if (hasAccess) {
    // User is logged in and has shared, show app
    return <>{children}</>;
  }

  // User is logged in but hasn't shared yet, show share prompt
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Unlock Your Free Access!</h2>
        <p className="mb-6 text-gray-700">Share this app with 5 friends or groups on WhatsApp to unlock 5 days of free access.</p>
        <button 
          onClick={handleShare} 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
}
