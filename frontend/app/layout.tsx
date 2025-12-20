import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair"
});

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains"
});

export const metadata: Metadata = {
  title: "SeoulScript — K-Drama Fanfiction",
  description: "Inspiration-first short-form K-drama stories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jetbrains.variable}`}>
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 min-h-screen text-slate-100">
        <div className="fixed inset-0 bg-[url('/stars.svg')] opacity-30 pointer-events-none" />
        <Header />
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}