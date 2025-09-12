"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Code, 
  Play, 
  Share, 
  Users, 
  Zap, 
  FileText, 
  Globe, 
  ArrowRight,
  Sparkles,
  Star
} from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  
  const [typedText, setTypedText] = useState("");
  const fullText = "Code. Run. Share.";
  
  useEffect(() => {
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  // Floating particles animation data
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [-10, -100, -10],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/20 relative z-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Image
                  src="/logo.png"
                  alt="CodeNest Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
              </motion.div>
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  CodeNest
                </span>
              </h1>
            </motion.div>
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <motion.button 
                  className="px-4 py-2 text-secondary hover:text-primary transition-all duration-300 relative group cursor-pointer hover-glow font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Sign In</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  />
                </motion.button>
              </SignInButton>
              <SignUpButton mode="modal">
                <motion.button 
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold relative overflow-hidden group cursor-pointer hover-magnetic hover-gradient-shift"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10">Get Started</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            style={{ y: y1, opacity }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Animated Title with Typing Effect */}
            <div className="relative mb-6">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="inline-block">
                  <span className="text-primary font-bold">
                    {typedText}
                  </span>
                  <motion.span
                    className="inline-block w-1 h-16 bg-purple-400 ml-2"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </span>
                <motion.span 
                  className="block text-gradient font-bold animate-gradient-shift leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.8 }}
                >
                  All in One Place.
                </motion.span>
              </motion.h1>
              
              {/* Floating Icons Around Title */}
              <motion.div
                className="absolute -top-10 -left-10 text-purple-400"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <Code className="w-8 h-8" />
              </motion.div>
              <motion.div
                className="absolute -top-5 -right-5 text-blue-400"
                animate={{
                  y: [0, -15, 0],
                  rotate: [360, 180, 0],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <motion.div
                className="absolute bottom-0 left-1/4 text-pink-400"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star className="w-5 h-5" />
              </motion.div>
            </div>

            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.8 }}
            >
              The ultimate online code editor for developers. Write, execute, and share code snippets across multiple programming languages with our powerful cloud-based platform.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
            >
              <SignUpButton mode="modal">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg flex items-center gap-2 relative overflow-hidden group cursor-pointer hover-magnetic hover-glow animate-pulse-glow"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 25px 50px rgba(139, 92, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10 flex items-center gap-2 font-weight-semibold">
                    Start Coding Now
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                </motion.button>
              </SignUpButton>
              <SignInButton mode="modal">
                <motion.button
                  className="px-8 py-4 border border-gray-600 hover:border-gray-500 rounded-xl font-semibold text-lg relative overflow-hidden group cursor-pointer hover-border-draw text-secondary hover:text-primary"
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: "rgba(139, 92, 246, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10">Sign In</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </SignInButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Language Support */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold mb-4 leading-tight tracking-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-gradient">Code in Your Favorite Language</span>
            </motion.h2>
            <motion.p 
              className="text-secondary text-lg leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Support for all major programming languages with syntax highlighting and execution
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {languages.map((lang, index) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, y: 50, rotateY: -90 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.1, 
                  rotateY: 10,
                  boxShadow: "0 10px 30px rgba(139, 92, 246, 0.2)",
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-secondary/30 hover:bg-surface-secondary/50 transition-all cursor-pointer group card-hover hover-lift border border-default/20"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src={lang.logo}
                    alt={lang.name}
                    width={32}
                    height={32}
                    className="rounded group-hover:drop-shadow-lg"
                  />
                </motion.div>
                <span className="text-sm text-secondary group-hover:text-primary transition-colors font-medium">
                  {lang.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold mb-4 leading-tight tracking-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-gradient">Everything You Need to Code</span>
            </motion.h2>
            <motion.p 
              className="text-secondary text-lg leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Powerful features designed for modern developers
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(139, 92, 246, 0.15)",
                }}
                className="p-6 rounded-2xl bg-gradient-to-br from-surface-secondary/50 to-surface-primary/50 border border-default/50 hover:border-purple-500/30 transition-all group cursor-pointer relative overflow-hidden card-hover hover-lift"
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 relative z-10"
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: 360,
                    boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)",
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="text-xl font-semibold mb-2 relative z-10 group-hover:text-purple-300 transition-colors leading-snug tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-secondary leading-relaxed relative z-10 group-hover:text-primary transition-colors">
                  {feature.description}
                </p>
                
                {/* Animated corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-2xl"
                  initial={{ scale: 0, rotate: -45 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Animated background elements */}
            <motion.div
              className="absolute -inset-10 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl blur-2xl"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <div className="relative z-10">
              <motion.h2 
                className="text-3xl md:text-4xl font-weight-bold mb-6 text-primary"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Ready to Start Coding?
              </motion.h2>
              <motion.p 
                className="text-xl text-secondary mb-8 line-height-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Join thousands of developers already using CodeNest to write, run, and share code.
              </motion.p>
              <SignUpButton mode="modal">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-lg flex items-center gap-2 mx-auto relative overflow-hidden group cursor-pointer hover-magnetic hover-glow animate-pulse-glow"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 30px 60px rgba(139, 92, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2 font-weight-semibold">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    Get Started Free
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                </motion.button>
              </SignUpButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="border-t border-gray-800/50 py-8 px-4 sm:px-6 lg:px-8 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            className="flex items-center justify-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Image
                src="/logo.png"
                alt="CodeNest Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </motion.div>
            <motion.span 
              className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              CodeNest
            </motion.span>
          </motion.div>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            © 2025 CodeNest. Empowering developers worldwide.
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
}
