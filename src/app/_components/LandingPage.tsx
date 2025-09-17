"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Play, 
  Search
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Flowing Abstract Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main flowing shape */}
        <motion.div
          className="absolute top-1/4 right-0 w-[800px] h-[600px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <svg viewBox="0 0 800 600" className="w-full h-full">
            <defs>
              <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <motion.path
              d="M400,50 C500,50 600,100 650,200 C700,300 650,400 550,450 C450,500 350,450 300,350 C250,250 300,150 400,50 Z"
              fill="none"
              stroke="url(#flowGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
            {/* Multiple flowing lines */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.path
                key={i}
                d={`M${400 + i * 15},${50 + i * 10} C${500 + i * 12},${50 + i * 8} ${600 + i * 10},${100 + i * 12} ${650 + i * 8},${200 + i * 15} C${700 + i * 6},${300 + i * 10} ${650 + i * 8},${400 + i * 8} ${550 + i * 10},${450 + i * 12} C${450 + i * 12},${500 + i * 8} ${350 + i * 10},${450 + i * 10} ${300 + i * 8},${350 + i * 12} C${250 + i * 6},${250 + i * 15} ${300 + i * 8},${150 + i * 10} ${400 + i * 15},${50 + i * 10} Z`}
                fill="none"
                stroke={`rgba(${99 + i * 10}, ${102 + i * 15}, ${241 + i * 2}, ${0.1 + i * 0.02})`}
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3 + i * 0.2, delay: i * 0.1, ease: "easeInOut" }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Secondary flowing shape */}
        <motion.div
          className="absolute bottom-0 right-1/4 w-[600px] h-[400px]"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        >
          <svg viewBox="0 0 600 400" className="w-full h-full">
            <defs>
              <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.path
                key={i}
                d={`M${100 + i * 20},${300 - i * 15} C${200 + i * 25},${280 - i * 12} ${300 + i * 20},${320 - i * 18} ${400 + i * 15},${300 - i * 10} C${500 + i * 10},${280 - i * 8} ${480 + i * 12},${200 - i * 15} ${380 + i * 18},${180 - i * 12} C${280 + i * 15},${160 - i * 10} ${180 + i * 12},${180 - i * 8} ${100 + i * 20},${300 - i * 15} Z`}
                fill="none"
                stroke={`rgba(${59 + i * 15}, ${130 + i * 12}, ${246 - i * 10}, ${0.08 + i * 0.015})`}
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2.5 + i * 0.15, delay: 0.8 + i * 0.1, ease: "easeInOut" }}
              />
            ))}
          </svg>
        </motion.div>
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-50 px-6 py-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src="/logo.png"
                alt="CodeNest"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold">CodeNest</span>
            </motion.div>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/snippets" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">CODE GALLERY</Link>
              <Link href="/library" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">PROJECTS</Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">PRICING</Link>
              <Link href="/profile" className="text-gray-300 hover:text-white transition-colors text-sm font-medium tracking-wide">PROFILE</Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-all duration-300">
                  SIGN IN
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Left Content */}
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Code.
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                  Create.
                </span>
                <br />
                Share.
              </motion.h1>
              
              {/* Search Bar */}
              <motion.div
                className="relative mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search for code snippets, projects..."
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-full py-4 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/50"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <SignUpButton mode="modal">
                  <motion.button 
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">START CODING</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </SignUpButton>
                <motion.a
                  href="/snippets"
                  className="px-8 py-4 border border-gray-600 hover:border-gray-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gray-900/50 relative group flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">EXPLORE GALLERY</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="relative">
                {/* Play Button */}
                <motion.div
                  className="absolute top-8 right-8 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-6 h-6 text-white ml-1" />
                </motion.div>
                
                {/* Content Card */}
                <motion.div 
                  className="bg-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50"
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <motion.h2 
                    className="text-3xl font-bold mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    CodeNest Platform.
                  </motion.h2>
                  <motion.p 
                    className="text-gray-300 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                  >
                    The ultimate online code editor supporting 40+ programming languages. 
                    Write, execute, and share code snippets instantly. Create multi-file projects, 
                    collaborate with developers worldwide, and showcase your work in our community gallery.
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <div className="w-8 h-12 border border-gray-600 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}