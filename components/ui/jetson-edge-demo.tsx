"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Thermometer, 
  Zap, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Gauge,
  Brain,
  Camera,
  Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface SystemMetrics {
  cpu: number;
  gpu: number;
  temperature: number;
  power: number;
  memory: number;
  inference: number;
}

interface TrainingMetrics {
  epochs: number;
  batchSize: number;
  learningRate: number;
  accuracy: number;
  loss: number;
  fps: number;
}

interface AIModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  fps: number;
  powerUsage: number;
  isRunning: boolean;
  icon: any;
  color: string;
  features?: string[];
  confidence?: number;
}

const aiModels: AIModel[] = [
  {
    id: 'yolo',
    name: 'YOLOv8',
    type: 'Object Detection + Segmentation',
    accuracy: 89.2,
    fps: 45,
    powerUsage: 12.5,
    isRunning: false,
    icon: Camera,
    color: '#3b82f6',
    features: ['Object Detection', 'Instance Segmentation', 'Pose Estimation'],
    confidence: 0.85
  },
  {
    id: 'mobilenet',
    name: 'MobileNet',
    type: 'Classification',
    accuracy: 92.8,
    fps: 78,
    powerUsage: 8.3,
    isRunning: false,
    icon: Brain,
    color: '#10b981',
    features: ['Real-time Classification', 'Edge Optimized'],
    confidence: 0.92
  },
  {
    id: 'segnet',
    name: 'SegNet',
    type: 'Semantic Segmentation',
    accuracy: 85.7,
    fps: 32,
    powerUsage: 15.2,
    isRunning: false,
    icon: Activity,
    color: '#f59e0b',
    features: ['Pixel-wise Segmentation', 'Scene Understanding'],
    confidence: 0.81
  },
  {
    id: 'deepsort',
    name: 'DeepSORT',
    type: 'Multi-Object Tracking',
    accuracy: 87.4,
    fps: 28,
    powerUsage: 18.7,
    isRunning: false,
    icon: Wifi,
    color: '#8b5cf6',
    features: ['Object Tracking', 'Re-identification', 'Kalman Filter'],
    confidence: 0.84
  }
];

interface JetsonEdgeDemoProps {
  className?: string;
}

export function JetsonEdgeDemo({ className = "" }: JetsonEdgeDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    gpu: 62,
    temperature: 42,
    power: 15.2,
    memory: 58,
    inference: 120
  });
  
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics>({
    epochs: 50,
    batchSize: 32,
    learningRate: 0.001,
    accuracy: 85.4,
    loss: 0.23,
    fps: 28
  });
  
  const [models, setModels] = useState<AIModel[]>(aiModels);
  const [selectedModel, setSelectedModel] = useState<string>('yolo');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    drawOrinNano();
  }, [isRunning, selectedModel]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(20, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        gpu: Math.max(30, Math.min(98, prev.gpu + (Math.random() - 0.5) * 8)),
        temperature: Math.max(35, Math.min(85, prev.temperature + (Math.random() - 0.5) * 3)),
        power: Math.max(8, Math.min(25, prev.power + (Math.random() - 0.5) * 2)),
        memory: Math.max(40, Math.min(90, prev.memory + (Math.random() - 0.5) * 5)),
        inference: Math.max(50, Math.min(200, prev.inference + (Math.random() - 0.5) * 20))
      }));

      if (showTraining) {
        setTrainingMetrics(prev => ({
          ...prev,
          accuracy: Math.min(99.9, prev.accuracy + Math.random() * 0.1),
          loss: Math.max(0.01, prev.loss - Math.random() * 0.01),
          fps: Math.max(15, Math.min(60, prev.fps + (Math.random() - 0.5) * 3))
        }));
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isRunning, showTraining]);

  const drawOrinNano = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Professional Jetson Orin Nano Board Design - Scaled to fit canvas
    const boardWidth = 120;
    const boardHeight = 70;
    const startX = 10;
    const startY = 10;

    // PCB Background with realistic gradient
    const pcbGradient = ctx.createLinearGradient(startX, startY, startX + boardWidth, startY + boardHeight);
    pcbGradient.addColorStop(0, '#1e3a2e');
    pcbGradient.addColorStop(0.5, '#0f2818');
    pcbGradient.addColorStop(1, '#1e3a2e');
    ctx.fillStyle = pcbGradient;
    ctx.fillRect(startX, startY, boardWidth, boardHeight);

    // PCB Border and mounting holes
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, startY, boardWidth, boardHeight);
    
    // Mounting holes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(startX + 6, startY + 6, 2, 0, 2 * Math.PI);
    ctx.arc(startX + boardWidth - 6, startY + 6, 2, 0, 2 * Math.PI);
    ctx.arc(startX + 6, startY + boardHeight - 6, 2, 0, 2 * Math.PI);
    ctx.arc(startX + boardWidth - 6, startY + boardHeight - 6, 2, 0, 2 * Math.PI);
    ctx.fill();

    // Main SoC Processor (NVIDIA Orin)
    const socX = startX + 35;
    const socY = startY + 20;
    const socSize = 30;
    
    // SoC substrate
    ctx.fillStyle = '#2d1b69';
    ctx.fillRect(socX, socY, socSize, socSize);
    
    // SoC with professional gradient
    const socGradient = ctx.createRadialGradient(
      socX + socSize/2 - 6, socY + socSize/2 - 6, 0,
      socX + socSize/2, socY + socSize/2, socSize * 0.8
    );
    socGradient.addColorStop(0, '#60a5fa');
    socGradient.addColorStop(0.3, '#3b82f6');
    socGradient.addColorStop(0.7, '#1e40af');
    socGradient.addColorStop(1, '#1e3a8a');

    ctx.fillStyle = socGradient;
    ctx.fillRect(socX + 2, socY + 2, socSize - 4, socSize - 4);

    // NVIDIA logo area (simplified)
    ctx.fillStyle = '#76b900';
    ctx.font = 'bold 6px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NVIDIA', socX + socSize/2, socY + socSize/2 - 3);
    ctx.fillText('ORIN', socX + socSize/2, socY + socSize/2 + 3);

    // SoC glow effect when running
    if (isRunning) {
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.strokeRect(socX - 2, socY - 2, socSize + 4, socSize + 4);
      ctx.shadowBlur = 0;
    }

    // Professional heat sink
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(socX - 3, socY - 8, socSize + 6, 6);
    
    // Heat sink fins
    ctx.fillStyle = '#6b7280';
    for (let i = 0; i < 8; i++) {
      const finX = socX - 2 + i * 4;
      ctx.fillRect(finX, socY - 10, 1.5, 10);
    }
    
    // Heat sink mounting screws
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(socX - 1, socY - 5, 1.5, 0, 2 * Math.PI);
    ctx.arc(socX + socSize + 1, socY - 5, 1.5, 0, 2 * Math.PI);
    ctx.fill();

    // LPDDR5 Memory modules (professional)
    const memGradient = ctx.createLinearGradient(0, 0, 0, 10);
    memGradient.addColorStop(0, '#4b5563');
    memGradient.addColorStop(1, '#374151');
    ctx.fillStyle = memGradient;
    
    ctx.fillRect(startX + 75, startY + 15, 25, 8); // RAM 1
    ctx.fillRect(startX + 75, startY + 26, 25, 8); // RAM 2
    
    // Memory labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('8GB', startX + 87, startY + 20);
    ctx.fillText('LPDDR5', startX + 87, startY + 31);

    // eUFS Storage
    ctx.fillStyle = memGradient;
    ctx.fillRect(startX + 75, startY + 40, 25, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('64GB', startX + 87, startY + 45);
    ctx.fillText('eUFS', startX + 87, startY + 50);

    // GPIO Header (40-pin)
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(startX + 8, startY + 3, 60, 8);
    
    // GPIO pins
    ctx.fillStyle = '#fbbf24';
    for (let i = 0; i < 15; i++) {
      ctx.fillRect(startX + 10 + i * 3.8, startY + 4, 1, 2);
      ctx.fillRect(startX + 10 + i * 3.8, startY + 7, 1, 2);
    }

    // USB-C Power connector
    ctx.fillStyle = '#374151';
    ctx.fillRect(startX + boardWidth - 4, startY + 55, 6, 8);
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(startX + boardWidth - 2, startY + 56, 3, 6);

    // USB 3.0 ports
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(startX - 6, startY + 20, 6, 8); // USB 1
    ctx.fillRect(startX - 6, startY + 30, 6, 8); // USB 2
    
    // Gigabit Ethernet
    ctx.fillStyle = '#059669';
    ctx.fillRect(startX - 6, startY + 40, 6, 12);

    // Status LEDs (professional)
    const selectedModelData = models.find(m => m.id === selectedModel);
    
    // Power LED
    ctx.fillStyle = isRunning ? '#10b981' : '#374151';
    ctx.beginPath();
    ctx.arc(startX + 15, startY + boardHeight - 6, 1.5, 0, 2 * Math.PI);
    ctx.fill();
    
    // Activity LED
    if (isRunning && selectedModelData?.isRunning) {
      ctx.fillStyle = selectedModelData.color;
      ctx.beginPath();
      ctx.arc(startX + 20, startY + boardHeight - 6, 1.5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Pulsing effect
      const time = Date.now() * 0.008;
      const pulse = Math.sin(time) * 0.5 + 0.5;
      ctx.globalAlpha = pulse;
      ctx.beginPath();
      ctx.arc(startX + 20, startY + boardHeight - 6, 3, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // AI Processing visualization
    if (isRunning) {
      const time = Date.now() * 0.003;
      
      // Neural processing waves
      for (let i = 0; i < 3; i++) {
        const phase = time + i * Math.PI / 3;
        const radius = 15 + Math.sin(phase) * 8;
        const alpha = 0.2 + Math.sin(phase) * 0.3;
        
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = selectedModelData?.color || '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(socX + socSize/2, socY + socSize/2, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Performance overlay - moved to fit in canvas
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 2;
    ctx.fillText(`${metrics.temperature.toFixed(1)}°C`, startX + 140, startY + 15);
    ctx.fillText(`${metrics.power.toFixed(1)}W`, startX + 140, startY + 25);
    ctx.fillText(`${metrics.cpu.toFixed(0)}% CPU`, startX + 140, startY + 35);
    ctx.fillText(`${metrics.gpu.toFixed(0)}% GPU`, startX + 140, startY + 45);

    // Model info overlay
    if (selectedModelData) {
      ctx.fillStyle = selectedModelData.color;
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText(selectedModelData.name, startX + 140, startY + 60);
      ctx.font = '6px sans-serif';
      ctx.fillStyle = '#d1d5db';
      ctx.fillText(`${selectedModelData.fps} FPS`, startX + 140, startY + 70);
    }
    
    ctx.shadowBlur = 0;
  };

  const toggleModel = (modelId: string) => {
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, isRunning: !model.isRunning }
        : { ...model, isRunning: false }
    ));
    
    if (!models.find(m => m.id === modelId)?.isRunning) {
      setSelectedModel(modelId);
    }
  };

  const startTraining = () => {
    setShowTraining(true);
    setTrainingMetrics(prev => ({
      ...prev,
      accuracy: 70 + Math.random() * 10,
      loss: 0.8 + Math.random() * 0.4
    }));
  };

  const resetSystem = () => {
    setIsRunning(false);
    setShowTraining(false);
    setModels(prev => prev.map(model => ({ ...model, isRunning: false })));
    setMetrics({
      cpu: 45,
      gpu: 62,
      temperature: 42,
      power: 15.2,
      memory: 58,
      inference: 120
    });
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={`bg-card/50 backdrop-blur-sm border rounded-lg p-3 h-[450px] flex flex-col ${className}`}
      style={{
        borderColor: isRunning ? '#64748b' : undefined,
        boxShadow: isRunning ? '0 0 30px rgba(0, 0, 0, 0.4)' : undefined
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        borderColor: isRunning ? ['#64748b', '#94a3b8', '#64748b'] : undefined,
        boxShadow: isRunning ? [
          '0 0 30px rgba(0, 0, 0, 0.4)',
          '0 0 50px rgba(0, 0, 0, 0.5)',
          '0 0 30px rgba(0, 0, 0, 0.4)'
        ] : undefined
      }}
      transition={{ 
        duration: 0.6,
        borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.div
            className="text-slate-400"
            animate={{ 
              scale: isRunning ? [1, 1.1, 1] : 1,
              rotate: isRunning ? 360 : 0
            }}
            transition={{ 
              scale: { duration: 1, repeat: isRunning ? Infinity : 0 },
              rotate: { duration: 3, repeat: isRunning ? Infinity : 0, ease: "linear" }
            }}
            style={{
              filter: isRunning ? 'drop-shadow(0 0 15px #64748b)' : 'none'
            }}
          >
            <Cpu className="h-4 w-4" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm">Jetson Orin Nano</h3>
            <p className="text-xs text-slate-300">Edge AI Computing</p>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTraining(!showTraining)}
            className="h-6 px-2 text-xs border-slate-500 text-slate-300 hover:border-slate-400 hover:text-slate-200"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetSystem}
            className="h-6 px-2 text-xs border-slate-500 text-slate-300 hover:border-slate-400 hover:text-slate-200"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button
            onClick={() => setIsRunning(!isRunning)}
            size="sm"
            className={`h-6 px-2 text-xs font-bold transition-all duration-300 ${
              isRunning 
                ? 'bg-slate-600/30 border-2 border-slate-400 text-slate-100' 
                : 'bg-slate-600/30 border-2 border-slate-400 text-slate-100'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                Start
              </>
            )}
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-2 text-xs bg-slate-800/30 rounded p-2 border border-slate-600/30">
        <div className="flex items-center gap-1">
          <Cpu className="h-3 w-3 text-slate-400" />
          <span className="text-slate-200 font-mono">CPU: {metrics.cpu.toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Gauge className="h-3 w-3 text-slate-400" />
          <span className="text-slate-200 font-mono">GPU: {metrics.gpu.toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Thermometer className="h-3 w-3 text-slate-400" />
          <span className="text-slate-200 font-mono">{metrics.temperature.toFixed(1)}°C</span>
        </div>
      </div>

      {/* Orin Nano Visualization */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded border border-slate-600/30 p-2 mb-2 overflow-hidden shadow-lg">
        <div className="text-xs text-slate-300 font-semibold mb-1 flex items-center gap-2">
          <Brain className="h-3 w-3" />
          Board Layout & AI Processing
          {isRunning && (
            <motion.div
              className="flex gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
              <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            </motion.div>
          )}
        </div>
        <canvas
          ref={canvasRef}
          width={280}
          height={120}
          className="w-full h-[120px] rounded border border-slate-700/50"
          style={{
            filter: isRunning ? 'drop-shadow(0 0 10px rgba(148, 163, 184, 0.3))' : 'none'
          }}
        />
      </div>

      {/* Training Controls */}
      <AnimatePresence>
        {showTraining && (
          <motion.div
            className="mb-2 p-2 bg-slate-800/30 backdrop-blur-sm rounded border border-slate-600/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="text-xs text-slate-300 font-semibold mb-2 flex items-center gap-1">
              <Settings className="h-3 w-3" />
              Training Configuration
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
              <div>
                <label className="text-slate-400 block">Epochs: {trainingMetrics.epochs}</label>
                <Slider
                  value={[trainingMetrics.epochs]}
                  onValueChange={(v) => setTrainingMetrics(prev => ({ ...prev, epochs: v[0] }))}
                  min={10}
                  max={200}
                  step={10}
                  className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-slate-400 [&_[role=slider]]:to-slate-500 [&_[role=slider]]:border-slate-300"
                />
              </div>
              <div>
                <label className="text-slate-400 block">Batch: {trainingMetrics.batchSize}</label>
                <Slider
                  value={[trainingMetrics.batchSize]}
                  onValueChange={(v) => setTrainingMetrics(prev => ({ ...prev, batchSize: v[0] }))}
                  min={8}
                  max={128}
                  step={8}
                  className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-slate-400 [&_[role=slider]]:to-slate-500 [&_[role=slider]]:border-slate-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 text-xs bg-slate-900/30 rounded p-2">
              <div className="text-center">
                <div className="font-bold text-slate-200">{trainingMetrics.accuracy.toFixed(1)}%</div>
                <div className="text-slate-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-200">{trainingMetrics.loss.toFixed(3)}</div>
                <div className="text-slate-400">Loss</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-200">{trainingMetrics.fps}</div>
                <div className="text-slate-400">FPS</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Models */}
      <div className="text-xs text-slate-300 font-semibold mb-1 flex items-center gap-1">
        <Activity className="h-3 w-3" />
        AI Model Pipeline
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {models.map((model, index) => (
          <motion.button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={`p-2 rounded border transition-all text-left backdrop-blur-sm ${
              model.isRunning 
                ? 'border-slate-400 bg-slate-600/30 shadow-lg shadow-slate-400/30' 
                : selectedModel === model.id
                ? 'border-slate-500/50 bg-slate-700/30'
                : 'border-slate-600/30 bg-slate-800/30 hover:border-slate-500/50'
            }`}
            style={{
              filter: model.isRunning ? 'drop-shadow(0 0 8px rgba(148, 163, 184, 0.4))' : 'none'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-1 mb-1">
              <model.icon 
                className="h-3 w-3 text-slate-400" 
              />
              <span className="font-medium truncate text-slate-200">{model.name}</span>
              {model.isRunning && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-slate-400"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      '0 0 5px rgba(148, 163, 184, 0.5)',
                      '0 0 10px rgba(148, 163, 184, 0.8)',
                      '0 0 5px rgba(148, 163, 184, 0.5)'
                    ]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            <div className="text-slate-400 truncate">{model.type}</div>
            <div className="flex justify-between mt-1 text-slate-300 font-mono">
              <span>{model.accuracy}%</span>
              <span>{model.fps} FPS</span>
            </div>
            {model.confidence && (
              <div className="mt-1 flex items-center gap-1">
                <span className="text-slate-400">Conf:</span>
                <div className="flex-1 bg-slate-700/50 rounded-full h-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-slate-400 to-slate-300 rounded-full"
                    style={{ width: `${model.confidence * 100}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${model.confidence * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
                <span className="text-xs text-slate-300 font-mono">{(model.confidence * 100).toFixed(0)}%</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
} 