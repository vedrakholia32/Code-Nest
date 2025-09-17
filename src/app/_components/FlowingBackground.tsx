"use client";

import { motion } from "framer-motion";

interface FlowingBackgroundProps {
  variant?: "primary" | "secondary" | "minimal";
  className?: string;
}

export default function FlowingBackground({ variant = "primary", className = "" }: FlowingBackgroundProps) {
  const renderPrimaryBackground = () => (
    <>
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
    </>
  );

  const renderSecondaryBackground = () => (
    <>
      {/* Left side flowing shape */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[500px]"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <svg viewBox="0 0 600 500" className="w-full h-full">
          <defs>
            <linearGradient id="flowGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.path
              key={i}
              d={`M${50 + i * 25},${100 + i * 20} C${150 + i * 30},${80 + i * 15} ${250 + i * 25},${120 + i * 25} ${350 + i * 20},${100 + i * 18} C${450 + i * 15},${80 + i * 12} ${430 + i * 18},${200 + i * 20} ${330 + i * 25},${220 + i * 15} C${230 + i * 20},${240 + i * 12} ${130 + i * 15},${220 + i * 10} ${50 + i * 25},${100 + i * 20} Z`}
              fill="none"
              stroke={`rgba(${139 - i * 10}, ${92 + i * 15}, ${246 - i * 20}, ${0.1 + i * 0.02})`}
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.8 + i * 0.2, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Bottom right accent */}
      <motion.div
        className="absolute bottom-0 right-0 w-[400px] h-[300px]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
      >
        <svg viewBox="0 0 400 300" className="w-full h-full">
          <defs>
            <linearGradient id="flowGradientBottomRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.path
              key={i}
              d={`M${200 + i * 30},${50 + i * 25} C${300 + i * 20},${40 + i * 20} ${350 + i * 15},${100 + i * 30} ${320 + i * 25},${150 + i * 20} C${290 + i * 20},${200 + i * 15} ${220 + i * 15},${180 + i * 25} ${200 + i * 30},${50 + i * 25} Z`}
              fill="none"
              stroke={`rgba(${236 - i * 20}, ${72 + i * 30}, ${153 - i * 15}, ${0.08 + i * 0.02})`}
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2 + i * 0.3, delay: 1.2 + i * 0.2, ease: "easeInOut" }}
            />
          ))}
        </svg>
      </motion.div>
    </>
  );

  const renderMinimalBackground = () => (
    <motion.div
      className="absolute top-1/3 right-1/4 w-[400px] h-[300px]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <linearGradient id="flowGradientMinimal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M${100 + i * 40},${50 + i * 30} C${200 + i * 35},${40 + i * 25} ${300 + i * 20},${80 + i * 35} ${280 + i * 30},${140 + i * 25} C${250 + i * 25},${180 + i * 20} ${170 + i * 20},${160 + i * 30} ${100 + i * 40},${50 + i * 30} Z`}
            fill="none"
            stroke={`rgba(${99 + i * 20}, ${102 + i * 25}, ${241 - i * 10}, ${0.06 + i * 0.02})`}
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2 + i * 0.2, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </motion.div>
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {variant === "primary" && renderPrimaryBackground()}
      {variant === "secondary" && renderSecondaryBackground()}
      {variant === "minimal" && renderMinimalBackground()}
    </div>
  );
}