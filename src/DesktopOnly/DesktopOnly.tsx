"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function DesktopOnly() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-md w-full mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 p-8 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            <Image
              src="/logo.png"
              alt="CodeNest Logo"
              width={64}
              height={64}
              className="mx-auto mb-4 w-16 h-16 rounded-full shadow-lg"
            />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Desktop View Required
            </h1>
          
          <p className="text-gray-400">
            CodeNest is optimized for desktop use. Please switch to a desktop device 
            to access the full code editing experience.
          </p>

          <div className="pt-4">
            <div className="animate-bounce p-4 bg-gray-800/50 rounded-xl inline-block">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
