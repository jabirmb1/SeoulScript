"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="relative border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/30">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-3xl">🔮</div>
            <h1 className="text-2xl font-bold glow-text">
              SeoulScript
            </h1>
          </Link>

          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm transition-colors ${
                pathname === "/" 
                  ? "text-violet-400" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Feed
            </Link>
            <Link 
              href="/create" 
              className={`px-4 py-2 rounded-lg transition-all ${
                pathname === "/create"
                  ? "bg-violet-600 text-white glow"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
              }`}
            >
              Create
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}