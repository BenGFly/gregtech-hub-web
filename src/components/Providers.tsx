'use client';

import { TRPCProvider } from "@/lib/trpc/Provider";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <AuthProvider>
        <Navigation />
        <div className="pt-20">
          {children}
        </div>
      </AuthProvider>
    </TRPCProvider>
  );
}
