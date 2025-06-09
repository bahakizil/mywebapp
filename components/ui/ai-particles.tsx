"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  type: 'data' | 'node' | 'spark';
  color: string;
  connections: number[];
}

interface AIParticlesProps {
  particleCount?: number;
  connectionDistance?: number;
  className?: string;
  theme?: 'neural' | 'data' | 'cyber';
}

export function AIParticles({ 
  particleCount = 80,
  connectionDistance = 120,
  className = "",
  theme = 'neural'
}: AIParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  const themes = {
    neural: {
      colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
      background: 'rgba(0, 0, 0, 0.02)',
      connectionColor: 'rgba(59, 130, 246, 0.3)',
      nodeGlow: true
    },
    data: {
      colors: ['#f59e0b', '#ef4444', '#10b981', '#06b6d4'],
      background: 'rgba(0, 0, 0, 0.03)',
      connectionColor: 'rgba(245, 158, 11, 0.2)',
      nodeGlow: false
    },
    cyber: {
      colors: ['#00ff41', '#00ffff', '#ff0080', '#ffff00'],
      background: 'rgba(0, 0, 0, 0.05)',
      connectionColor: 'rgba(0, 255, 65, 0.4)',
      nodeGlow: true
    }
  };

  const currentTheme = themes[theme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const particleType = Math.random() < 0.7 ? 'data' : Math.random() < 0.9 ? 'node' : 'spark';
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: particleType === 'spark' ? Math.random() * 2 + 1 : Math.random() * 4 + 2,
        opacity: Math.random() * 0.8 + 0.2,
        type: particleType,
        color: currentTheme.colors[Math.floor(Math.random() * currentTheme.colors.length)],
        connections: []
      });
    }

    particlesRef.current = particles;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.fillStyle = currentTheme.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      // Update particles
      particles.forEach((particle, i) => {
        // Mouse interaction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx += (dx / distance) * force * 0.002;
          particle.vy += (dy / distance) * force * 0.002;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check with smooth wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Add some random movement for data particles
        if (particle.type === 'data') {
          particle.vx += (Math.random() - 0.5) * 0.01;
          particle.vy += (Math.random() - 0.5) * 0.01;
        }

        // Sparks have different behavior
        if (particle.type === 'spark') {
          particle.opacity *= 0.995;
          if (particle.opacity < 0.1) {
            particle.opacity = 1;
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
          }
        }

        // Velocity damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Find connections
        particle.connections = [];
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            particle.connections.push(j);
          }
        }
      });

      // Draw connections
      particles.forEach((particle, i) => {
        particle.connections.forEach(connectionIndex => {
          const other = particles[connectionIndex];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const opacity = (1 - distance / connectionDistance) * 0.5;

          ctx.strokeStyle = currentTheme.connectionColor.replace('0.3', opacity.toString());
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();

          // Add data flow animation along connections
          if (Math.random() < 0.02) {
            const progress = Math.random();
            const flowX = particle.x + (other.x - particle.x) * progress;
            const flowY = particle.y + (other.y - particle.y) * progress;
            
            ctx.beginPath();
            ctx.arc(flowX, flowY, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = opacity * 2;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        });
      });

      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

        if (currentTheme.nodeGlow && particle.type === 'node') {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.globalAlpha = particle.opacity * 0.3;
          ctx.fill();
        }

        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Add pulse effect for nodes
        if (particle.type === 'node' && Math.random() < 0.005) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.3;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, connectionDistance, theme]);

  return (
    <motion.div
      className={`fixed inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{ zIndex: -1 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'transparent',
          mixBlendMode: theme === 'cyber' ? 'screen' : 'normal'
        }}
      />
    </motion.div>
  );
} 