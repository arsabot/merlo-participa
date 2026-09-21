'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getClientAuthSession, AuthSession } from '@/lib/auth';
import { ShieldCheck, Loader2 } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const currentSession = getClientAuthSession();
    if (!currentSession) {
      const redirectUrl = `/login?redirectedFrom=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    } else {
      setSession(currentSession);
      setIsChecking(false);
    }
  }, [pathname, router]);

  if (isChecking || !session) {
    return (
      <div className="min-h-screen bg-[#F8F7FC] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 border border-[#E8E4EF] shadow-lla-card max-w-sm w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#391759] text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-7 h-7 text-purple-200" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-[#17151D]">
              Verificando autorización
            </h2>
            <p className="text-xs text-[#6B6875]">
              Validando credenciales de acceso al panel de gestión...
            </p>
          </div>
          <div className="flex items-center justify-center pt-2">
            <Loader2 className="w-6 h-6 text-[#391759] animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
