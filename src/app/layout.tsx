import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://merlo-participa.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Merlo Participa | Portal Vecinal y Participación Ciudadana",
    template: "%s | Merlo Participa",
  },
  description: "Plataforma ciudadana independiente impulsada por los vecinos para reportar problemáticas barriales, reclamos de infraestructura y propuestas comunitarias para el municipio de Merlo.",
  keywords: [
    "Merlo", 
    "Merlo Participa",
    "Portal Vecinal Merlo", 
    "Reclamos vecinales Merlo", 
    "Participación ciudadana", 
    "Vecinos de Merlo",
    "San Antonio de Padua", 
    "Libertad", 
    "Pontevedra", 
    "Mariano Acosta",
    "Parque San Martín",
    "Merlo Centro"
  ],
  authors: [{ name: "Vecinos de Merlo", url: siteUrl }],
  creator: "Merlo Participa",
  publisher: "Comunidad de Merlo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Merlo Participa | Tu voz, tu barrio, tu comunidad",
    description: "Plataforma ciudadana independiente impulsada por vecinos de Merlo para visibilizar reclamos de luminarias, baches, cloacas, seguridad y propuestas barriales.",
    url: siteUrl,
    siteName: "Merlo Participa",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Merlo Participa | Portal Vecinal Independiente",
        type: 'image/png',
      },
      {
        url: `${siteUrl}/icon.png`,
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
    title: "Merlo Participa | Tu voz, tu barrio, tu comunidad",
    description: "Plataforma ciudadana independiente impulsada por vecinos de Merlo para visibilizar reclamos y transformar los barrios.",
    images: [`${siteUrl}/twitter-image`],
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
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
