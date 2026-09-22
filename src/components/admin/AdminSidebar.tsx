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
  LogOut,
  KeyRound,
  X,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getClientAuthSession, clearAuthSession, changePassword, AuthSession } from '@/lib/auth';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);

  // Modal change password state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSession(getClientAuthSession());
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    clearAuthSession();
    router.push('/login');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    if (!session?.email) {
      setModalError('No hay sesión activa.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalError('Las nuevas contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 6) {
      setModalError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = changePassword(session.email, currentPassword, newPassword);
      setIsSubmitting(false);

      if (res.success) {
        setModalSuccess('¡Contraseña actualizada correctamente!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setModalSuccess(null);
        }, 2000);
      } else {
        setModalError(res.message);
      }
    }, 400);
  };

  const links = [
    { href: '/admin', label: 'Dashboard General', icon: LayoutDashboard },
    { href: '/admin/reclamos', label: 'Gestión de Reclamos', icon: FileText },
    { href: '/admin/moderacion', label: 'Moderación y Filtros', icon: ShieldCheck },
  ];

  return (
    <>
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-[#E2E8F0] p-5 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0B4F8A] flex items-center justify-center shadow-sm shrink-0">
              <img
                src="/icon.svg"
                alt="Merlo Participa"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#0F172A] block leading-tight">
                Gestión Vecinal
              </span>
              <span className="text-[10px] font-bold text-[#0B4F8A] uppercase tracking-wider">
                Merlo Participa
              </span>
            </div>
          </div>

          {/* User Role Card */}
          {session && (
            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#0B4F8A]" />
                  <span className="text-xs font-bold text-[#0F172A]">
                    {session.role === 'admin' ? 'Administrador Comunitario' : 'Gestor Barrial'}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] truncate font-medium">
                  {session.email}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setModalError(null);
                  setModalSuccess(null);
                  setIsPasswordModalOpen(true);
                }}
                className="w-full py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-[#0B4F8A] hover:bg-sky-50 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <KeyRound className="w-3 h-3" />
                <span>Cambiar Clave</span>
              </button>
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
                      ? 'bg-[#0B4F8A] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-[#F0F7FF] hover:text-[#072C4F]'
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
            <ArrowLeft className="w-4 h-4 text-sky-600" />
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

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-sky-50 text-[#0B4F8A] rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cambiar Contraseña
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {session?.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            {modalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{modalSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#0B4F8A] hover:bg-[#072C4F] text-xs font-bold text-white shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
