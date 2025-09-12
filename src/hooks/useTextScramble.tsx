"use client";

import { useState, useEffect, useRef } from 'react';

interface UseTextScrambleOptions {
  scrambleSpeed?: number;
  characters?: string;
  revealDelay?: number;
}

export const useTextScramble = (
  text: string,
  options: UseTextScrambleOptions = {}
) => {
  const {
    scrambleSpeed = 50,
    characters = '!<>-_\\/[]{}—=+*^?#________',
    revealDelay = 1000
  } = options;

  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const [hasScrambled, setHasScrambled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const frameRequest = useRef<number | null>(null);

  const scramble = () => {
    if (isScrambling || hasScrambled) return;
    
    setIsScrambling(true);
    setHasScrambled(true);
    
    const textArray = text.split('');
    let frame = 0;
    
    const animate = () => {
      setDisplayText(
        textArray
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (frame > index * 3) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (frame >= textArray.length * 3) {
        setIsScrambling(false);
        setDisplayText(text);
        return;
      }

      frame++;
      frameRequest.current = requestAnimationFrame(animate);
    };

    timeoutRef.current = setTimeout(() => {
      animate();
    }, revealDelay);
  };

  const startScramble = () => {
    if (!hasScrambled) {
      scramble();
    }
  };

  useEffect(() => {
    setDisplayText(text);
    
    // Auto-start scramble after delay (only once)
    if (!hasScrambled) {
      scramble();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (frameRequest.current) {
        cancelAnimationFrame(frameRequest.current);
      }
    };
  }, [text]);

  return { displayText, scramble: startScramble, isScrambling, hasScrambled };
};
