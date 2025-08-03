"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { AuthHandler } from "@/components/AuthHandler";

const PaymentPopup = () => (
  <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '2rem', background: 'black', border: '1px solid black', zIndex: 1000 }}>
    <h2>Payment Required</h2>
    <p>Your account is more than 7 days old. Please make a payment to continue using our service.</p>
    <a href="/dummy-payment-page">Proceed to Payment</a>
  </div>
);

export function UserGate({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            
            if (currentUser) {
                const createdAt = new Date(currentUser.created_at);
                const now = new Date();
                const ageInMs = now.getTime() - createdAt.getTime();
                const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
                // console.log(`User account is approximately ${ageInDays.toFixed(2)} days old.`);

                const sevenDays = 30 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

                if (ageInMs > sevenDays) {
                    setShowPaymentPopup(true);
                } else {
                    setShowPaymentPopup(false);
                }
            }
            setLoading(false);
        };

        checkUserSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                const createdAt = new Date(currentUser.created_at);
                const now = new Date();
                const ageInMs = now.getTime() - createdAt.getTime();
                const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
                // console.log(`User account is approximately ${ageInDays.toFixed(2)} days old.`);
                
                const sevenDays = 30 * 24 * 60 * 60 * 1000;

                if (ageInMs > sevenDays) {
                    setShowPaymentPopup(true);
                } else {
                    setShowPaymentPopup(false);
                }
            } else {
                setShowPaymentPopup(false);
            }
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!user) {
        return <AuthHandler />;
    }

    if (showPaymentPopup) {
        return <PaymentPopup />;
    }

    return <>{children}</>;
}
