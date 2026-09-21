'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  PlusCircle, 
  Search, 
  Menu, 
  X, 
  MapPin, 
  Lightbulb, 
  HelpCircle, 
  ListOrdered,
  Lock,
  Home,
  type LucideIcon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks: { href: string; label: string; icon: LucideIcon }[] = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/reclamos', label: 'Reclamos vecinales', icon: ListOrdered },
    { href: '/mapa', label: 'Mapa barrial', icon: MapPin },
    { href: '/propuestas', label: 'Propuestas', icon: Lightbulb },
    { href: '/como-funciona', label: 'Cómo funciona', icon: HelpCircle },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      {/* Institutional Top Disclaimer Bar */}
      <div className="bg-[#0B4F8A] text-sky-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-sky-300 animate-pulse" />
        <span>Portal ciudadano independiente impulsado por los <strong>Vecinos de Merlo</strong> &bull; Tu voz para transformar el barrio</span>
        <span className="hidden md:inline text-sky-200 text-[11px] ml-2 font-normal">
          (Iniciativa comunitaria no oficial &bull; Emergencias llamar al 911)
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3.5 group focus:outline-none">
            <div className="h-12 w-12 rounded-2xl bg-[#0B4F8A] flex items-center justify-center shadow-md shadow-sky-900/20 group-hover:scale-105 transition-transform duration-200 p-1.5 border border-sky-700">
              <img
                src="/icon.svg"
                alt="Merlo Participa"
                className="h-9 w-9 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-[#0F172A] flex items-center gap-1.5 leading-none">
                Merlo<span className="text-[#0B4F8A]">Participa</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B4F8A] mt-1">
                Portal Vecinal Independiente
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'text-[#0B4F8A] bg-sky-50 font-bold'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/seguimiento"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-[#0B4F8A] bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-[#0B4F8A]" />
              <span>Consultar mi reclamo</span>
            </Link>

            <Link
              href="/reclamos/nuevo"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0B4F8A] hover:bg-[#072C4F] shadow-md shadow-sky-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Reportar un problema</span>
            </Link>

            <Link
              href="/admin"
              title="Acceso Gestión"
              className="p-2 text-[#64748B] hover:text-[#0B4F8A] hover:bg-sky-50 rounded-lg transition-colors ml-1"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/reclamos/nuevo"
              className="inline-flex items-center justify-center p-2 rounded-lg text-white bg-[#0B4F8A]"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#0F172A]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    active
                      ? 'bg-sky-50 text-[#0B4F8A] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#0B4F8A]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/seguimiento"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-[#0B4F8A] bg-sky-50 border border-sky-200"
            >
              <Search className="w-4 h-4" />
              <span>Consultar mi reclamo</span>
            </Link>

            <Link
              href="/reclamos/nuevo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0B4F8A]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Reportar un problema</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs text-slate-500 hover:text-[#0B4F8A] py-2"
            >
              Acceso a panel de gestión
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
