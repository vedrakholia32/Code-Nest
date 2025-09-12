"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  scrambleDuration?: number;
  scrambleChars?: string;
}

export default function TextScramble({ 
  text, 
  className = '', 
  delay = 1000,
  scrambleDuration = 2000,
  scrambleChars = '!<>-_\\/[]{}—=+*^?#________'
}: TextScrambleProps) {
  // Start with scrambled text instead of normal text
  const getInitialScrambledText = useCallback(() => {
    return text.split('').map(char => 
      char === ' ' ? ' ' : scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
    ).join('');
  }, [text, scrambleChars]);

  const [displayText, setDisplayText] = useState(getInitialScrambledText);
  const [isScrambling, setIsScrambling] = useState(true); // Start as scrambling
  const animationRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    
    const startScramble = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      
      const originalText = text;
      const textLength = originalText.length;
      let frame = 0;
      const totalFrames = Math.floor(scrambleDuration / 16); // ~60fps
      
      const animate = () => {
        const progress = frame / totalFrames;
        const revealedChars = Math.floor(progress * textLength);
        
        let scrambledText = '';
        
        for (let i = 0; i < textLength; i++) {
          if (originalText[i] === ' ') {
            scrambledText += ' ';
          } else if (i < revealedChars) {
            scrambledText += originalText[i];
          } else {
            // Add some randomness to when characters get revealed
            const randomFactor = Math.random();
            if (randomFactor < progress * 0.1) {
              scrambledText += originalText[i];
            } else {
              scrambledText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }
          }
        }
        
        setDisplayText(scrambledText);
        
        if (frame < totalFrames) {
          frame++;
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayText(originalText);
          setIsScrambling(false);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const timer = setTimeout(startScramble, delay);
    
    // Also keep scrambling the initial text before the main animation starts
    const preAnimationInterval = setInterval(() => {
      if (!hasAnimated.current) {
        setDisplayText(getInitialScrambledText());
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      clearInterval(preAnimationInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [text, delay, scrambleDuration, scrambleChars, getInitialScrambledText]);

  return (
    <motion.span 
      className={`font-mono ${className}`}
      style={{ 
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: isScrambling ? '0.05em' : 'normal',
      }}
      animate={{
        textShadow: isScrambling 
          ? ['0 0 0px #8b5cf6', '0 0 10px #8b5cf6', '0 0 0px #8b5cf6']
          : '0 0 0px transparent'
      }}
      transition={{ 
        textShadow: { 
          duration: 0.5, 
          repeat: isScrambling ? Infinity : 0,
          repeatType: 'reverse'
        }
      }}
    >
      {displayText}
    </motion.span>
  );
}
