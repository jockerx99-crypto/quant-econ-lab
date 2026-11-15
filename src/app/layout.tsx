import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "katex/dist/katex.min.css";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const viewport: Viewport = {
  themeColor: "#fafaf9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export const metadata: Metadata = {
  title: "QuantEcon Lab | Micro-Learning Python & SQL pour l'Économétrie et le Pricing",
  description:
    "Plateforme interactive pas-à-pas pour maîtriser SQL et Python en économétrie, gestion des risques et tarification actuarielle.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QuantEcon",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-50 text-stone-800 min-h-screen selection:bg-sky-100 selection:text-sky-900`}
      >
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
