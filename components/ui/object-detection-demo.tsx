"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Scan, Target } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Detection {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  label: string;
  color: string;
}

interface ObjectDetectionDemoProps {
  isVisible?: boolean;
  className?: string;
  autoDetect?: boolean;
}

const objectTypes = [
  { label: 'Person', color: '#64748b' },
  { label: 'Car', color: '#94a3b8' },
  { label: 'Dog', color: '#64748b' },
  { label: 'Cat', color: '#94a3b8' },
  { label: 'Bird', color: '#64748b' },
  { label: 'Bicycle', color: '#94a3b8' }
];

export function ObjectDetectionDemo({ 
  isVisible = true, 
  className = "",
  autoDetect = false 
}: ObjectDetectionDemoProps) {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanPosition, setScanPosition] = useState(0);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);

  const generateDetections = useCallback(() => {
    const newDetections: Detection[] = [];
    const numDetections = Math.floor(Math.random() * 4) + 2;

    for (let i = 0; i < numDetections; i++) {
      const objectType = objectTypes[Math.floor(Math.random() * objectTypes.length)];
      const confidence = Math.random() * 0.4 + 0.6;
      
      if (confidence >= confidenceThreshold) {
        const detection: Detection = {
          id: `detection-${i}-${Date.now()}`,
          x: Math.random() * 60 + 10,
          y: Math.random() * 50 + 20,
          width: Math.random() * 20 + 15,
          height: Math.random() * 20 + 15,
          confidence,
          label: objectType.label,
          color: objectType.color,
        };
        newDetections.push(detection);
      }
    }

    setDetections(newDetections);
  }, [confidenceThreshold]);

  const startScan = () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setScanPosition(0);
    setDetections([]);

    // Animate scan line
    const interval = setInterval(() => {
      setScanPosition(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            generateDetections();
          }, 300);
          return 100;
        }
        return prev + 3;
      });
    }, 50);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`bg-card/50 backdrop-blur-sm border rounded-lg overflow-hidden h-[450px] flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b bg-background/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-slate-400">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Object Detection</h3>
              <p className="text-sm text-slate-300">
                {isScanning ? 'Scanning...' : `${detections.length} objects detected`}
              </p>
            </div>
          </div>
          
          <button
            onClick={startScan}
            disabled={isScanning}
            className={`px-4 py-2 text-sm rounded border font-semibold transition-all duration-300 ${
              isScanning 
                ? 'bg-slate-700/50 border border-slate-600 text-slate-500 cursor-not-allowed' 
                : 'bg-slate-600/30 border-2 border-slate-400 text-slate-100 shadow-lg hover:bg-slate-600/40'
            }`}
          >
            <Scan className="h-4 w-4 inline mr-2" />
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Confidence Threshold</label>
            <Slider
              value={[confidenceThreshold * 100]}
              onValueChange={([value]) => setConfidenceThreshold(value / 100)}
              min={30}
              max={95}
              step={5}
              className="[&_[role=slider]]:bg-slate-400 [&_[role=slider]]:border-slate-300"
            />
            <div className="text-xs font-mono text-slate-200 text-center bg-slate-800/50 rounded px-2 py-1">
              {(confidenceThreshold * 100).toFixed(0)}%
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">System Status</label>
            <div className="flex items-center gap-2 mt-3">
              <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-slate-400' : 'bg-slate-500'}`} />
              <span className="text-xs font-mono text-slate-200 font-semibold">
                {isScanning ? 'SCANNING' : 'READY'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detection Canvas */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-1">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
            {Array.from({ length: 48 }, (_, i) => (
              <div
                key={i}
                className="border border-slate-600/20 bg-slate-800/30"
              />
            ))}
          </div>
        </div>

        {/* Scanning Line */}
        {isScanning && (
          <div
            className="absolute top-0 w-1 h-full bg-gradient-to-b from-transparent via-slate-400 to-transparent z-20"
            style={{ 
              left: `${scanPosition}%`,
              boxShadow: '0 0 20px rgba(148, 163, 184, 0.6)'
            }}
          />
        )}

        {/* Detection Results */}
        <AnimatePresence>
          {detections.map((detection, index) => (
            <motion.div
              key={detection.id}
              className="absolute z-10 border-2 rounded"
              style={{
                left: `${detection.x}%`,
                top: `${detection.y}%`,
                width: `${detection.width}%`,
                height: `${detection.height}%`,
                borderColor: detection.color,
                boxShadow: `0 0 10px ${detection.color}60`
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Label */}
              <div
                className="absolute -top-6 left-0 px-2 py-1 text-xs font-bold text-white rounded"
                style={{ 
                  backgroundColor: `${detection.color}CC`,
                  borderColor: detection.color
                }}
              >
                {detection.label} {(detection.confidence * 100).toFixed(0)}%
              </div>

              {/* Center Dot */}
              <div
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: detection.color }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="p-3 bg-background/30 border-t">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300">Detected: {detections.length}</span>
          </div>
          <div className="text-slate-400 font-mono text-xs">
            YOLOv8 Model
          </div>
        </div>
      </div>
    </div>
  );
} 