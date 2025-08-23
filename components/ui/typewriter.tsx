"use client";

import { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export function Typewriter({ 
  texts, 
  speed = 100, 
  deleteSpeed = 50, 
  pauseTime = 2000,
  className = "" 
}: TypewriterProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (texts.length === 0 || !mountedRef.current || !isClient) return;
    
    const targetText = texts[currentTextIndex];
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isDeleting) {
      if (currentText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setCurrentText(prev => prev.slice(0, -1));
          }
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      if (currentText.length < targetText.length) {
        timeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setCurrentText(targetText.substring(0, currentText.length + 1));
          }
        }, speed);
      } else if (currentText.length === targetText.length) {
        timeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setIsDeleting(true);
          }
        }, pauseTime);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentText, currentTextIndex, isDeleting, texts, speed, deleteSpeed, pauseTime, isClient]);

  if (!isClient) {
    return (
      <span className={className}>
        {texts[0] || ''}
        <span className="text-primary animate-pulse">|</span>
      </span>
    );
  }

  return (
    <span className={className}>
      {currentText}
      <span className="text-primary animate-pulse">|</span>
    </span>
  );
} 