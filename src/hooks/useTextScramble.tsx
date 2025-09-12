"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

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
    characters = '!<>-_\\/[]{}—=+*^?#________',
    revealDelay = 1000
  } = options;

  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const [hasScrambled, setHasScrambled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const frameRequest = useRef<number | null>(null);

  const scramble = useCallback(() => {
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
  }, [isScrambling, hasScrambled, text, characters, revealDelay]);

  const startScramble = useCallback(() => {
    if (!hasScrambled) {
      scramble();
    }
  }, [hasScrambled, scramble]);

  useEffect(() => {
    setDisplayText(text);
    
    // Auto-start scramble after delay (only once)
    if (!hasScrambled) {
      scramble();
    }

    return () => {
      const currentInterval = intervalRef.current;
      const currentTimeout = timeoutRef.current;
      const currentFrame = frameRequest.current;
      
      if (currentInterval) {
        clearInterval(currentInterval);
      }
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      if (currentFrame) {
        cancelAnimationFrame(currentFrame);
      }
    };
  }, [text, hasScrambled, scramble]);

  return { displayText, scramble: startScramble, isScrambling, hasScrambled };
};
