"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  KeyRound, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff,
  Info
} from "lucide-react";
import { requestPasswordReset, verifyAndResetPassword } from "@/lib/auth";

export default function PasswordRecoveryPage() {
  const router = useRouter();

  // Steps: "request" | "verify" | "success"
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Step 1: Request Code
  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const res = requestPasswordReset(email);
      setIsLoading(false);

      if (res.success) {
        setStep("verify");
      } else {
        setError(res.message);
      }
    }, 400);
  };

  // Step 2: Verify code and set new password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Las nuevas contraseñas no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = verifyAndResetPassword(email, code, newPassword);
      setIsLoading(false);

      if (res.success) {
        setSuccessMessage(res.message);
        setStep("success");
      } else {
        setError(res.message);
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4F8A] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio de sesión</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-civic-card space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B4F8A] to-[#072C4F] text-white flex items-center justify-center mx-auto shadow-md">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
              {step === "success" ? "¡Clave Restablecida!" : "Recuperar Contraseña"}
            </h1>
            <p className="text-xs text-[#64748B]">
              {step === "request" && "Ingresa tu correo institucional para recibir un código de verificación seguro."}
              {step === "verify" && "Ingresa el código de 6 dígitos enviado a tu correo y define tu nueva clave."}
              {step === "success" && "Tu acceso ha sido actualizado correctamente."}
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Request Code Form */}
          {step === "request" && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Correo Electrónico Registrado
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@correo.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    required
                  />
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
                <span>Continuar y Enviar Código</span>
              </button>
            </form>
          )}

          {/* STEP 2: Verify code and set new password */}
          {step === "verify" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <p className="text-xs text-sky-900 leading-relaxed">
                  Si tu cuenta existe, se ha enviado un código de seguridad de 6 dígitos a <strong>{email}</strong>. Ingrésalo a continuación:
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Código de Verificación (6 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-center font-mono text-base font-bold tracking-wider focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284C7]"
                    required
                  />
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
                  <KeyRound className="w-4 h-4" />
                )}
                <span>Restablecer Contraseña</span>
              </button>

              <button
                type="button"
                onClick={() => setStep("request")}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 py-1"
              >
                ← Volver a ingresar otro correo
              </button>
            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === "success" && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">
                  Contraseña Actualizada
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {successMessage || "Tu contraseña ha sido actualizada. Ya puedes ingresar al panel con tus nuevas credenciales."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full py-3 rounded-xl font-bold text-sm text-white bg-[#0B4F8A] hover:bg-[#072C4F] shadow-md shadow-sky-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Ir al Inicio de Sesión</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
