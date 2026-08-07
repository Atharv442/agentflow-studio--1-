export type ViewType = 
  | 'dashboard'
  | 'workflows'
  | 'agents'
  | 'templates'
  | 'settings'
  | 'account';

export type NodeStatus = 'idle' | 'running' | 'completed' | 'error' | 'waiting';

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  model: string;
  whyModelSelected: string;
  status: NodeStatus;
  executionTime: number; // in seconds
  cost: number; // in INR (₹)
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  confidenceScore: number; // 0-100
  position: { x: number; y: number };
  systemPrompt: string;
  temperature: number;
  toolsUsed: string[];
  inputPayload: string;
  outputPayload: string;
  reasoningSummary: string;
  thinkingLogs?: string[];
  memoryKeysAccessed: string[];
  modelSwitchHistory: {
    timestamp: string;
    fromModel: string;
    toModel: string;
    reason: string;
  }[];
  latencyMs: number;
  iconName: string;
  colorScheme: 'blue' | 'purple' | 'emerald' | 'cyan' | 'amber' | 'rose';
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  active?: boolean;
  dataFlowType?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  agentId?: string;
  agentName?: string;
  level: 'info' | 'warn' | 'error' | 'tool' | 'thinking' | 'success';
  message: string;
  details?: string;
  payload?: Record<string, unknown>;
}

export interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Equity Research' | 'Due Diligence' | 'Cybersecurity' | 'Product & Strategy';
  nodeCount: number;
  estCost: string;
  avgLatency: string;
  accuracyRating: number;
  tags: string[];
  nodes: AgentNode[];
  edges: WorkflowEdge[];
}

export interface MemoryItem {
  id: string;
  key: string;
  value: string;
  scope: 'global' | 'agent_private' | 'shared_pipeline';
  sourceAgent: string;
  updatedAt: string;
  vectorDimensions?: number;
  similarityScore?: number;
}

export interface EvaluationResult {
  id: string;
  runName: string;
  timestamp: string;
  overallScore: number;
  hallucinationRate: number;
  factualityScore: number;
  latencySeconds: number;
  costUsd: number;
  agentCount: number;
  judgeFeedback: string;
}

export interface AnalyticsSummary {
  totalCost7d: number;
  totalTokens7d: number;
  avgLatencySec: number;
  successRatePercent: number;
  modelRoutingSavingsUsd: number;
  dailyCosts: { date: string; cost: number; tokens: number }[];
  agentTokenDistribution: { name: string; tokens: number; cost: number }[];
  singleVsMulti: {
    metric: string;
    singleAgent: number;
    multiAgent: number;
    unit: string;
  }[];
}
