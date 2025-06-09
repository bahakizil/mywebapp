"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Play, Pause, Activity, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkflowNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'trigger' | 'action' | 'condition' | 'notification';
  status: 'idle' | 'running' | 'success' | 'error';
}

interface WorkflowConnection {
  from: string;
  to: string;
  condition: string;
}

const workflowNodes: WorkflowNode[] = [
  { id: "webhook", name: "Webhook", x: 100, y: 160, type: "trigger", status: "idle" },
  { id: "auth", name: "Auth Check", x: 280, y: 120, type: "condition", status: "idle" },
  { id: "validate", name: "Validate Data", x: 280, y: 200, type: "condition", status: "idle" },
  { id: "transform", name: "Transform", x: 460, y: 160, type: "action", status: "idle" },
  { id: "cache", name: "Cache", x: 640, y: 100, type: "action", status: "idle" },
  { id: "db_save", name: "Database", x: 640, y: 160, type: "action", status: "idle" },
  { id: "queue", name: "Queue Job", x: 640, y: 220, type: "action", status: "idle" },
  { id: "email", name: "Send Email", x: 820, y: 100, type: "notification", status: "idle" },
  { id: "slack", name: "Slack Alert", x: 820, y: 160, type: "notification", status: "idle" },
  { id: "cleanup", name: "Cleanup", x: 820, y: 220, type: "action", status: "idle" }
];

const workflowConnections: WorkflowConnection[] = [
  { from: "webhook", to: "auth", condition: "authenticated" },
  { from: "webhook", to: "validate", condition: "valid_payload" },
  { from: "auth", to: "transform", condition: "success" },
  { from: "validate", to: "transform", condition: "valid" },
  { from: "transform", to: "cache", condition: "cache_enabled" },
  { from: "transform", to: "db_save", condition: "save_data" },
  { from: "transform", to: "queue", condition: "async_process" },
  { from: "cache", to: "email", condition: "notify_cache" },
  { from: "db_save", to: "slack", condition: "notify_success" },
  { from: "queue", to: "cleanup", condition: "cleanup_required" }
];

export function N8NWorkflowDemo() {
  const [currentNodes, setCurrentNodes] = useState<WorkflowNode[]>(workflowNodes);
  const [isRunning, setIsRunning] = useState(false);
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set());
  const [executionStep, setExecutionStep] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!isRunning) return;

    const executeWorkflow = async () => {
      const steps = [
        { nodeIds: ["webhook"], delay: 500 },
        { nodeIds: ["auth", "validate"], delay: 800 },
        { nodeIds: ["transform"], delay: 600 },
        { nodeIds: ["cache", "db_save", "queue"], delay: 700 },
        { nodeIds: ["email", "slack", "cleanup"], delay: 500 }
      ];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        setExecutionStep(i);

        // Set nodes to running
        setCurrentNodes(prev => 
          prev.map(node => 
            step.nodeIds.includes(node.id) 
              ? { ...node, status: 'running' as const }
              : node
          )
        );

        // Activate connections
        const connectionsToActivate = workflowConnections.filter(conn => 
          step.nodeIds.includes(conn.from)
        );
        setActiveConnections(new Set(connectionsToActivate.map(conn => `${conn.from}-${conn.to}`)));

        await new Promise(resolve => setTimeout(resolve, step.delay));

        // Set nodes to success
        setCurrentNodes(prev => 
          prev.map(node => 
            step.nodeIds.includes(node.id) 
              ? { ...node, status: 'success' as const }
              : node
          )
        );

        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Reset after completion
      setTimeout(() => {
        setIsRunning(false);
        setActiveConnections(new Set());
        setCurrentNodes(workflowNodes.map(node => ({ ...node, status: 'idle' })));
        setExecutionStep(0);
      }, 1000);
    };

    executeWorkflow();
  }, [isRunning]);

  const toggleExecution = () => {
    if (isRunning) {
      setIsRunning(false);
      setActiveConnections(new Set());
      setCurrentNodes(workflowNodes.map(node => ({ ...node, status: 'idle' })));
      setExecutionStep(0);
    } else {
      setIsRunning(true);
    }
  };

  const getNodeColor = (node: WorkflowNode) => {
    switch (node.status) {
      case 'running': return '#f59e0b';
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      default: 
        switch (node.type) {
          case 'trigger': return '#3b82f6';
          case 'condition': return '#8b5cf6';
          case 'action': return '#06b6d4';
          case 'notification': return '#f59e0b';
          default: return '#6b7280';
        }
    }
  };

  const getNodeIcon = (node: WorkflowNode) => {
    switch (node.status) {
      case 'running': return <Clock className="h-5 w-5" />;
      case 'success': return <CheckCircle2 className="h-5 w-5" />;
      case 'error': return <AlertCircle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      className="bg-card/50 backdrop-blur-sm border rounded-lg p-4 h-[450px] flex flex-col"
      style={{
        borderColor: isRunning ? '#64748b' : undefined,
        boxShadow: isRunning ? '0 0 30px rgba(0, 0, 0, 0.4)' : undefined
      }}
      animate={isRunning ? {
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
              rotate: isRunning ? 360 : 0,
              scale: isRunning ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 4, repeat: isRunning ? Infinity : 0, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              filter: isRunning ? 'drop-shadow(0 0 20px #64748b)' : 'none'
            }}
          >
            <GitBranch className="h-6 w-6" />
          </motion.div>
          <div>
            <h3 className="font-bold text-lg text-foreground">N8N Workflow</h3>
            <p className="text-sm text-slate-300 font-medium">
              {isRunning 
                ? `Executing Step ${executionStep + 1}/5...` 
                : 'Automation Pipeline Ready'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-mono text-foreground font-bold">
              {currentNodes.filter(n => n.status === 'success').length}/{currentNodes.length}
            </div>
            <div className="text-xs text-slate-300 font-medium">Completed</div>
          </div>

          <Button
            onClick={toggleExecution}
            size="sm"
            className={`px-4 py-2 font-bold transition-all duration-300 ${
              isRunning 
                ? 'bg-slate-600/30 border-2 border-slate-400 text-slate-100' 
                : 'bg-slate-600/30 border-2 border-slate-400 text-slate-100'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Execute
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Professional Workflow Visualization */}
      <div className="flex-1 relative rounded-lg overflow-hidden border border-slate-600/40">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)'
          }}
        >
          {/* Professional Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="professionalWorkflowGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#64748b" strokeWidth="0.5" opacity="0.4"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#professionalWorkflowGrid)" />
            </svg>
          </div>

          <svg 
            ref={svgRef}
            className="w-full h-full" 
            viewBox="0 0 1000 320"
            style={{ overflow: 'visible' }}
          >
            {/* Professional Connections */}
            {workflowConnections.map((conn, index) => {
              const fromNode = currentNodes.find(n => n.id === conn.from);
              const toNode = currentNodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const isActive = activeConnections.has(`${conn.from}-${conn.to}`);
              const isSuccessPath = fromNode.status === 'success' && toNode.status !== 'idle';

              return (
                <g key={`${conn.from}-${conn.to}`}>
                  {/* Connection Line */}
                  <motion.line
                    x1={fromNode.x + 35}
                    y1={fromNode.y}
                    x2={toNode.x - 35}
                    y2={toNode.y}
                    stroke={isActive ? "#06b6d4" : isSuccessPath ? "#10b981" : "#475569"}
                    strokeWidth={isActive ? "4" : isSuccessPath ? "3" : "2"}
                    opacity={isActive ? "1" : isSuccessPath ? "0.8" : "0.4"}
                    animate={isActive ? {
                      strokeWidth: [4, 6, 4],
                      opacity: [1, 0.7, 1]
                    } : {}}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      filter: isActive ? 'drop-shadow(0 0 8px #06b6d4)' : isSuccessPath ? 'drop-shadow(0 0 6px #10b981)' : 'none'
                    }}
                  />

                  {/* Arrow */}
                  <motion.polygon
                    points={`${toNode.x - 35},${toNode.y - 6} ${toNode.x - 25},${toNode.y} ${toNode.x - 35},${toNode.y + 6}`}
                    fill={isActive ? "#06b6d4" : isSuccessPath ? "#10b981" : "#475569"}
                    opacity={isActive ? "1" : isSuccessPath ? "0.8" : "0.6"}
                    animate={isActive ? {
                      scale: [1, 1.3, 1]
                    } : {}}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      filter: isActive ? 'drop-shadow(0 0 6px #06b6d4)' : isSuccessPath ? 'drop-shadow(0 0 4px #10b981)' : 'none'
                    }}
                  />

                  {/* Data Flow Animation */}
                  {isActive && (
                    <motion.circle
                      r="4"
                      fill="#ffffff"
                      initial={{ 
                        cx: fromNode.x + 35, 
                        cy: fromNode.y,
                        opacity: 0.8
                      }}
                      animate={{ 
                        cx: toNode.x - 35, 
                        cy: toNode.y,
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ 
                        duration: 0.8, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      style={{
                        filter: 'drop-shadow(0 0 8px #ffffff)'
                      }}
                    />
                  )}
                </g>
              );
            })}

            {/* Professional Workflow Nodes */}
            {currentNodes.map((node, index) => {
              const nodeColor = getNodeColor(node);
              const isActive = node.status === 'running';
              const isSuccess = node.status === 'success';

              return (
                <g key={node.id}>
                  {/* Node Glow Effect */}
                  {(isActive || isSuccess) && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="45"
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth="2"
                      opacity="0.6"
                      animate={{
                        r: [45, 55, 45],
                        opacity: [0.6, 0.8, 0.6]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        filter: `drop-shadow(0 0 20px ${nodeColor})`
                      }}
                    />
                  )}

                  {/* Main Node */}
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="30"
                    fill={`url(#nodeGradient-${node.id})`}
                    stroke={nodeColor}
                    strokeWidth={isActive ? "4" : "3"}
                    animate={isActive ? {
                      r: [30, 33, 30],
                      strokeWidth: [4, 5, 4]
                    } : {}}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      filter: isActive || isSuccess 
                        ? `drop-shadow(0 0 15px ${nodeColor}) drop-shadow(0 0 30px ${nodeColor}60)` 
                        : 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
                    }}
                  />

                  {/* Node Icon */}
                  <motion.g
                    transform={`translate(${node.x - 10}, ${node.y - 10})`}
                    animate={isActive ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 360, 0]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <foreignObject x="0" y="0" width="20" height="20">
                      <div 
                        className="flex items-center justify-center w-5 h-5"
                        style={{ 
                          color: isActive || isSuccess ? '#ffffff' : nodeColor,
                          filter: isActive ? 'drop-shadow(0 0 8px #ffffff)' : 'none'
                        }}
                      >
                        {getNodeIcon(node)}
                      </div>
                    </foreignObject>
                  </motion.g>

                  {/* Node Label */}
                  <motion.text
                    x={node.x}
                    y={node.y + 50}
                    textAnchor="middle"
                    className="text-xs font-bold fill-current"
                    style={{ 
                      fill: isActive || isSuccess ? nodeColor : '#94a3b8',
                      filter: isActive || isSuccess ? `drop-shadow(0 0 8px ${nodeColor})` : 'none'
                    }}
                    animate={isActive ? {
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {node.name}
                  </motion.text>

                  {/* Status Indicator */}
                  {node.status !== 'idle' && (
                    <motion.circle
                      cx={node.x + 22}
                      cy={node.y - 22}
                      r="6"
                      fill={nodeColor}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        filter: `drop-shadow(0 0 8px ${nodeColor})`
                      }}
                    />
                  )}

                  {/* Gradient Definition */}
                  <defs>
                    <radialGradient id={`nodeGradient-${node.id}`} cx="30%" cy="30%">
                      <stop offset="0%" stopColor={isActive || isSuccess ? "#ffffff" : "#f8fafc"} />
                      <stop offset="60%" stopColor={isActive || isSuccess ? nodeColor : "#e2e8f0"} />
                      <stop offset="100%" stopColor={isActive || isSuccess ? nodeColor : "#64748b"} />
                    </radialGradient>
                  </defs>
                </g>
              );
            })}

            {/* Execution Progress Indicator */}
            {isRunning && (
              <motion.g>
                <motion.rect
                  x="10"
                  y="10"
                  width="200"
                  height="20"
                  rx="10"
                  fill="rgba(15, 23, 42, 0.8)"
                  stroke="#06b6d4"
                  strokeWidth="2"
                />
                <motion.rect
                  x="12"
                  y="12"
                  width={`${(executionStep / 4) * 196}`}
                  height="16"
                  rx="8"
                  fill="url(#progressGradient)"
                  animate={{
                    width: `${(executionStep / 4) * 196}px`
                  }}
                  transition={{ duration: 0.5 }}
                />
                <text
                  x="110"
                  y="25"
                  textAnchor="middle"
                  className="text-xs font-bold fill-cyan-300"
                  style={{ filter: 'drop-shadow(0 0 4px #06b6d4)' }}
                >
                  {Math.round((executionStep / 4) * 100)}% Complete
                </text>

                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                </defs>
              </motion.g>
            )}
          </svg>

          {/* Professional Status Panel */}
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur rounded-lg p-3 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-2">
              <motion.div 
                className={`w-3 h-3 rounded-full ${isRunning ? 'bg-cyan-400' : 'bg-slate-500'}`}
                animate={isRunning ? {
                  scale: [1, 1.3, 1],
                  boxShadow: [
                    '0 0 5px rgba(6, 182, 212, 0.5)',
                    '0 0 15px rgba(6, 182, 212, 0.8)',
                    '0 0 5px rgba(6, 182, 212, 0.5)'
                  ]
                } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-xs font-mono text-cyan-200 font-semibold">
                {isRunning ? 'EXECUTING' : 'READY'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Nodes:</span>
                <span className="ml-2 font-mono text-cyan-200">{currentNodes.length}</span>
              </div>
              <div>
                <span className="text-slate-400">Status:</span>
                <span className="ml-2 font-mono text-emerald-200">
                  {currentNodes.filter(n => n.status === 'success').length}✓
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Execution Summary */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">Workflow:</span>
            <span className="font-bold text-cyan-100">Data Processing Pipeline</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-300 font-semibold">Avg Time:</span>
            <span className="font-bold text-emerald-100">3.2s</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span className="text-green-300 font-semibold">Success Rate:</span>
            <span className="font-bold text-green-100">99.8%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 