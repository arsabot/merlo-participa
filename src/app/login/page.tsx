'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Lock, 
  Mail, 
  Key, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle, 
  Info,
  Eye,
  EyeOff,
  KeyRound
} from 'lucide-react';
import { validateCredentials, setAuthSession, getAccounts, UserRole } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDestination = () => {
    if (redirectedFrom && redirectedFrom.startsWith('/admin')) {
      return redirectedFrom;
    }
    return '/admin';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const res = validateCredentials(email, password);
      setIsLoading(false);

      if (res.success && res.session) {
        router.push(getDestination());
      } else {
        setError(res.error || 'Credenciales inválidas. Por favor verifique sus datos.');
      }
    }, 400);
  };

  const handleQuickDemoAccess = (role: UserRole) => {
    const targetEmail = role === 'admin' ? 'admin@merloparticipa.org' : 'gestor@merloparticipa.org';
    const accounts = getAccounts();
    const account = accounts.find((a) => a.email.toLowerCase() === targetEmail);

    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setAuthSession({
        email: account.email,
        name: account.name,
        role: account.role,
      });
      router.push(getDestination());
    } else {
      setAuthSession({
        email: targetEmail,
        role: role,
      });
      router.push(getDestination());
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Return link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4F8A] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al portal público</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-civic-card space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B4F8A] to-[#072C4F] text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
              Acceso a Gestión Vecinal
            </h1>
            <p className="text-xs text-[#64748B]">
              Panel para coordinadores barriales y administradores comunitarios de Merlo Participa.
            </p>
          </div>

          {/* Notice if redirected from a protected route */}
          {redirectedFrom && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Autenticación requerida</span>
                Debes iniciar sesión para acceder a la ruta protegida solicitada.
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@merloparticipa.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Contraseña
                </label>
                <Link
                  href="/recuperar-clave"
                  className="text-[11px] font-bold text-[#0B4F8A] hover:underline flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>¿Olvidaste tu contraseña?</span>
                </Link>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-[#0B4F8A] hover:bg-[#072C4F] shadow-md shadow-sky-900/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>Ingresar al Panel</span>
            </button>
          </form>

          {/* Quick Demo Access Roles */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
              Acceso rápido con contraseña precargada:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoAccess('admin')}
                className="p-2.5 rounded-xl text-xs font-semibold bg-sky-50 text-[#072C4F] hover:bg-sky-100 border border-sky-200 transition-colors flex flex-col items-center justify-center gap-1"
              >
                <span className="font-bold text-sky-950">Administrador</span>
                <span className="text-[10px] text-sky-700 font-mono bg-white px-1.5 py-0.5 rounded border border-sky-200">
                  Merlo2026!
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoAccess('gestor')}
                className="p-2.5 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex flex-col items-center justify-center gap-1"
              >
                <span className="font-bold text-slate-900">Gestor Barrial</span>
                <span className="text-[10px] text-slate-600 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  GestorMerlo2026!
                </span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="w-6 h-6 rounded-full border-2 border-[#0B4F8A] border-t-transparent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
