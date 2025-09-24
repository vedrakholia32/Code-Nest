"use client";
import { Sparkles, Code, FolderOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import HeaderProfileBtn from "./HeaderProfileBtn";

function Header({
  isPro = false,
  showLanguageSelector = true,
  activeMode = "single",
  onModeChange,
}: {
  isPro?: boolean;
  showLanguageSelector?: boolean;
  activeMode?: "single" | "project";
  onModeChange?: (mode: "single" | "project") => void;
}) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="relative w-9 h-9">
              <Image
                src="/Code-Nest-new.png"
                alt="Logo"
                width={36}
                height={36}
                className="object-contain rounded-2xl transition-transform duration-200 group-hover:scale-105"
                priority
                draggable={false}
              />
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          {/* Mode Toggle Buttons */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => onModeChange?.("single")}
              className={`p-2 rounded-lg transition-colors flex items-center ${
                activeMode === "single"
                  ? "bg-purple-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              title="Snippet Mode"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (isPro) {
                  onModeChange?.("project");
                } else {
                  // Show upgrade prompt for non-Pro users
                  if (
                    typeof window !== 'undefined' && 
                    window.confirm(
                      "Project Mode is a Pro feature that allows you to create multi-file projects. Would you like to upgrade to Pro now?"
                    )
                  ) {
                    window.location.href = "/pricing";
                  }
                }
              }}
              className={`p-2 rounded-lg transition-colors relative flex items-center ${
                activeMode === "project"
                  ? "bg-purple-600 text-white"
                  : isPro
                    ? "text-gray-400 hover:text-white hover:bg-gray-700"
                    : "text-gray-600 hover:text-gray-400 cursor-pointer"
              }`}
              title={
                !isPro
                  ? "Upgrade to Pro to access Project Mode"
                  : "Project Mode"
              }
            >
              <FolderOpen className="w-4 h-4" />
              {!isPro && (
                <span className="absolute -top-1 -right-1 text-xs bg-gradient-to-r from-[#eabc60] to-[#d4a74a] text-black px-1.5 py-0.5 rounded-full font-bold shadow-sm animate-pulse">
                  PRO
                </span>
              )}
            </button>
            {!isPro && (
              <Link
                href="/pricing"
                className="ml-2 px-3 py-1.5 bg-gradient-to-r from-[#eabc60] to-[#d4a74a] hover:from-[#d4a74a] hover:to-[#c19635] text-black rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Sparkles className="w-3 h-3" />
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
        <nav className="flex-1 flex justify-center gap-3">
          <Link
            href="/snippets"
            className={`text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide px-4 py-1.5 rounded-md ${
              pathname === "/snippets"
                ? "bg-purple-600 text-white font-medium tracking-wide"
                : "text-gray-300 hover:text-white"
            }`}
          >
            CODE GALLERY
          </Link>
          {isPro ? (
            <Link
              href="/library"
              className={`text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide px-4 py-1.5 rounded-md ${
                pathname === "/library"
                  ? "bg-purple-600 text-white font-medium tracking-wide"
                  : ""
              }`}
            >
              PROJECT SHOWCASE
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => {}}
                disabled
                className="px-4 py-1.5 rounded-md text-gray-400 cursor-not-allowed relative opacity-60"
                title="Upgrade to Pro to access Project Showcase"
              >
                Project Showcase
                <span className="absolute -top-1 -right-1 text-xs bg-yellow-500 text-black px-1 py-0.5 rounded font-bold">
                  PRO
                </span>
              </button>
            </div>
          )}
        </nav>
        <div className="flex items-center">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-md">
            <ThemeSelector />
            {showLanguageSelector && activeMode === "single" && (
              <>
                <div className="h-4 w-px bg-gray-600" />
                <LanguageSelector />
              </>
            )}
          </div>
          {!isPro && (
            <Link
              href="/pricing"
              className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-800 text-yellow-500 hover:bg-gray-700 transition-all duration-200 mx-5"
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
