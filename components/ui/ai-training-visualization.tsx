"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, Zap, BarChart3, TrendingUp, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  learningRate: number;
  validationLoss: number;
  validationAccuracy: number;
  momentum: number;
  weightDecay: number;
  temperature: number;
  gradientNorm: number;
  throughput: number;
}

interface TrainingParams {
  maxEpochs: number;
  learningRate: number;
  batchSize: number;
  momentum: number;
  weightDecay: number;
  dropoutRate: number;
  temperature: number;
}

export function AITrainingVisualization() {
  const [isTraining, setIsTraining] = useState(false);
  const [metrics, setMetrics] = useState<TrainingMetrics>({
    epoch: 0,
    loss: 1.2,
    accuracy: 0.52,
    learningRate: 0.001,
    validationLoss: 1.35,
    validationAccuracy: 0.48,
    momentum: 0.9,
    weightDecay: 0.0001,
    temperature: 1.0,
    gradientNorm: 1.2,
    throughput: 0
  });

  const [params, setParams] = useState<TrainingParams>({
    maxEpochs: 100,
    learningRate: 0.001,
    batchSize: 32,
    momentum: 0.9,
    weightDecay: 0.0001,
    dropoutRate: 0.2,
    temperature: 1.0
  });

  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [accuracyHistory, setAccuracyHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!isTraining) return;

    const trainingInterval = setInterval(() => {
      setMetrics(prev => {
        const progress = prev.epoch / params.maxEpochs;
        const remainingProgress = 1 - progress;
        
        // Realistic training dynamics with phases
        let lossDecayRate = 0.92; // More aggressive early decay
        let accuracyGrowthRate = 0.03; // Faster initial growth
        
        // Training phases
        if (progress < 0.3) {
          // Early training - fast improvement
          lossDecayRate = 0.88;
          accuracyGrowthRate = 0.035;
        } else if (progress < 0.7) {
          // Mid training - steady improvement
          lossDecayRate = 0.94;
          accuracyGrowthRate = 0.02;
        } else {
          // Late training - slow convergence
          lossDecayRate = 0.98;
          accuracyGrowthRate = 0.005;
        }
        
        // Add noise based on learning rate and batch size
        const noiseLevel = params.learningRate * (0.5 + params.batchSize / 256);
        const lossNoise = (Math.random() - 0.5) * noiseLevel * 0.2;
        const accNoise = (Math.random() - 0.5) * noiseLevel * 0.05;
        
        // Realistic loss decrease with occasional spikes
        const baseLossDecay = prev.loss * lossDecayRate;
        const newLoss = Math.max(0.001, baseLossDecay + lossNoise);
        
        // Realistic accuracy growth with plateaus
        const baseAccGrowth = prev.accuracy + (accuracyGrowthRate * remainingProgress);
        const newAccuracy = Math.min(0.98, baseAccGrowth + accNoise);
        
        // Validation dynamics with overfitting simulation
        let valGap = 0.05; // Initial validation gap
        if (progress > 0.5) {
          // Start overfitting after 50% of training
          valGap += (progress - 0.5) * 0.2; // Increasing validation gap
        }
        
        const newValLoss = newLoss * (1 + valGap + params.dropoutRate * 0.1);
        const newValAccuracy = newAccuracy * (1 - valGap - params.dropoutRate * 0.05);
        
        // Realistic learning rate scheduling
        let newLearningRate = params.learningRate;
        // Step decay every 30 epochs
        const stepDecayEpochs = 30;
        const decaySteps = Math.floor(prev.epoch / stepDecayEpochs);
        newLearningRate = params.learningRate * Math.pow(0.5, decaySteps);
        
        // Gradient norm dynamics
        const newGradientNorm = Math.max(0.01, 
          prev.gradientNorm * (0.95 + lossNoise * 0.1) * (1 + params.momentum * 0.1)
        );
        
        // Realistic throughput calculation
        const baseSpeed = 12; // samples per second
        const batchMultiplier = params.batchSize / 32; // normalized to batch size 32
        const momentumBoost = 1 + params.momentum * 0.3;
        const currentThroughput = (baseSpeed * batchMultiplier * momentumBoost) + Math.random() * 2;

        const newMetrics = {
          ...prev,
          epoch: prev.epoch + 1,
          loss: newLoss,
          accuracy: newAccuracy,
          validationLoss: newValLoss,
          validationAccuracy: Math.max(0.01, newValAccuracy),
          learningRate: newLearningRate,
          gradientNorm: newGradientNorm,
          throughput: currentThroughput
        };

        // Update history for charts
        setLossHistory(prev => [...prev.slice(-19), newMetrics.loss]);
        setAccuracyHistory(prev => [...prev.slice(-19), newMetrics.accuracy]);

        // Early stopping conditions
        const isConverged = newMetrics.accuracy > 0.95;
        const isOverfitting = newMetrics.validationLoss > newMetrics.loss * 1.5;
        const isComplete = newMetrics.epoch >= params.maxEpochs;
        
        if (isConverged || isOverfitting || isComplete) {
          setIsTraining(false);
        }

        return newMetrics;
      });
    }, 200);

    return () => clearInterval(trainingInterval);
  }, [isTraining, params]);

  const toggleTraining = () => {
    if (isTraining) {
      setIsTraining(false);
    } else {
      // Reset with realistic random initialization
      const initLoss = 1.0 + Math.random() * 0.6; // 1.0-1.6
      const initAcc = 0.45 + Math.random() * 0.15; // 45-60%
      
      setMetrics(prev => ({
        ...prev,
        epoch: 0,
        loss: initLoss,
        accuracy: initAcc,
        validationLoss: initLoss * (1.1 + Math.random() * 0.2),
        validationAccuracy: initAcc * (0.9 + Math.random() * 0.1),
        gradientNorm: 0.8 + Math.random() * 0.8,
        learningRate: params.learningRate,
        throughput: 0
      }));
      setLossHistory([]);
      setAccuracyHistory([]);
      setIsTraining(true);
    }
  };

  const resetTraining = () => {
    setIsTraining(false);
    setMetrics(prev => ({
      ...prev,
      epoch: 0,
      loss: 1.2,
      accuracy: 0.52,
      validationLoss: 1.35,
      validationAccuracy: 0.48,
      gradientNorm: 1.2,
      learningRate: params.learningRate,
      throughput: 0
    }));
    setLossHistory([]);
    setAccuracyHistory([]);
  };

  return (
    <motion.div
      className="bg-card/50 backdrop-blur-sm border rounded-lg p-4 h-[450px] flex flex-col"
      style={{
        borderColor: isTraining ? '#64748b' : undefined,
        boxShadow: isTraining ? '0 0 30px rgba(0, 0, 0, 0.4)' : undefined
      }}
      animate={isTraining ? {
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
              rotate: isTraining ? 360 : 0,
              scale: isTraining ? [1, 1.15, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 3, repeat: isTraining ? Infinity : 0, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              filter: isTraining ? 'drop-shadow(0 0 20px #64748b)' : 'none'
            }}
          >
            <Brain className="h-6 w-6" />
          </motion.div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Neural Training</h3>
            <p className="text-sm text-slate-300 font-medium">
              {isTraining ? `Training Epoch ${metrics.epoch}/${params.maxEpochs}` : 'Deep Learning Optimizer'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={resetTraining}
            size="sm"
            variant="outline"
            className="px-3 py-2 border-2 border-slate-500 text-slate-300 hover:border-orange-400 hover:text-orange-200 transition-all duration-300"
            disabled={isTraining}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            onClick={toggleTraining}
            disabled={false}
            size="sm"
            className={`px-4 py-2 font-bold transition-all duration-300 ${
              isTraining 
                ? 'bg-slate-600/30 border-2 border-slate-400 text-slate-100 opacity-50' 
                : 'bg-slate-600/30 border-2 border-slate-400 text-slate-100'
            }`}
          >
            {isTraining ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Training
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Training
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Professional Parameter Controls */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-cyan-300">Epochs</label>
          <Slider
            value={[params.maxEpochs]}
            onValueChange={([value]) => setParams(prev => ({ ...prev, maxEpochs: value }))}
            min={10}
            max={300}
            step={10}
            disabled={isTraining}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-cyan-400 [&_[role=slider]]:to-blue-500 [&_[role=slider]]:border-cyan-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-cyan-400/50"
          />
          <div className="text-xs font-mono text-cyan-200 text-center bg-slate-800/60 rounded px-2 py-1 border border-cyan-500/30">
            {params.maxEpochs}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-purple-300">Batch Size</label>
          <Slider
            value={[params.batchSize]}
            onValueChange={([value]) => setParams(prev => ({ ...prev, batchSize: value }))}
            min={16}
            max={256}
            step={16}
            disabled={isTraining}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-purple-400 [&_[role=slider]]:to-pink-500 [&_[role=slider]]:border-purple-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-purple-400/50"
          />
          <div className="text-xs font-mono text-purple-200 text-center bg-slate-800/60 rounded px-2 py-1 border border-purple-500/30">
            {params.batchSize}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-emerald-300">Learn Rate</label>
          <Slider
            value={[params.learningRate * 100000]}
            onValueChange={([value]) => setParams(prev => ({ ...prev, learningRate: value / 100000 }))}
            min={1}
            max={500}
            step={1}
            disabled={isTraining}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-emerald-400 [&_[role=slider]]:to-green-500 [&_[role=slider]]:border-emerald-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-emerald-400/50"
          />
          <div className="text-xs font-mono text-emerald-200 text-center bg-slate-800/60 rounded px-2 py-1 border border-emerald-500/30">
            {params.learningRate.toFixed(5)}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-orange-300">Momentum</label>
          <Slider
            value={[params.momentum * 100]}
            onValueChange={([value]) => setParams(prev => ({ ...prev, momentum: value / 100 }))}
            min={50}
            max={99}
            step={1}
            disabled={isTraining}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-orange-400 [&_[role=slider]]:to-red-500 [&_[role=slider]]:border-orange-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-orange-400/50"
          />
          <div className="text-xs font-mono text-orange-200 text-center bg-slate-800/60 rounded px-2 py-1 border border-orange-500/30">
            {params.momentum.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-indigo-300">Dropout Rate</label>
          <Slider
            value={[params.dropoutRate * 100]}
            onValueChange={([value]) => setParams(prev => ({ ...prev, dropoutRate: value / 100 }))}
            min={0}
            max={50}
            step={5}
            disabled={isTraining}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-indigo-400 [&_[role=slider]]:to-violet-500 [&_[role=slider]]:border-indigo-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-indigo-400/50"
          />
          <div className="text-xs font-mono text-indigo-200 text-center bg-slate-800/60 rounded px-2 py-1 border border-indigo-500/30">
            {(params.dropoutRate * 100).toFixed(0)}%
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-yellow-300">Weight Decay</label>
          <Slider
            value={[params.weightDecay * 100000]}
            onValueChange={([value]) => setParams(prev => ({ ...prev, weightDecay: value / 100000 }))}
            min={1}
            max={100}
            step={1}
            disabled={isTraining}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-yellow-400 [&_[role=slider]]:to-amber-500 [&_[role=slider]]:border-yellow-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-yellow-400/50"
          />
          <div className="text-xs font-mono text-yellow-200 text-center bg-slate-800/60 rounded px-2 py-1 border border-yellow-500/30">
            {params.weightDecay.toFixed(5)}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-rose-300">Temperature</label>
          <Slider
            value={[params.temperature * 100]}
            onValueChange={([value]) => setParams(prev => ({ ...prev, temperature: value / 100 }))}
            min={10}
            max={500}
            step={10}
            disabled={isTraining}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-rose-400 [&_[role=slider]]:to-pink-500 [&_[role=slider]]:border-rose-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-rose-400/50"
          />
          <div className="text-xs font-mono text-rose-200 text-center bg-slate-800/60 rounded px-2 py-1 border border-rose-500/30">
            {params.temperature.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Professional Training Visualization */}
      <div className="flex-1 relative rounded-lg overflow-hidden border border-slate-600/40">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
          }}
        >
          {/* Professional Grid Pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="professionalTrainingGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#64748b" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#professionalTrainingGrid)" />
            </svg>
          </div>

          {/* Real-time Charts */}
          <div className="relative h-full p-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Loss Chart */}
              <div className="relative">
                <div className="absolute top-0 left-0 text-xs font-bold text-red-300 mb-2">Training Loss</div>
                <svg className="w-full h-full" viewBox="0 0 200 100">
                  <defs>
                    <linearGradient id="lossGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  {lossHistory.length > 1 && (
                    <motion.path
                      d={`M ${lossHistory.map((loss, i) => `${i * (180 / (lossHistory.length - 1)) + 10},${90 - (loss / 3) * 70}`).join(' L ')}`}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        filter: 'drop-shadow(0 0 8px #ef4444)'
                      }}
                    />
                  )}
                  {lossHistory.length > 1 && (
                    <motion.path
                      d={`M ${lossHistory.map((loss, i) => `${i * (180 / (lossHistory.length - 1)) + 10},${90 - (loss / 3) * 70}`).join(' L ')} L 190,90 L 10,90 Z`}
                      fill="url(#lossGradient)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                </svg>
                <div className="absolute bottom-0 right-0 text-xs font-mono text-red-200 bg-slate-800/60 rounded px-2 py-1 border border-red-500/30">
                  {metrics.loss.toFixed(3)}
                </div>
              </div>

              {/* Accuracy Chart */}
              <div className="relative">
                <div className="absolute top-0 left-0 text-xs font-bold text-emerald-300 mb-2">Accuracy</div>
                <svg className="w-full h-full" viewBox="0 0 200 100">
                  <defs>
                    <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.1"/>
                    </linearGradient>
                  </defs>
                  {accuracyHistory.length > 1 && (
                    <motion.path
                      d={`M ${accuracyHistory.map((acc, i) => `${i * (180 / (accuracyHistory.length - 1)) + 10},${90 - acc * 70}`).join(' L ')}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        filter: 'drop-shadow(0 0 8px #10b981)'
                      }}
                    />
                  )}
                  {accuracyHistory.length > 1 && (
                    <motion.path
                      d={`M ${accuracyHistory.map((acc, i) => `${i * (180 / (accuracyHistory.length - 1)) + 10},${90 - acc * 70}`).join(' L ')} L 190,90 L 10,90 Z`}
                      fill="url(#accuracyGradient)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                </svg>
                <div className="absolute bottom-0 right-0 text-xs font-mono text-emerald-200 bg-slate-800/60 rounded px-2 py-1 border border-emerald-500/30">
                  {(metrics.accuracy * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Training Status Pulse */}
            {isTraining && (
              <motion.div
                className="absolute top-4 right-4 w-4 h-4 rounded-full bg-emerald-400"
                animate={{
                  scale: [1, 1.5, 1],
                  boxShadow: [
                    '0 0 10px rgba(16, 185, 129, 0.6)',
                    '0 0 25px rgba(16, 185, 129, 0.9)',
                    '0 0 10px rgba(16, 185, 129, 0.6)'
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Professional Metrics Panel */}
      <div className="mt-3 grid grid-cols-6 gap-2">
        {[
          { label: 'Train Loss', value: metrics.loss.toFixed(3), color: 'red', icon: TrendingUp },
          { label: 'Val Loss', value: metrics.validationLoss.toFixed(3), color: 'orange', icon: BarChart3 },
          { label: 'Train Acc', value: `${(metrics.accuracy * 100).toFixed(1)}%`, color: 'emerald', icon: TrendingUp },
          { label: 'Val Acc', value: `${(metrics.validationAccuracy * 100).toFixed(1)}%`, color: 'green', icon: BarChart3 },
          { label: 'Grad Norm', value: metrics.gradientNorm.toFixed(2), color: 'blue', icon: Zap },
          { label: 'Throughput', value: `${metrics.throughput.toFixed(0)}/s`, color: 'purple', icon: Cpu }
        ].map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={metric.label}
              className={`bg-slate-800/70 border border-${metric.color}-500/40 rounded-lg p-2 text-center backdrop-blur-sm`}
              whileHover={{ scale: 1.05 }}
              style={{
                boxShadow: isTraining ? `0 0 15px rgba(16, 185, 129, 0.2)` : 'none'
              }}
            >
              <div className="flex items-center justify-center mb-1">
                <IconComponent className={`h-3 w-3 text-${metric.color}-400 mr-1`} />
                <div className={`text-xs font-bold text-${metric.color}-300`}>
                  {metric.label}
                </div>
              </div>
              <div className={`text-sm font-mono text-${metric.color}-100 font-bold`}>
                {metric.value}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
} 