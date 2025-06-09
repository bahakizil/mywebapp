"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ArrowRight, CheckCircle, XCircle, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromptExample {
  id: string;
  title: string;
  basic: string;
  improved: string;
  technique: string;
  improvement: string;
}

const promptExamples: PromptExample[] = [
  {
    id: "1",
    title: "Code Generation",
    basic: "Write a function",
    improved: "Write a Python function that calculates the factorial of a number using recursion. Include error handling and docstring.",
    technique: "Specificity",
    improvement: "Added language, method, and requirements"
  },
  {
    id: "2", 
    title: "Content Writing",
    basic: "Write about AI",
    improved: "You are a tech journalist. Write a 300-word article about AI's impact on healthcare for a general audience. Include 3 real examples.",
    technique: "Role + Structure",
    improvement: "Defined role, length, audience, and examples"
  },
  {
    id: "3",
    title: "Analysis",
    basic: "Analyze this data",
    improved: "As a data analyst, examine the sales data below. Identify top 3 trends, calculate growth rates, and suggest actionable insights for Q4 strategy.",
    technique: "Clear Instructions",
    improvement: "Specific tasks and deliverables"
  },
  {
    id: "4",
    title: "Creative",
    basic: "Be creative",
    improved: "Generate 5 unique marketing campaign ideas for eco-friendly products targeting millennials. For each idea, include: theme, channel, and key message.",
    technique: "Examples + Format",
    improvement: "Quantity, target, and output format"
  }
];

export function PromptEngineeringDemo() {
  const [currentExample, setCurrentExample] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showImprovement, setShowImprovement] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        setCurrentExample(prev => (prev + 1) % promptExamples.length);
        setShowImprovement(false);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isAnimating]);

  const handleShowImprovement = () => {
    setIsAnimating(true);
    setShowImprovement(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const nextExample = () => {
    setCurrentExample(prev => (prev + 1) % promptExamples.length);
    setShowImprovement(false);
  };

  const currentPrompt = promptExamples[currentExample];

  return (
    <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-3 h-[450px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: isAnimating ? 360 : 0 }}
            transition={{ duration: 1 }}
          >
            <Lightbulb className="h-4 w-4 text-slate-400" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-sm">Prompt Engineering</h3>
            <p className="text-xs text-muted-foreground">
              Basic → Advanced Prompts
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={nextExample}
            className="h-6 px-2 text-xs border-slate-500 text-slate-300 hover:border-slate-400 hover:text-slate-200"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
          <Button
            onClick={handleShowImprovement}
            size="sm"
            className="h-6 px-2 text-xs bg-slate-600/30 border-2 border-slate-400 text-slate-100 hover:bg-slate-600/40"
            disabled={isAnimating}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Improve
          </Button>
        </div>
      </div>

      {/* Example Title */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{currentPrompt.title}</span>
          <div className="flex gap-1">
            {promptExamples.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentExample ? 'bg-slate-400' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Prompt Comparison */}
      <div className="space-y-3">
        {/* Basic Prompt */}
        <div className="p-3 bg-slate-700/20 border border-slate-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">Basic Prompt</span>
          </div>
          <p className="text-sm text-foreground/80 italic">
            "{currentPrompt.basic}"
          </p>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <motion.div
            animate={{ x: showImprovement ? 10 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>

        {/* Improved Prompt */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showImprovement ? 'improved' : 'hidden'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-3 bg-slate-600/20 border border-slate-400/30 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-slate-300" />
              <span className="text-sm font-medium text-slate-200">Improved Prompt</span>
            </div>
            <p className="text-sm text-foreground/80">
              "{showImprovement ? currentPrompt.improved : '???'}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Technique Used */}
        {showImprovement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-2 bg-slate-700/20 border border-slate-500/30 rounded-lg"
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Technique:</span>
                <div className="font-medium text-slate-300">{currentPrompt.technique}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Key Improvement:</span>
                <div className="font-medium text-slate-300">{currentPrompt.improvement}</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mt-3 flex justify-center">
        <div className="text-xs text-muted-foreground">
          Example {currentExample + 1} of {promptExamples.length}
        </div>
      </div>
    </div>
  );
} 