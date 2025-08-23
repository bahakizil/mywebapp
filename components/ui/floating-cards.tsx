"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Code, Zap, Database, Eye, Cpu } from 'lucide-react';

const skillCards = [
  { icon: Brain, label: 'AI/ML', x: '8%', y: '15%', delay: 0, amplitude: 15 },
  { icon: Eye, label: 'Computer Vision', x: '82%', y: '12%', delay: 1.2, amplitude: 18 },
  { icon: Code, label: 'Deep Learning', x: '12%', y: '75%', delay: 2.1, amplitude: 12 },
  { icon: Zap, label: 'LLMs', x: '87%', y: '68%', delay: 0.7, amplitude: 20 },
  { icon: Database, label: 'MLOps', x: '72%', y: '42%', delay: 1.8, amplitude: 16 },
  { icon: Cpu, label: 'Neural Networks', x: '22%', y: '48%', delay: 2.6, amplitude: 14 },
];

export function FloatingCards() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {skillCards.map((card, index) => (
        <motion.div
          key={card.label}
          className="absolute bg-card/8 backdrop-blur-sm border border-primary/8 rounded-xl p-3 shadow-lg will-change-transform"
          style={{
            left: card.x,
            top: card.y,
          }}
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ 
            opacity: [0.4, 0.8, 0.4],
            scale: [0.9, 1.05, 0.9],
            y: [0, -card.amplitude, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4, // 8-12 seconds
            repeat: Infinity,
            ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic bezier for smoothness
            delay: card.delay,
            times: [0, 0.5, 1], // Control timing of keyframes
          }}
        >
          <motion.div 
            className="flex items-center gap-2"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: card.delay + 1,
            }}
          >
            <card.icon className="h-4 w-4 text-primary/80" />
            <span className="text-xs font-medium text-foreground/60">
              {card.label}
            </span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
} 