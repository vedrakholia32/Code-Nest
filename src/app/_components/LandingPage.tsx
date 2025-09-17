"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Play, 
  Search
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function LandingPage() {
  // Fetch real-time stats from database
  const snippets = useQuery(api.snippets.getSnippets);
  const totalExecutions = useQuery(api.codeExecutions.getTotalExecutions);
  
  // Calculate stats
  const snippetCount = snippets?.length || 0;
  const executionCount = totalExecutions || 0;
  const languageCount = snippets ? new Set(snippets.map(s => s.language)).size : 0;
  const developerCount = snippets ? new Set(snippets.map(s => s.userName)).size : 0;

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

      {/* Simple Header */}
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
                src="/Code-Nest-new.png"
                alt="CodeNest"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold">CodeNest</span>
            </motion.div>
            
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
      <div className="relative z-10 px-6 -mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
            {/* Left Content */}
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.h1 
                className="text-5xl md:text-5xl lg:text-7xl font-bold leading-none mb-8"
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
                  className="absolute top-5 right-8 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-6 h-6 text-white ml-1" />
                </motion.div>
                
                {/* Content Card */}
                <motion.div 
                  className="bg-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 transform -translate-y-10"
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

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why Choose CodeNest?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to code, collaborate, and create amazing projects
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "40+ Languages",
                description: "Support for Python, JavaScript, Java, C++, and many more programming languages",
                icon: "🚀"
              },
              {
                title: "Real-time Execution",
                description: "Run your code instantly in the browser with our powerful execution engine",
                icon: "⚡"
              },
              {
                title: "Share & Collaborate",
                description: "Share code snippets with the community and collaborate on projects",
                icon: "🤝"
              },
              {
                title: "Project Management",
                description: "Organize your code into projects and manage multiple files effortlessly",
                icon: "📁"
              },
              {
                title: "Code Gallery",
                description: "Explore thousands of code snippets shared by developers worldwide",
                icon: "🎨"
              },
              {
                title: "Modern IDE",
                description: "Professional code editor with syntax highlighting and autocomplete",
                icon: "💻"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Gallery Preview */}
      <section className="relative z-10 py-20 px-6 bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Code Gallery
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover amazing code snippets created by our community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Fibonacci Sequence",
                language: "Python",
                author: "PythonMaster",
                likes: 245,
                code: "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nfor i in range(10):\n    print(fibonacci(i))"
              },
              {
                title: "Binary Search Algorithm",
                language: "JavaScript",
                author: "AlgoExpert",
                likes: 189,
                code: "function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    arr[mid] < target ? left = mid + 1 : right = mid - 1;\n  }\n  return -1;\n}"
              },
              {
                title: "Quick Sort Algorithm",
                language: "C++",
                author: "AlgoMaster",
                likes: 312,
                code: "void quickSort(int arr[], int low, int high) {\n  if (low < high) {\n    int pi = partition(arr, low, high);\n    quickSort(arr, low, pi - 1);\n  }\n}"
              }
            ].map((snippet, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-4 border-b border-gray-700/50">
                  <h3 className="font-semibold text-white mb-2">{snippet.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{snippet.language}</span>
                    <span>by {snippet.author}</span>
                    <span>❤️ {snippet.likes}</span>
                  </div>
                </div>
                <div className="p-4 bg-black/20">
                  <pre className="text-sm text-gray-300 font-mono overflow-hidden">
                    {snippet.code}
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              href="/snippets"
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300"
            >
              Explore Full Gallery →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: snippetCount > 0 ? `${snippetCount}+` : "0", label: "Code Snippets" },
              { number: languageCount > 0 ? `${languageCount}+` : "0", label: "Languages" },
              { number: developerCount > 0 ? `${developerCount}+` : "0", label: "Developers" },
              { number: executionCount > 0 ? `${executionCount}+` : "0", label: "Executions" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/30 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Start Coding?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust CodeNest for their coding projects
            </p>
            <SignUpButton mode="modal">
              <motion.button
                className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started for Free
              </motion.button>
            </SignUpButton>
          </motion.div>
        </div>
      </section>

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