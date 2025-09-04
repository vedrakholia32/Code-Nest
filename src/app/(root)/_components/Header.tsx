"use client";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import HeaderProfileBtn from "./HeaderProfileBtn";

function Header({ isPro = false }: { isPro?: boolean }) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#181825]/95 border-b border-[#232334] shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="relative w-9 h-9">
              <Image
                src="/logo.png"
                alt="CodeNest Logo"
                width={36}
                height={36}
                className="object-contain rounded-2xl transition-transform duration-200 group-hover:scale-105"
                priority
                draggable={false}
              />
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="block text-lg font-bold text-[#b3b3b3] group-hover:text-[#e0e0e0] transition-colors duration-300">
                CodeNest
              </span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 flex justify-center">
          <Link
            href="/snippets"
            className="px-4 py-1.5 rounded-md bg-[#1e1e2e] text-[#b3b3b3] border border-[#232334] hover:bg-[#2a2a3a] hover:border-[#343444] transition-all duration-200"
          >
            Code Library
          </Link>
        </nav>
        <div className="flex items-center">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-[#1e1e2e] rounded-md mr-3">
            <ThemeSelector />
            <div className="h-4 w-px bg-[#232334]" />
            <LanguageSelector hasAccess={isPro} />
          </div>
          {!isPro && (
            <Link
              href="/pricing"
              className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1e1e2e] text-[#eabc60] border border-[#eabc60]/20 hover:bg-[#24232f] transition-all duration-200"
            >
              <Sparkles className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              <span className="text-sm font-medium">Pro</span>
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#eabc60]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </Link>
          )}

          <HeaderProfileBtn />
        </div>
      </div>
    </header>
  );
}
export default Header;
