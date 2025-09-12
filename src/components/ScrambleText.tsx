"use client";

import { motion } from 'framer-motion';
import { useTextScramble } from '@/hooks/useTextScramble';
import { useEffect, useRef } from 'react';

interface ScrambleTextProps {
  children: string;
  className?: string;
  delay?: number;
  scrambleSpeed?: number;
  autoStart?: boolean;
}

export default function ScrambleText({ 
  children, 
  className = '', 
  delay = 1000,
  scrambleSpeed = 50,
  autoStart = true
}: ScrambleTextProps) {
  const { displayText, hasScrambled } = useTextScramble(children, {
    scrambleSpeed,
    revealDelay: autoStart ? delay : 999999 // Don't auto-start if autoStart is false
  });

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ fontFamily: 'monospace' }}
    >
      {displayText}
    </motion.span>
  );
}
