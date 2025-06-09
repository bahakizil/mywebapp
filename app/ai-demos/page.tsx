"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Brain, FileText, Video, ArrowRight, MessagesSquare, Bot, Upload, Workflow, Network, Play, Pause } from "lucide-react";

// N8N Workflow Demo Component - Complex Network Flow
function N8NWorkflowDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set());

  const nodes = [
    { id: "webhook", name: "Webhook", x: 100, y: 80, type: "trigger" },
    { id: "auth", name: "Auth Check", x: 280, y: 60, type: "condition" },
    { id: "validate", name: "Validate", x: 280, y: 120, type: "condition" },
    { id: "transform", name: "Transform", x: 460, y: 80, type: "action" },
    { id: "db_save", name: "Save DB", x: 640, y: 60, type: "action" },
    { id: "cache", name: "Cache", x: 640, y: 120, type: "action" },
    { id: "email", name: "Email", x: 820, y: 40, type: "notification" },
    { id: "slack", name: "Slack", x: 820, y: 80, type: "notification" },
    { id: "log", name: "Log", x: 820, y: 120, type: "action" },
    { id: "cleanup", name: "Cleanup", x: 640, y: 180, type: "action" }
  ];

  const connections = [
    { from: "webhook", to: "auth", condition: "success" },
    { from: "webhook", to: "validate", condition: "success" },
    { from: "auth", to: "transform", condition: "authorized" },
    { from: "validate", to: "transform", condition: "valid" },
    { from: "transform", to: "db_save", condition: "success" },
    { from: "transform", to: "cache", condition: "success" },
    { from: "db_save", to: "email", condition: "success" },
    { from: "db_save", to: "slack", condition: "critical" },
    { from: "cache", to: "log", condition: "always" },
    { from: "auth", to: "cleanup", condition: "failed" },
    { from: "validate", to: "cleanup", condition: "failed" }
  ];

  const runWorkflow = () => {
    setIsRunning(true);
    setActiveConnections(new Set());
    
    // Simulate complex workflow execution
    const executionSequence = [
      { connection: "webhook-auth", delay: 300 },
      { connection: "webhook-validate", delay: 500 },
      { connection: "auth-transform", delay: 800 },
      { connection: "validate-transform", delay: 1000 },
      { connection: "transform-db_save", delay: 1300 },
      { connection: "transform-cache", delay: 1400 },
      { connection: "db_save-email", delay: 1700 },
      { connection: "cache-log", delay: 1800 }
    ];

         executionSequence.forEach(({ connection, delay }) => {
       setTimeout(() => {
         setActiveConnections(prev => new Set(Array.from(prev).concat([connection])));
       }, delay);
     });

    setTimeout(() => {
      setIsRunning(false);
      setActiveConnections(new Set());
    }, 3000);
  };

  const getNodeColor = (nodeId: string) => {
    const connections = Array.from(activeConnections);
    const hasActiveConnection = connections.some(conn => 
      conn.startsWith(nodeId) || conn.endsWith(nodeId)
    );
    return hasActiveConnection ? "#06b6d4" : "#64748b";
  };

  const isConnectionActive = (from: string, to: string) => {
    return activeConnections.has(`${from}-${to}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Complex Workflow Network</h3>
          <p className="text-sm text-muted-foreground">Multi-path automation with branching logic</p>
        </div>
        <Button onClick={runWorkflow} disabled={isRunning} className="gap-2">
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Running..." : "Execute Flow"}
        </Button>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-lg overflow-hidden h-[300px]">
        <svg className="w-full h-full" viewBox="0 0 1000 240">
          <defs>
            <pattern id="workflowGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#workflowGrid)" />

          {/* Connections */}
          {connections.map((conn, index) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;

            const isActive = isConnectionActive(conn.from, conn.to);
            
            return (
              <line
                key={`${conn.from}-${conn.to}`}
                x1={fromNode.x + 20}
                y1={fromNode.y}
                x2={toNode.x - 20}
                y2={toNode.y}
                stroke={isActive ? "#06b6d4" : "#475569"}
                strokeWidth={isActive ? "3" : "2"}
                opacity={isActive ? "1" : "0.4"}
                className="transition-all duration-300"
                style={{
                  filter: isActive ? 'drop-shadow(0 0 4px #06b6d4)' : 'none'
                }}
              />
            );
          })}

                     {/* Nodes */}
           {nodes.map((node) => {
             const color = getNodeColor(node.id);
             const connections = Array.from(activeConnections);
             const isActive = connections.some(conn => 
               conn.startsWith(node.id) || conn.endsWith(node.id)
             );
            
            return (
              <g key={node.id}>
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                )}
                
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill={color}
                  className="transition-all duration-300"
                  style={{
                    filter: isActive ? 'drop-shadow(0 0 8px #06b6d4)' : 'none'
                  }}
                />
                
                <text
                  x={node.x}
                  y={node.y - 25}
                  textAnchor="middle"
                  className="text-xs font-medium fill-white"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div className="bg-card p-3 rounded border text-center">
          <div className="text-lg font-bold text-cyan-500">{nodes.length}</div>
          <div className="text-xs text-muted-foreground">Nodes</div>
        </div>
        <div className="bg-card p-3 rounded border text-center">
          <div className="text-lg font-bold text-purple-500">{connections.length}</div>
          <div className="text-xs text-muted-foreground">Connections</div>
        </div>
        <div className="bg-card p-3 rounded border text-center">
          <div className="text-lg font-bold text-green-500">98%</div>
          <div className="text-xs text-muted-foreground">Success</div>
        </div>
        <div className="bg-card p-3 rounded border text-center">
          <div className="text-lg font-bold text-orange-500">1.8s</div>
          <div className="text-xs text-muted-foreground">Avg Time</div>
        </div>
      </div>
    </div>
  );
}

// Interactive Neural Network Demo Component - Completely Redesigned
function InteractiveNeuralNetwork() {
  const [neurons, setNeurons] = useState([6]);
  const [layers, setLayers] = useState([3]);
  const [activation, setActivation] = useState([0.5]);
  const [learningRate, setLearningRate] = useState([0.05]);
  const [isActive, setIsActive] = useState(false);
  const [activationPulse, setActivationPulse] = useState<number[]>([]);

  const toggleActivation = () => {
    setIsActive(!isActive);
    if (!isActive) {
      // Generate random activation pattern
      const pattern = Array.from({ length: neurons[0] * layers[0] }, () => Math.random());
      setActivationPulse(pattern);
      
      // Reset after animation
      setTimeout(() => {
        setIsActive(false);
        setActivationPulse([]);
      }, 2000);
    }
  };

  const renderNeuralLayer = (layerIndex: number, neuronCount: number, x: number) => {
    const spacing = 200 / (neuronCount + 1);
    const elements = [];
    
    for (let i = 0; i < neuronCount; i++) {
      const y = 50 + (i + 1) * spacing;
      const neuronId = layerIndex * 10 + i;
      const pulseIntensity = activationPulse[neuronId] || 0;
      const glowIntensity = isActive ? pulseIntensity * activation[0] : 0;
      
      // Slate glow rings
      if (glowIntensity > 0.3) {
        elements.push(
          <g key={`glow-${neuronId}`}>
            <circle
              cx={x}
              cy={y}
              r="25"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3"
              opacity={glowIntensity}
              className="animate-pulse"
              style={{
                filter: 'drop-shadow(0 0 15px #94a3b8)',
              }}
            />
            <circle
              cx={x}
              cy={y}
              r="35"
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              opacity={glowIntensity * 0.6}
              className="animate-pulse"
              style={{
                filter: 'drop-shadow(0 0 25px #64748b)',
              }}
            />
          </g>
        );
      }
      
      // Main neuron
      elements.push(
        <circle
          key={`neuron-${neuronId}`}
          cx={x}
          cy={y}
          r="15"
          fill={glowIntensity > 0.3 ? "#94a3b8" : "#2a3a4a"}
          stroke={glowIntensity > 0.3 ? "#cbd5e1" : "#4a5a6a"}
          strokeWidth="3"
          className="transition-all duration-200"
          style={{
            filter: glowIntensity > 0.3 ? 'drop-shadow(0 0 20px #94a3b8)' : 'none',
          }}
        />
      );
      
      // Inner core
      if (glowIntensity > 0.5) {
        elements.push(
          <circle
            key={`core-${neuronId}`}
            cx={x}
            cy={y}
            r="8"
            fill="#ffffff"
            opacity="0.9"
            className="animate-ping"
          />
        );
      }
    }
    
    return elements;
  };

  const renderConnections = (fromX: number, toX: number, fromCount: number, toCount: number) => {
    const connections = [];
    const fromSpacing = 200 / (fromCount + 1);
    const toSpacing = 200 / (toCount + 1);
    
    for (let i = 0; i < fromCount; i++) {
      for (let j = 0; j < toCount; j++) {
        const fromY = 50 + (i + 1) * fromSpacing;
        const toY = 50 + (j + 1) * toSpacing;
        
        const fromNeuron = i;
        const toNeuron = j;
        const connectionStrength = isActive ? (activationPulse[fromNeuron] || 0) * (activationPulse[toNeuron + 10] || 0) : 0;
        const isActiveConnection = connectionStrength > 0.2;
        
        connections.push(
          <line
            key={`connection-${i}-${j}`}
            x1={fromX + 15}
            y1={fromY}
            x2={toX - 15}
            y2={toY}
            stroke={isActiveConnection ? "#00ffff" : "#3a4a5a"}
            strokeWidth={isActiveConnection ? "4" : "2"}
            opacity={isActiveConnection ? "0.9" : "0.3"}
            className="transition-all duration-200"
            style={{
              filter: isActiveConnection ? 'drop-shadow(0 0 8px #00ffff)' : 'none'
            }}
          />
        );
      }
    }
    
    return connections;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Neural Network Visualizer</h3>
          <p className="text-sm text-muted-foreground">Real-time neural activation with neon effects</p>
        </div>
        <Button onClick={toggleActivation} disabled={isActive} className="gap-2">
          {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isActive ? "Processing..." : "Activate Network"}
        </Button>
      </div>

      {/* Neural Network Canvas */}
      <div className="bg-gradient-to-br from-black via-slate-900 to-black p-6 rounded-lg border border-slate-800 h-[280px]">
        <svg className="w-full h-full" viewBox="0 0 500 250">
          <defs>
            <radialGradient id="neuralBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0, 255, 255, 0.02)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.8)" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#neuralBg)" />

          {/* Layer Labels */}
          <text x="100" y="25" textAnchor="middle" className="text-xs font-mono fill-slate-300">INPUT</text>
          <text x="250" y="25" textAnchor="middle" className="text-xs font-mono fill-slate-300">HIDDEN</text>
          <text x="400" y="25" textAnchor="middle" className="text-xs font-mono fill-slate-300">OUTPUT</text>

          {/* Connections */}
          {renderConnections(100, 250, neurons[0], neurons[0])}
          {renderConnections(250, 400, neurons[0], 3)}

          {/* Neural Layers */}
          {renderNeuralLayer(0, neurons[0], 100)}
          {renderNeuralLayer(1, neurons[0], 250)}
          {renderNeuralLayer(2, 3, 400)}
        </svg>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-300">NEURONS: {neurons[0]}</label>
          <Slider
            value={neurons}
            onValueChange={setNeurons}
            max={8}
            min={3}
            step={1}
            className="[&_.range]:bg-slate-500 [&_.thumb]:bg-slate-400"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-300">LAYERS: {layers[0]}</label>
          <Slider
            value={layers}
            onValueChange={setLayers}
            max={5}
            min={2}
            step={1}
            className="[&_.range]:bg-slate-500 [&_.thumb]:bg-slate-400"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-300">ACTIVATION: {(activation[0] * 100).toFixed(0)}%</label>
          <Slider
            value={activation}
            onValueChange={setActivation}
            max={1}
            min={0.1}
            step={0.1}
            className="[&_.range]:bg-slate-500 [&_.thumb]:bg-slate-400"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-300">LEARNING: {(learningRate[0] * 100).toFixed(1)}%</label>
          <Slider
            value={learningRate}
            onValueChange={setLearningRate}
            max={0.1}
            min={0.01}
            step={0.01}
            className="[&_.range]:bg-slate-500 [&_.thumb]:bg-slate-400"
          />
        </div>
      </div>

      {/* Network Analytics */}
      <div className="grid grid-cols-5 gap-3">
        <div className="bg-slate-900 border border-slate-500/30 p-3 rounded text-center">
          <div className="text-lg font-mono font-bold text-slate-300">{neurons[0]}</div>
          <div className="text-xs text-slate-400">INPUT</div>
        </div>
        <div className="bg-slate-900 border border-slate-500/30 p-3 rounded text-center">
          <div className="text-lg font-mono font-bold text-slate-300">{neurons[0]}</div>
          <div className="text-xs text-slate-400">HIDDEN</div>
        </div>
        <div className="bg-slate-900 border border-slate-500/30 p-3 rounded text-center">
          <div className="text-lg font-mono font-bold text-slate-300">3</div>
          <div className="text-xs text-slate-400">OUTPUT</div>
        </div>
        <div className="bg-slate-900 border border-slate-500/30 p-3 rounded text-center">
          <div className="text-lg font-mono font-bold text-slate-300">{neurons[0] * neurons[0] + neurons[0] * 3}</div>
          <div className="text-xs text-slate-400">WEIGHTS</div>
        </div>
        <div className="bg-slate-900 border border-slate-500/30 p-3 rounded text-center">
          <div className="text-lg font-mono font-bold text-slate-300">{(activation[0] * 100).toFixed(0)}%</div>
          <div className="text-xs text-slate-400">ACTIVE</div>
        </div>
      </div>
    </div>
  );
}

export default function AIDemosPage() {
  const [activeTab, setActiveTab] = useState("workflow");

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <ScrollReveal>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-center">
            AI Demos
          </h1>
          <p className="text-muted-foreground text-center mt-4 max-w-3xl mx-auto">
            Interactive demonstrations of AI technologies including LLMs, document QA, computer vision models, and automation workflows.
          </p>
        </ScrollReveal>

        <div className="mt-12">
          <ScrollReveal>
            <Tabs defaultValue="workflow" onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
              <TabsList className="grid grid-cols-5 mb-8 mx-auto max-w-2xl">
                <TabsTrigger value="workflow" className="flex items-center gap-2 text-xs">
                  <Workflow className="h-3 w-3" />
                  <span className="hidden sm:inline">N8N Workflow</span>
                  <span className="sm:hidden">N8N</span>
                </TabsTrigger>
                <TabsTrigger value="neural" className="flex items-center gap-2 text-xs">
                  <Network className="h-3 w-3" />
                  <span className="hidden sm:inline">Neural Network</span>
                  <span className="sm:hidden">Neural</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2 text-xs">
                  <MessagesSquare className="h-3 w-3" />
                  <span className="hidden sm:inline">Chat LLM</span>
                  <span className="sm:hidden">Chat</span>
                </TabsTrigger>
                <TabsTrigger value="document" className="flex items-center gap-2 text-xs">
                  <FileText className="h-3 w-3" />
                  <span className="hidden sm:inline">Document QA</span>
                  <span className="sm:hidden">Doc QA</span>
                </TabsTrigger>
                <TabsTrigger value="vision" className="flex items-center gap-2 text-xs">
                  <Video className="h-3 w-3" />
                  <span className="hidden sm:inline">YOLOv8</span>
                  <span className="sm:hidden">YOLO</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workflow" className="space-y-8">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="h-5 w-5 text-primary" />
                      N8N Workflow Automation
                    </CardTitle>
                    <CardDescription>
                      Visual workflow automation platform with real-time execution monitoring and step-by-step processing visualization.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <N8NWorkflowDemo />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="neural" className="space-y-8">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Interactive Neural Network
                    </CardTitle>
                    <CardDescription>
                      Real-time neural network visualization with adjustable parameters. Watch neurons activate and see how parameter changes affect the network structure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InteractiveNeuralNetwork />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="space-y-8">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      Chat with AI Assistant
                    </CardTitle>
                    <CardDescription>
                      This demo uses GPT-4 with function calling capabilities to create a versatile AI assistant that can perform various tasks.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-6 rounded-md flex flex-col gap-4">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-card p-3 rounded-lg rounded-tl-none border max-w-[80%]">
                          <p className="text-sm">Hello! I'm your AI assistant. I can help with various tasks like answering questions, generating content, or analyzing data. What would you like help with today?</p>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <div className="bg-primary/10 p-3 rounded-lg rounded-tr-none max-w-[80%]">
                          <p className="text-sm">Can you explain how Retrieval-Augmented Generation works?</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <span className="text-xs">You</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-card p-3 rounded-lg rounded-tl-none border max-w-[80%]">
                          <p className="text-sm">Retrieval-Augmented Generation (RAG) is an AI framework that combines the generative capabilities of large language models with the ability to retrieve information from external knowledge sources.</p>
                          <p className="text-sm mt-2">Here's how it works:</p>
                          <ol className="text-sm mt-1 ml-4 list-decimal">
                            <li>When a user asks a question, the system processes it</li>
                            <li>The system retrieves relevant documents from a knowledge base</li>
                            <li>These documents are then provided as context to the LLM</li>
                            <li>The LLM generates a response based on both its internal knowledge and the retrieved information</li>
                          </ol>
                          <p className="text-sm mt-2">RAG addresses key limitations of standard LLMs by providing up-to-date information, reducing hallucinations, and enabling access to specialized knowledge without fine-tuning.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button asChild>
                      <Link href="https://demo.aieng-portfolio.com/llm-chat">
                        Try Live Demo <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-center">How It Works</h3>
                  <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                    <div className="bg-card p-4 rounded-md border">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                        <span className="font-bold">1</span>
                      </div>
                      <h4 className="font-medium mb-2 text-center">Request Processing</h4>
                      <p className="text-sm text-muted-foreground text-center">User input is analyzed to understand intent and extract key parameters.</p>
                    </div>
                    <div className="bg-card p-4 rounded-md border">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                        <span className="font-bold">2</span>
                      </div>
                      <h4 className="font-medium mb-2 text-center">Function Calling</h4>
                      <p className="text-sm text-muted-foreground text-center">The LLM determines which functions to call based on the request and generates the appropriate parameters.</p>
                    </div>
                    <div className="bg-card p-4 rounded-md border">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                        <span className="font-bold">3</span>
                      </div>
                      <h4 className="font-medium mb-2 text-center">Response Generation</h4>
                      <p className="text-sm text-muted-foreground text-center">Function results are incorporated into a natural language response that addresses the user's request.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="document" className="space-y-8">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Document Q&A
                    </CardTitle>
                    <CardDescription>
                      Upload a PDF document and ask questions about its content. The system will analyze the document and provide relevant answers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-6 rounded-md flex flex-col gap-4">
                      <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 flex flex-col items-center justify-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center mb-2">
                          Drag and drop your PDF here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground text-center mb-4">
                          Supports PDF files up to 10MB
                        </p>
                        <Button variant="outline" size="sm">
                          Browse Files
                        </Button>
                      </div>
                      <div className="text-center text-muted-foreground text-sm">
                        Upload a document to start asking questions
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button asChild>
                      <Link href="https://demo.aieng-portfolio.com/document-qa">
                        Try Live Demo <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-center">How It Works</h3>
                  <div className="grid gap-6 md:grid-cols-4 max-w-4xl mx-auto">
                    <div className="bg-card p-4 rounded-md border">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                        <span className="font-bold">1</span>
                      </div>
                      <h4 className="font-medium mb-2 text-center">Document Parsing</h4>
                      <p className="text-sm text-muted-foreground text-center">PDF documents are processed and text is extracted.</p>
                    </div>
                    <div className="bg-card p-4 rounded-md border">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                        <span className="font-bold">2</span>
                      </div>
                      <h4 className="font-medium mb-2 text-center">Chunking</h4>
                      <p className="text-sm text-muted-foreground text-center">Text is divided into manageable chunks with appropriate overlaps.</p>
                    </div>
                    <div className="bg-card p-4 rounded-md border">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                        <span className="font-bold">3</span>
                      </div>
                      <h4 className="font-medium mb-2 text-center">Vector Storage</h4>
                      <p className="text-sm text-muted-foreground text-center">Text chunks are embedded and stored in a vector database for semantic search.</p>
                    </div>
                    <div className="bg-card p-4 rounded-md border">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-3 mx-auto">
                        <span className="font-bold">4</span>
                      </div>
                      <h4 className="font-medium mb-2 text-center">RAG Processing</h4>
                      <p className="text-sm text-muted-foreground text-center">User questions trigger semantic search and retrieval-augmented generation.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vision" className="space-y-8">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      YOLOv8 Computer Vision
                    </CardTitle>
                    <CardDescription>
                      Experience real-time object detection using YOLOv8 running on your webcam. Detect and track multiple objects with high accuracy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative overflow-hidden rounded-md border mx-auto">
                      <Image
                        src="https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="YOLOv8 Demo"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button variant="outline" size="lg" className="gap-2 bg-background/70 backdrop-blur-sm">
                          <Video className="h-5 w-5" />
                          Start Camera
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button asChild>
                      <Link href="https://demo.aieng-portfolio.com/yolov8-webcam">
                        Try Live Demo <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-center">Features</h3>
                  <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                    <div className="bg-card p-4 rounded-md border">
                      <div className="flex justify-center mb-3">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-medium mb-2 text-center">Real-time Detection</h4>
                      <p className="text-sm text-muted-foreground text-center">Identifies 80+ object classes in real-time with high precision and recall.</p>
                    </div>
                    <div className="bg-card p-4 rounded-md border">
                      <div className="flex justify-center mb-3">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-medium mb-2 text-center">Edge Computing</h4>
                      <p className="text-sm text-muted-foreground text-center">Uses WebGL acceleration to run directly in your browser without server processing.</p>
                    </div>
                    <div className="bg-card p-4 rounded-md border">
                      <div className="flex justify-center mb-3">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-medium mb-2 text-center">Privacy-First</h4>
                      <p className="text-sm text-muted-foreground text-center">All processing happens locally on your device. No video data leaves your computer.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="mt-20">
              <h2 className="text-2xl font-bold text-center mb-8">Other AI Capabilities</h2>
              <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto justify-items-center">
                <Card className="group hover:shadow-md transition-all hover:border-primary/20 w-full max-w-sm">
                  <CardHeader>
                    <CardTitle className="text-center">Time-Series Forecasting</CardTitle>
                    <CardDescription className="text-center">
                      Transformer-based time-series prediction models with multi-horizon capabilities.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative overflow-hidden rounded-md bg-muted">
                      <Image
                        src="https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Time-Series Forecasting"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/projects/time-series-forecasting">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="group hover:shadow-md transition-all hover:border-primary/20 w-full max-w-sm">
                  <CardHeader>
                    <CardTitle className="text-center">Multimodal RAG</CardTitle>
                    <CardDescription className="text-center">
                      RAG system that can process and respond to queries about text, images, and audio content.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative overflow-hidden rounded-md bg-muted">
                      <Image
                        src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Multimodal RAG"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/projects/multimodal-rag">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="group hover:shadow-md transition-all hover:border-primary/20 w-full max-w-sm">
                  <CardHeader>
                    <CardTitle className="text-center">Model Compression</CardTitle>
                    <CardDescription className="text-center">
                      Techniques for compressing large AI models for edge deployment while maintaining accuracy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video relative overflow-hidden rounded-md bg-muted">
                      <Image
                        src="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Model Compression"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/projects/cv-model-compression">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}