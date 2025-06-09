"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Play, Pause, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function InteractiveNeuralNetwork() {
  const [neurons, setNeurons] = useState([8]);
  const [layers, setLayers] = useState([4]);
  const [activation, setActivation] = useState([0.75]);
  const [learningRate, setLearningRate] = useState([0.05]);
  const [isActive, setIsActive] = useState(false);
  const [activationPulse, setActivationPulse] = useState<number[]>([]);
  const [connectionPulses, setConnectionPulses] = useState<Map<string, number>>(new Map());

  const toggleActivation = () => {
    setIsActive(!isActive);
    if (!isActive) {
      // Generate sophisticated activation pattern
      const pattern = Array.from({ length: neurons[0] * layers[0] }, () => 
        Math.random() * activation[0] + (1 - activation[0]) * 0.2
      );
      setActivationPulse(pattern);
      
      // Generate connection pulses
      const pulses = new Map<string, number>();
      for (let i = 0; i < layers[0] - 1; i++) {
        for (let j = 0; j < neurons[0]; j++) {
          for (let k = 0; k < neurons[0]; k++) {
            const key = `${i}-${j}-${k}`;
            pulses.set(key, Math.random() * activation[0]);
          }
        }
      }
      setConnectionPulses(pulses);
      
      // Reset after sophisticated animation cycle
      setTimeout(() => {
        setIsActive(false);
        setActivationPulse([]);
        setConnectionPulses(new Map());
      }, 3000);
    }
  };

  const renderNeuralLayer = (layerIndex: number, neuronCount: number, x: number) => {
    const spacing = 280 / (neuronCount + 1);
    const elements = [];
    
    for (let i = 0; i < neuronCount; i++) {
      const y = 90 + (i + 1) * spacing;
      const neuronId = layerIndex * 10 + i;
      const pulseIntensity = activationPulse[neuronId] || 0;
      const glowIntensity = isActive ? pulseIntensity : 0;
      
      // Professional neon glow effects
      if (glowIntensity > 0.1) {
        elements.push(
          <g key={`glow-${neuronId}`}>
            {/* Outer slate aura */}
            <motion.circle
              cx={x}
              cy={y}
              r="35"
              fill="none"
              stroke="#64748b"
              strokeWidth="1"
              opacity={glowIntensity * 0.4}
              animate={{
                r: [35, 45, 35],
                opacity: [glowIntensity * 0.4, glowIntensity * 0.6, glowIntensity * 0.4]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                filter: 'drop-shadow(0 0 20px #64748b) blur(0.5px)',
              }}
            />
            
            {/* Middle slate ring */}
            <motion.circle
              cx={x}
              cy={y}
              r="28"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              opacity={glowIntensity * 0.7}
              animate={{
                strokeWidth: [2, 4, 2],
                opacity: [glowIntensity * 0.7, glowIntensity * 0.9, glowIntensity * 0.7]
              }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              style={{
                filter: 'drop-shadow(0 0 15px #94a3b8)',
              }}
            />
            
            {/* Inner core glow */}
            <motion.circle
              cx={x}
              cy={y}
              r="22"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="3"
              opacity={glowIntensity * 0.8}
              animate={{
                r: [22, 25, 22],
                strokeWidth: [3, 5, 3]
              }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              style={{
                filter: 'drop-shadow(0 0 12px #cbd5e1)',
              }}
            />
          </g>
        );
      }
      
      // Professional 3D neuron design
      elements.push(
        <g key={`neuron-${neuronId}`}>
          {/* 3D shadow */}
          <ellipse
            cx={x + 3}
            cy={y + 3}
            rx="18"
            ry="16"
            fill="rgba(0, 0, 0, 0.4)"
            opacity="0.6"
          />
          
          {/* Main neuron body with professional gradient */}
          <motion.circle
            cx={x}
            cy={y}
            r="18"
            fill={`url(#professionalGradient-${neuronId})`}
            stroke={glowIntensity > 0.2 ? "#94a3b8" : "#64748b"}
            strokeWidth={glowIntensity > 0.2 ? "3" : "2"}
            animate={glowIntensity > 0.2 ? {
              r: [18, 20, 18],
              strokeWidth: [3, 4, 3]
            } : {}}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              filter: glowIntensity > 0.2 
                ? 'drop-shadow(0 0 20px #94a3b8) drop-shadow(0 0 40px #64748b)' 
                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            }}
          />
          
          {/* Professional highlight */}
          <ellipse
            cx={x - 5}
            cy={y - 5}
            rx="4"
            ry="6"
            fill="rgba(255, 255, 255, 0.8)"
            opacity={glowIntensity > 0.2 ? "0.9" : "0.4"}
          />
          
          {/* Active core with professional pulsing */}
          {glowIntensity > 0.4 && (
            <motion.circle
              cx={x}
              cy={y}
              r="8"
              fill="#ffffff"
              opacity="0.9"
              animate={{
                r: [8, 12, 8],
                opacity: [0.9, 0.6, 0.9]
              }}
              transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                filter: 'drop-shadow(0 0 8px #ffffff)',
              }}
            />
          )}
          
          {/* Ultra-active burst effect */}
          {glowIntensity > 0.7 && (
            <motion.g>
              <motion.circle
                cx={x}
                cy={y}
                r="25"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1"
                opacity="0.6"
                animate={{
                  r: [25, 35, 25],
                  opacity: [0.6, 0, 0.6]
                }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.g>
          )}
          
          {/* Professional gradient definitions */}
          <defs>
            <radialGradient id={`professionalGradient-${neuronId}`} cx="30%" cy="30%">
              <stop offset="0%" stopColor={glowIntensity > 0.2 ? "#ffffff" : "#f1f5f9"} />
              <stop offset="40%" stopColor={glowIntensity > 0.2 ? "#cbd5e1" : "#94a3b8"} />
              <stop offset="100%" stopColor={glowIntensity > 0.2 ? "#64748b" : "#334155"} />
            </radialGradient>
          </defs>
        </g>
      );
    }
    
    return elements;
  };

  const renderConnections = (fromX: number, toX: number, fromCount: number, toCount: number, layerIndex: number) => {
    const connections = [];
    const fromSpacing = 280 / (fromCount + 1);
    const toSpacing = 280 / (toCount + 1);
    
    for (let i = 0; i < fromCount; i++) {
      for (let j = 0; j < toCount; j++) {
        const fromY = 90 + (i + 1) * fromSpacing;
        const toY = 90 + (j + 1) * toSpacing;
        
        const connectionKey = `${layerIndex}-${i}-${j}`;
        const connectionStrength = connectionPulses.get(connectionKey) || 0;
        const isActiveConnection = isActive && connectionStrength > 0.3;
        const isPulsingConnection = isActive && connectionStrength > 0.6;
        
        connections.push(
          <motion.line
            key={connectionKey}
            x1={fromX + 18}
            y1={fromY}
            x2={toX - 18}
            y2={toY}
            stroke={isActiveConnection ? "#94a3b8" : "#475569"}
            strokeWidth={isPulsingConnection ? "4" : isActiveConnection ? "3" : "2"}
            opacity={isPulsingConnection ? "1" : isActiveConnection ? "0.8" : "0.3"}
            animate={isPulsingConnection ? {
              strokeWidth: [4, 6, 4],
              opacity: [1, 0.6, 1]
            } : {}}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              filter: isActiveConnection 
                ? `drop-shadow(0 0 8px #94a3b8) ${isPulsingConnection ? 'drop-shadow(0 0 16px #64748b)' : ''}` 
                : 'none'
            }}
          />
        );
      }
    }
    
    return connections;
  };

  return (
    <motion.div
      className="bg-card/50 backdrop-blur-sm border rounded-lg p-4 h-[450px] flex flex-col"
      style={{
        borderColor: isActive ? '#64748b' : undefined,
        boxShadow: isActive ? '0 0 30px rgba(0, 0, 0, 0.4)' : undefined
      }}
      animate={isActive ? {
        borderColor: ['#64748b', '#94a3b8', '#64748b'],
        boxShadow: [
          '0 0 30px rgba(0, 0, 0, 0.4)',
          '0 0 50px rgba(0, 0, 0, 0.5)',
          '0 0 30px rgba(0, 0, 0, 0.4)'
        ]
      } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Professional Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="text-slate-400"
            animate={{ 
              rotate: isActive ? 360 : 0,
              scale: isActive ? [1, 1.2, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              filter: isActive ? 'drop-shadow(0 0 15px #64748b)' : 'none'
            }}
          >
            <Brain className="h-6 w-6" />
          </motion.div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Neural Network</h3>
            <p className="text-sm text-slate-300 font-medium">
              {isActive ? 'Processing Forward Pass...' : 'Deep Learning Architecture'}
            </p>
          </div>
        </div>
        
        <Button
          onClick={toggleActivation}
          size="sm"
          className={`px-4 py-2 font-bold transition-all duration-300 ${
            isActive 
              ? 'bg-cyan-600/30 border-2 border-cyan-400 text-cyan-100 shadow-lg shadow-cyan-400/50' 
              : 'bg-slate-700/50 border-2 border-slate-500 text-slate-200 hover:border-cyan-400 hover:text-cyan-200'
          }`}
          style={{
            filter: isActive ? 'drop-shadow(0 0 15px #00ffff)' : 'none'
          }}
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Processing
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Activate
            </>
          )}
        </Button>
      </div>

      {/* Professional Control Panel */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-cyan-300">Neurons</label>
          <Slider
            value={neurons}
            onValueChange={setNeurons}
            min={4}
            max={12}
            step={1}
            disabled={isActive}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-cyan-400 [&_[role=slider]]:to-blue-500 [&_[role=slider]]:border-cyan-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-cyan-400/50"
          />
          <div className="text-xs font-mono text-cyan-200 text-center bg-slate-800/50 rounded px-2 py-1">
            {neurons[0]}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-blue-300">Layers</label>
          <Slider
            value={layers}
            onValueChange={setLayers}
            min={2}
            max={6}
            step={1}
            disabled={isActive}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-blue-400 [&_[role=slider]]:to-indigo-500 [&_[role=slider]]:border-blue-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-blue-400/50"
          />
          <div className="text-xs font-mono text-blue-200 text-center bg-slate-800/50 rounded px-2 py-1">
            {layers[0]}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-purple-300">Activation</label>
          <Slider
            value={activation}
            onValueChange={setActivation}
            min={0.1}
            max={1}
            step={0.05}
            disabled={isActive}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-purple-400 [&_[role=slider]]:to-pink-500 [&_[role=slider]]:border-purple-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-purple-400/50"
          />
          <div className="text-xs font-mono text-purple-200 text-center bg-slate-800/50 rounded px-2 py-1">
            {activation[0].toFixed(2)}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-green-300">Learn Rate</label>
          <Slider
            value={learningRate}
            onValueChange={setLearningRate}
            min={0.001}
            max={0.1}
            step={0.005}
            disabled={isActive}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-green-400 [&_[role=slider]]:to-emerald-500 [&_[role=slider]]:border-green-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-green-400/50"
          />
          <div className="text-xs font-mono text-green-200 text-center bg-slate-800/50 rounded px-2 py-1">
            {learningRate[0].toFixed(3)}
          </div>
        </div>
      </div>

      {/* Professional Neural Network Visualization */}
      <div className="flex-1 relative overflow-hidden rounded-lg border border-slate-600/30">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 800 400"
          style={{
            background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)'
          }}
        >
          {/* Professional grid pattern */}
          <defs>
            <pattern
              id="professionalGrid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#334155"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#professionalGrid)" />
          
          {/* Render connections first */}
          {Array.from({ length: layers[0] - 1 }, (_, i) => 
            renderConnections(
              150 + i * 150, 
              150 + (i + 1) * 150, 
              neurons[0], 
              neurons[0], 
              i
            )
          )}
          
          {/* Render neural layers */}
          {Array.from({ length: layers[0] }, (_, i) => 
            renderNeuralLayer(i, neurons[0], 150 + i * 150)
          )}
        </svg>

        {/* Professional status indicators */}
        <div className="absolute top-4 right-4 flex gap-3">
          <motion.div
            className="flex items-center gap-2 bg-slate-900/80 backdrop-blur rounded-full px-3 py-1 border border-cyan-500/30"
            animate={isActive ? {
              borderColor: ['#0099ff', '#00ffff', '#0099ff'],
              boxShadow: [
                '0 0 10px rgba(0, 153, 255, 0.3)',
                '0 0 20px rgba(0, 255, 255, 0.5)',
                '0 0 10px rgba(0, 153, 255, 0.3)'
              ]
            } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`}></div>
            <span className="text-xs font-mono text-cyan-200">
              {isActive ? 'ACTIVE' : 'IDLE'}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Professional Analytics Panel */}
      <div className="mt-3 grid grid-cols-5 gap-2">
        {[
          { label: 'Accuracy', value: `${(activation[0] * 94.5).toFixed(1)}%`, color: 'cyan' },
          { label: 'Loss', value: `${((1 - activation[0]) * 0.8).toFixed(3)}`, color: 'red' },
          { label: 'Epoch', value: `${Math.floor(learningRate[0] * 1000)}`, color: 'green' },
          { label: 'Params', value: `${(neurons[0] * layers[0] * 1.2).toFixed(0)}k`, color: 'purple' },
          { label: 'Speed', value: `${(activation[0] * 150).toFixed(0)}ms`, color: 'blue' }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            className={`bg-slate-800/60 border border-${metric.color}-500/30 rounded-lg p-2 text-center`}
            whileHover={{ scale: 1.05 }}
            style={{
              boxShadow: isActive ? `0 0 15px rgba(0, 153, 255, 0.2)` : 'none'
            }}
          >
            <div className={`text-xs font-bold text-${metric.color}-300 mb-1`}>
              {metric.label}
            </div>
            <div className={`text-sm font-mono text-${metric.color}-100`}>
              {metric.value}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 