'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Key, ShieldCheck, ArrowLeft, AlertCircle, Info } from 'lucide-react';
import { setAuthSession, UserRole } from '@/lib/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom');

  const [email, setEmail] = useState('admin@llamerlo.com');
  const [password, setPassword] = useState('merloparticipa2026');
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

    // Auth simulation
    setTimeout(() => {
      if (email.includes('@') && password.length >= 6) {
        setAuthSession({
          email,
          role: email.includes('gestor') ? 'gestor' : 'admin',
        });
        router.push(getDestination());
      } else {
        setError('Credenciales no válidas. Ingrese un correo y contraseña válidos (mínimo 6 caracteres).');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickDemoAccess = (role: UserRole) => {
    const demoEmail = role === 'admin' ? 'admin@llamerlo.com' : 'gestor@llamerlo.com';
    setAuthSession({
      email: demoEmail,
      role: role,
    });
    router.push(getDestination());
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Return link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#391759] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al portal público</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#E8E4EF] shadow-lla-card space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#391759] to-[#240c3a] text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#17151D] tracking-tight">
              Acceso a Gestión
            </h1>
            <p className="text-xs text-[#6B6875]">
              Panel exclusivo para el equipo y legisladores de La Libertad Avanza Merlo.
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
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@llamerlo.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#622899]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Contraseña
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#622899]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-[#391759] hover:bg-[#240c3a] shadow-md shadow-[#391759]/25 transition-all flex items-center justify-center gap-2"
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
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
              Acceso rápido con un click:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoAccess('admin')}
                className="p-2 rounded-xl text-xs font-semibold bg-[#F4ECF9] text-[#240c3a] hover:bg-purple-100 border border-purple-200 transition-colors flex flex-col items-center justify-center gap-0.5"
              >
                <span className="font-bold">Administrador</span>
                <span className="text-[10px] text-purple-700 opacity-80">Acceso total</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoAccess('gestor')}
                className="p-2 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex flex-col items-center justify-center gap-0.5"
              >
                <span className="font-bold">Gestor Territorial</span>
                <span className="text-[10px] text-slate-500 opacity-80">Moderación y filtros</span>
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
        <span className="w-6 h-6 rounded-full border-2 border-[#391759] border-t-transparent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
