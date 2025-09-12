"use client";

import { motion } from 'framer-motion';
import { useTextScramble } from '@/hooks/useTextScramble';
import { useEffect, useRef } from 'react';

interface ScrambleTextProps {
  children: string;
  className?: string;
  delay?: number;
  scrambleSpeed?: number;
  triggerOnHover?: boolean;
  triggerOnView?: boolean;
}

export default function ScrambleText({ 
  children, 
  className = '', 
  delay = 0,
  scrambleSpeed = 50,
  triggerOnHover = false,
  triggerOnView = false
}: ScrambleTextProps) {
  const { displayText, scramble } = useTextScramble(children, {
    scrambleSpeed,
    revealDelay: delay
  });
  
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (triggerOnView && elementRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => scramble(), delay);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(elementRef.current);

      return () => observer.disconnect();
    }
  }, [triggerOnView, delay, scramble]);

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      scramble();
    }
  };

  return (
    <motion.span
      ref={elementRef}
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ fontFamily: 'monospace' }}
    >
      {displayText}
    </motion.span>
  );
}
