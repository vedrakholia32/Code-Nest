"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useRef, useState } from "react";
import { LANGUAGE_CONFIG } from "../_constants";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDownIcon, Sparkles } from "lucide-react";
import useMounted from "@/hooks/useMounted";
// import useMounted from "@/hooks/useMounted";

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useMounted();

  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguageObj = LANGUAGE_CONFIG[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langId: string) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="relative hover:cursor-pointer" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-3 py-1.5 rounded-md transition-all 
        duration-200 bg-[#1e1e2e] border border-[#232334] hover:border-[#343444] hover:bg-[#2a2a3a]"
      >
        {/* Decoration */}
        <div className="size-5 rounded-md p-0.5">
          <Image
            src={currentLanguageObj.logoPath}
            alt="programming language logo"
            width={20}
            height={20}
            className="w-full h-full object-contain"
          />
        </div>

        <span className="text-[#b3b3b3] text-sm font-medium">
          {currentLanguageObj.label}
        </span>

        <ChevronDownIcon
          className={`w-4 h-4 text-[#b3b3b3] transition-transform duration-200
            ${isOpen ? "rotate-180" : ""}`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-1 w-48 bg-[#1e1e2e]
           rounded-md border border-[#232334] shadow-xl py-1.5 z-50"
          >
            <div className="px-3 pb-2 mb-2 border-b border-gray-800/50">
              <p className="text-xs font-medium text-gray-400">
                Select Language
              </p>
            </div>

            <div className="max-h-[280px] overflow-y-auto overflow-x-hidden hover:cursor-pointer">
              {Object.values(LANGUAGE_CONFIG).map((lang, index) => (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group px-2"
                >
                  <button
                    className={`
                    relative w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors
                    ${language === lang.id ? "text-[#eabc60]" : "text-[#b3b3b3]"} hover:bg-[#2a2a3a]
                  `}
                    onClick={() => handleLanguageSelect(lang.id)}
                    >
                      <div className="size-5 rounded-md p-0.5">
                        <Image
                          width={20}
                          height={20}
                          src={lang.logoPath}
                          alt={`${lang.label} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <span className="flex-1 text-left text-sm font-medium">
                        {lang.label}
                      </span>

                      {language === lang.id && (
                        <Sparkles className="w-3.5 h-3.5 text-[#eabc60]" />
                      )}
                    </button>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default LanguageSelector;
