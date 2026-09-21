import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://merlo-participa.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Merlo Participa | Portal de Participación Vecinal - La Libertad Avanza",
    template: "%s | Merlo Participa",
  },
  description: "Plataforma ciudadana para reportar problemáticas barriales, reclamos de infraestructura y propuestas comunitarias para el municipio de Merlo, Buenos Aires.",
  keywords: [
    "Merlo", 
    "La Libertad Avanza", 
    "La Libertad Avanza Merlo", 
    "Reclamos vecinales", 
    "Participación ciudadana", 
    "San Antonio de Padua", 
    "Libertad", 
    "Pontevedra", 
    "Mariano Acosta",
    "Parque San Martín"
  ],
  authors: [{ name: "La Libertad Avanza Merlo", url: siteUrl }],
  creator: "La Libertad Avanza Merlo",
  publisher: "La Libertad Avanza Merlo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Merlo Participa | Tu voz, tu barrio, tu municipio",
    description: "Espacio de escucha vecinal y gestión cívica para transformar los barrios de Merlo.",
    url: siteUrl,
    siteName: "Merlo Participa",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "Merlo Participa | La Libertad Avanza Merlo",
        type: 'image/png',
      },
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: "Merlo Participa - Icono Oficial",
        type: 'image/png',
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merlo Participa | Tu voz, tu barrio, tu municipio",
    description: "Espacio de escucha vecinal y gestión cívica para transformar los barrios de Merlo.",
    images: ['/og-image.png'],
    creator: "@llamerlo",
  },
  robots: {
    index: true,
    follow: true,
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
