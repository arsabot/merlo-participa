import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 pb-6 border-b border-[#E8E4EF]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#391759] hover:underline mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-[#17151D] tracking-tight">
          Política de Privacidad y Términos de Uso
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6875]">
          Última actualización: Septiembre de 2026 &bull; Merlo Participa (La Libertad Avanza Merlo)
        </p>
      </div>

      {/* Main Legal Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E4EF] shadow-lla-soft space-y-8 text-xs sm:text-sm text-[#6B6875] leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#17151D] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#391759]" />
            <span>1. Marco Institucional y Propósito</span>
          </h2>
          <p>
            El portal <strong>Merlo Participa</strong> es una herramienta digital de participación cívica y comunitaria impulsada por el equipo de <strong>La Libertad Avanza Merlo</strong>. Su objetivo es recolectar, visibilizar y canalizar reclamos sobre servicios públicos e infraestructura urbana en el partido de Merlo, provincia de Buenos Aires.
          </p>
          <p className="font-semibold text-slate-800">
            Aclaración legal expresa: Este portal NO es un órgano oficial de la Municipalidad de Merlo ni sus dependencias, ni reemplaza los trámites administrativos formales ante las autoridades correspondientes.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#17151D] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#391759]" />
            <span>2. Protección de Datos Personales (Ley 25.326)</span>
          </h2>
          <p>
            En cumplimiento de la Ley Nacional N° 25.326 de Protección de los Datos Personales de la República Argentina, le informamos que los datos de contacto suministrados (nombre completo, correo electrónico y número de teléfono):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
            <li>Son tratados de manera <strong>estrictamente confidencial</strong> y no se comercializan ni ceden a terceros con fines publicitarios.</li>
            <li>Solo se utilizan para verificar la veracidad del reporte, informarle el estado de su reclamo y coordinar acciones vecinales de mejora.</li>
            <li><strong>Nunca se muestran públicamente</strong> en el listado ni en el mapa interactivo de reportes.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#17151D] flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#391759]" />
            <span>3. Visibilidad Pública y Geolocalización</span>
          </h2>
          <p>
            Al elegir la opción de reporte público, únicamente se difundirá el título del problema, la descripción comunitaria, la categoría, el barrio y la ubicación referencial en el mapa. La numeración domiciliaria exacta no se divulga por motivos de seguridad vecinal.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 p-5 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-950">
          <h2 className="text-base font-bold flex items-center gap-2 text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>4. Disclaimer de Emergencias Médicas y de Seguridad</span>
          </h2>
          <p className="text-xs leading-relaxed">
            <strong>Merlo Participa NO es una central de emergencias en tiempo real.</strong> Ante delitos en flagrancia, situaciones de violencia, riesgo inminente de vida, incendios o emergencias médicas, comuníquese de inmediato a los números gratuitos oficiales:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-center text-xs font-bold">
            <div className="p-2 rounded-xl bg-white border border-rose-300 text-rose-900">
              911 &bull; Policía de la Prov. de Bs. As.
            </div>
            <div className="p-2 rounded-xl bg-white border border-rose-300 text-rose-900">
              107 &bull; Emergencias Médicas (SAME)
            </div>
            <div className="p-2 rounded-xl bg-white border border-rose-300 text-rose-900">
              100 &bull; Bomberos Voluntarios
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-bold text-[#17151D]">
            5. Derechos de Acceso, Rectificación y Supresión
          </h2>
          <p>
            Cualquier vecino tiene derecho a solicitar la baja o rectificación de su reclamo o de sus datos de contacto en cualquier momento, enviando un mensaje con su código de seguimiento a través de los canales de contacto de La Libertad Avanza Merlo.
          </p>
        </section>

      </div>

    </div>
  );
}
