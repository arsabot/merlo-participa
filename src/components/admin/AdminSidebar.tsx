'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  ArrowLeft, 
  UserCheck,
  LogOut 
} from 'lucide-react';
import { getClientAuthSession, clearAuthSession, AuthSession } from '@/lib/auth';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(getClientAuthSession());
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    clearAuthSession();
    router.push('/login');
  };

  const links = [
    { href: '/admin', label: 'Dashboard General', icon: LayoutDashboard },
    { href: '/admin/reclamos', label: 'Gestión de Reclamos', icon: FileText },
    { href: '/admin/moderacion', label: 'Moderación y Filtros', icon: ShieldCheck },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-[#E8E4EF] p-5 shrink-0 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#391759] flex items-center justify-center shadow-sm shrink-0">
            <img
              src="/merlo-logo.svg"
              alt="Merlo Participa"
              className="h-6 w-auto object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-sm text-[#17151D] block leading-tight">
              Gestión Vecinal
            </span>
            <span className="text-[10px] font-bold text-[#391759] uppercase tracking-wider">
              Merlo Participa
            </span>
          </div>
        </div>

        {/* User Role Card */}
        {session && (
          <div className="p-3 bg-[#F8F7FC] rounded-2xl border border-[#E8E4EF] space-y-1">
            <div className="flex items-center gap-2">
              <UserCheck className="w-3.5 h-3.5 text-[#391759]" />
              <span className="text-xs font-bold text-[#17151D]">
                {session.role === 'admin' ? 'Administrador Comunitario' : 'Gestor Barrial'}
              </span>
            </div>
            <p className="text-[11px] text-[#6B6875] truncate font-medium">
              {session.email}
            </p>
          </div>
        )}

        {/* Navigation links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#391759] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-[#F4ECF9] hover:text-[#240c3a]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Return & Logout */}
      <div className="pt-6 border-t border-slate-100 space-y-2 mt-6 lg:mt-0">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-purple-600" />
          <span>Volver al Portal Público</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
