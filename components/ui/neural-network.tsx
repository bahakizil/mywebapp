"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Node {
  x: number;
  y: number;
  layer: number;
  id: string;
  active: boolean;
}

interface Connection {
  from: Node;
  to: Node;
  weight: number;
  active: boolean;
}

export function NeuralNetwork({ width = 400, height = 300, className = "" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create neural network structure
    const layers = [4, 6, 6, 3]; // Input, Hidden1, Hidden2, Output
    const nodes: Node[] = [];
    const connections: Connection[] = [];

    // Create nodes
    layers.forEach((nodeCount, layerIndex) => {
      const layerX = (width / (layers.length - 1)) * layerIndex;
      
      for (let i = 0; i < nodeCount; i++) {
        const nodeY = (height / (nodeCount + 1)) * (i + 1);
        nodes.push({
          x: layerX,
          y: nodeY,
          layer: layerIndex,
          id: `${layerIndex}-${i}`,
          active: false
        });
      }
    });

    // Create connections
    for (let i = 0; i < layers.length - 1; i++) {
      const currentLayerNodes = nodes.filter(n => n.layer === i);
      const nextLayerNodes = nodes.filter(n => n.layer === i + 1);

      currentLayerNodes.forEach(fromNode => {
        nextLayerNodes.forEach(toNode => {
          connections.push({
            from: fromNode,
            to: toNode,
            weight: Math.random() * 2 - 1, // Random weight between -1 and 1
            active: false
          });
        });
      });
    }

    nodesRef.current = nodes;
    connectionsRef.current = connections;

    let animationTime = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      animationTime += 0.02;

      // Animate forward propagation
      const propagationWave = (Math.sin(animationTime) + 1) / 2;
      const currentLayer = Math.floor(propagationWave * layers.length);

      // Update node activation
      nodes.forEach(node => {
        if (node.layer <= currentLayer) {
          node.active = Math.sin(animationTime + node.layer * 0.5) > 0;
        } else {
          node.active = false;
        }
      });

      // Update connection activation
      connections.forEach(conn => {
        if (conn.from.layer < currentLayer || 
            (conn.from.layer === currentLayer && conn.from.active)) {
          conn.active = true;
        } else {
          conn.active = false;
        }
      });

      // Draw connections
      connections.forEach(conn => {
        const alpha = conn.active ? 0.8 : 0.2;
        const strokeWidth = conn.active ? 2 : 1;
        
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        
        // Color based on weight
        if (conn.weight > 0) {
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`; // Blue for positive
        } else {
          ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`; // Red for negative
        }
        
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.active ? 8 : 6, 0, Math.PI * 2);
        
        if (node.active) {
          ctx.fillStyle = "#10b981"; // Green for active
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#10b981";
        } else {
          ctx.fillStyle = "#6b7280"; // Gray for inactive
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height]);

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: width, maxHeight: height }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg pointer-events-none" />
    </motion.div>
  );
} 