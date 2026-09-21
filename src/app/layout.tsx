import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Merlo Participa | Portal de Participación Vecinal - La Libertad Avanza Merlo",
  description: "Plataforma ciudadana para reportar problemáticas barriales, reclamos de infraestructura y propuestas comunitarias para el municipio de Merlo, Buenos Aires.",
  keywords: ["Merlo", "La Libertad Avanza", "Reclamos vecinales", "Participación ciudadana", "Padua", "Libertad", "Pontevedra", "Mariano Acosta"],
  authors: [{ name: "La Libertad Avanza Merlo" }],
  openGraph: {
    title: "Merlo Participa | Tu voz, tu barrio, tu municipio",
    description: "Espacio de escucha vecinal y gestión cívica para transformar los barrios de Merlo.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className="h-full antialiased scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#F8F7FC] text-[#17151D]">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
