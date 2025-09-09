"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Code, 
  Play, 
  Share, 
  Users, 
  Zap, 
  FileText, 
  Globe, 
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Multi-Language Support",
      description: "Code in JavaScript, Python, Java, C++, Go, Rust and more with syntax highlighting"
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "Instant Execution",
      description: "Run your code instantly and see results in real-time with our powerful execution engine"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Multi-File Projects",
      description: "Create complex projects with multiple files, organize code like a pro"
    },
    {
      icon: <Share className="w-6 h-6" />,
      title: "Share & Collaborate",
      description: "Share your code snippets with the community and get feedback from other developers"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Explore thousands of code snippets shared by developers worldwide"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Public & Private",
      description: "Keep your projects private or make them public for the community to see"
    }
  ];

  const languages = [
    { name: "JavaScript", logo: "/javascript.png" },
    { name: "TypeScript", logo: "/typescript.png" },
    { name: "Python", logo: "/python.png" },
    { name: "Java", logo: "/java.png" },
    { name: "C++", logo: "/cpp.png" },
    { name: "Go", logo: "/go.png" },
    { name: "Rust", logo: "/rust.png" },
    { name: "Ruby", logo: "/ruby.png" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="CodeNest Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CodeNest
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium transition-all transform hover:scale-105">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Code. Run. Share.
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                All in One Place.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              The ultimate online code editor for developers. Write, execute, and share code snippets 
              across multiple programming languages with our powerful cloud-based platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignUpButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold text-lg flex items-center gap-2 shadow-2xl"
                >
                  Start Coding Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </SignUpButton>
              <SignInButton mode="modal">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-gray-600 hover:border-gray-500 rounded-xl font-semibold text-lg transition-colors"
                >
                  Sign In
                </motion.button>
              </SignInButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Language Support */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Code in Your Favorite Language
            </h2>
            <p className="text-gray-400 text-lg">
              Support for all major programming languages with syntax highlighting and execution
            </p>
          </motion.div>
          
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {languages.map((lang, index) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
              >
                <Image
                  src={lang.logo}
                  alt={lang.name}
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">{lang.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Code
            </h2>
            <p className="text-gray-400 text-lg">
              Powerful features designed for modern developers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-purple-500/30 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Coding?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers already using CodeNest to write, run, and share code.
            </p>
            <SignUpButton mode="modal">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold text-lg flex items-center gap-2 mx-auto shadow-2xl"
              >
                <Zap className="w-5 h-5" />
                Get Started Free
              </motion.button>
            </SignUpButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="CodeNest Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              CodeNest
            </span>
          </div>
          <p className="text-gray-400">
            © 2025 CodeNest. Empowering developers worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}
