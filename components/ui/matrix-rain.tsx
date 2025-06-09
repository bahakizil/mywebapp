"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Drop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number;
}

export function MatrixRain({ 
  width = 800, 
  height = 600, 
  className = "",
  intensity = 0.5 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const dropsRef = useRef<Drop[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // AI/ML related characters and symbols
    const aiChars = [
      // Python/ML syntax
      'import', 'numpy', 'torch', 'tf', 'sklearn', 'cv2', 'plt',
      // Mathematical symbols
      '∑', '∂', '∇', '∫', '∞', 'α', 'β', 'γ', 'θ', 'λ', 'μ', 'σ',
      // Numbers and operators
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      '+', '-', '*', '/', '=', '<', '>', '!', '?',
      // AI keywords
      'AI', 'ML', 'CNN', 'RNN', 'GAN', 'LLM', 'GPU', 'API',
      // Brackets and punctuation
      '(', ')', '[', ']', '{', '}', '.', ',', ';', ':',
      // Special characters
      '@', '#', '$', '%', '^', '&', '|', '~', '`'
    ];

    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    
    // Initialize drops
    const drops: Drop[] = [];
    for (let i = 0; i < columns * intensity; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 3 + 1,
        chars: Array(20).fill(0).map(() => 
          aiChars[Math.floor(Math.random() * aiChars.length)]
        ),
        opacity: Math.random() * 0.8 + 0.2
      });
    }

    dropsRef.current = drops;

    const animate = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px 'Fira Code', 'Monaco', 'Menlo', monospace`;

      drops.forEach(drop => {
        // Update position
        drop.y += drop.speed;
        
        // Reset if off screen
        if (drop.y > height + 100) {
          drop.y = -100;
          drop.x = Math.random() * width;
          drop.speed = Math.random() * 3 + 1;
          drop.opacity = Math.random() * 0.8 + 0.2;
          // Refresh characters
          drop.chars = Array(20).fill(0).map(() => 
            aiChars[Math.floor(Math.random() * aiChars.length)]
          );
        }

        // Draw character trail
        drop.chars.forEach((char, index) => {
          const charY = drop.y - (index * fontSize);
          if (charY > 0 && charY < height) {
            const alpha = drop.opacity * (1 - index / drop.chars.length);
            
            // Highlight the leading character in bright green
            if (index === 0) {
              ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
              ctx.shadowBlur = 10;
              ctx.shadowColor = '#00ff41';
            } else {
              ctx.fillStyle = `rgba(0, 255, 65, ${alpha * 0.6})`;
              ctx.shadowBlur = 0;
            }
            
            ctx.fillText(char, drop.x, charY);
            ctx.shadowBlur = 0;
          }
        });

        // Occasionally change characters for dynamic effect
        if (Math.random() < 0.01) {
          const randomIndex = Math.floor(Math.random() * drop.chars.length);
          drop.chars[randomIndex] = aiChars[Math.floor(Math.random() * aiChars.length)];
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, intensity]);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          maxWidth: width, 
          maxHeight: height,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)'
        }}
      />
    </motion.div>
  );
} 