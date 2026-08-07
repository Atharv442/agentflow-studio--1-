import { AgentNode, WorkflowEdge, LogEntry, WorkflowTemplate, MemoryItem, EvaluationResult, AnalyticsSummary } from '../types';

export const INITIAL_NODES: AgentNode[] = [
  {
    id: 'planner',
    name: 'Planner Agent',
    role: 'Decomposes complex objective into structured execution subtasks & routing rules.',
    model: 'gemini-3.1-pro-preview',
    whyModelSelected: 'High structural reasoning capacity with deep chain-of-thought thinking required for orchestration.',
    status: 'completed',
    executionTime: 1.12,
    cost: 1.50,
    tokens: { prompt: 1420, completion: 890, total: 2310 },
    confidenceScore: 98,
    position: { x: 80, y: 180 },
    systemPrompt: 'You are the Master Planner Agent. Break down the user prompt into sub-tasks for Research, Market Analysis, and Finance agents. Include verification checkpoints.',
    temperature: 0.2,
    toolsUsed: ['workflow_decomposition', 'task_graph_builder'],
    inputPayload: JSON.stringify({ goal: 'Conduct 360 Enterprise SWOT & Valuation for NVIDIA Q2 2026', scope: 'Global Semiconductors' }, null, 2),
    outputPayload: JSON.stringify({
      subtasks: [
        { id: 1, agent: 'Research Agent', topic: 'Latest earnings report, Blackwell GPU adoption & supply chain news' },
        { id: 2, agent: 'Market Analysis Agent', topic: 'Competitive analysis vs AMD, Broadcom, Custom ASIC trends' },
        { id: 3, agent: 'Finance Agent', topic: 'DCF valuation, P/E multiples & margin trajectory analysis' }
      ],
      executionStrategy: 'parallel_branch_then_merge'
    }, null, 2),
    reasoningSummary: 'Created a 3-branch parallel execution plan. Isolated financial modeling from qualitative market sentiment to avoid bias.',
    thinkingLogs: [
      'Evaluating complexity of NVIDIA Q2 2026 valuation objective...',
      'Determined optimal decomposition: 3 parallel domain branches (Research, Market, Finance).',
      'Configuring strict JSON schema contract for downstream merging by Verification Agent.'
    ],
    memoryKeysAccessed: ['global.enterprise_context', 'shared.market_benchmarks'],
    modelSwitchHistory: [
      { timestamp: '10:14:02', fromModel: 'gemini-3.6-flash', toModel: 'gemini-3.1-pro-preview', reason: 'Upgraded due to high reasoning task classification score (0.94)' }
    ],
    latencyMs: 1120,
    iconName: 'BrainCircuit',
    colorScheme: 'purple'
  },
  {
    id: 'research',
    name: 'Research Agent',
    role: 'Gathers live web intelligence, news, earnings transcripts, and regulatory filings.',
    model: 'gemini-3.6-flash',
    whyModelSelected: 'High speed and low cost for fast web search processing and real-time grounding.',
    status: 'completed',
    executionTime: 0.85,
    cost: 0.33,
    tokens: { prompt: 3200, completion: 1450, total: 4650 },
    confidenceScore: 95,
    position: { x: 420, y: 60 },
    systemPrompt: 'Search official web sources and SEC filings. Extract key qualitative catalysts and headwinds.',
    temperature: 0.3,
    toolsUsed: ['google_search', 'sec_edgar_reader', 'web_scraper'],
    inputPayload: JSON.stringify({ task: 'Fetch NVIDIA Q2 2026 Blackwell GPU shipment figures & datacenter revenue growth' }, null, 2),
    outputPayload: JSON.stringify({
      datacenterRevenueGrowthYoY: '+124%',
      keyHighlights: [
        'Blackwell Ultra GB200 NVL72 shipping in volume',
        'Hyperscaler CapEx commitments reaching $220B in 2026',
        'Supply chain bottlenecks easing at TSMC CoWoS packaging'
      ],
      sources: ['SEC Form 10-Q', 'Reuters', 'Bloomberg Technology']
    }, null, 2),
    reasoningSummary: 'Grounded findings across 14 verified articles and 2 SEC filings. High consensus on Blackwell demand.',
    memoryKeysAccessed: ['shared.web_grounding_cache'],
    modelSwitchHistory: [],
    latencyMs: 850,
    iconName: 'Globe',
    colorScheme: 'blue'
  },
  {
    id: 'market',
    name: 'Market Analysis Agent',
    role: 'Analyzes competitive landscape, TAM expansion, and market positioning.',
    model: 'gemini-3.6-flash',
    whyModelSelected: 'Optimal for multi-source comparative intelligence and rapid synthesis.',
    status: 'completed',
    executionTime: 0.92,
    cost: 0.42,
    tokens: { prompt: 2800, completion: 1200, total: 4000 },
    confidenceScore: 94,
    position: { x: 420, y: 220 },
    systemPrompt: 'Evaluate AI accelerator market share trends. Compare NVIDIA CUDA moat vs AMD ROCm & Custom ASICs.',
    temperature: 0.4,
    toolsUsed: ['market_share_calculator', 'swot_matrix_generator'],
    inputPayload: JSON.stringify({ focus: 'Competitive moat analysis vs AMD MI350 & Google TPU v6' }, null, 2),
    outputPayload: JSON.stringify({
      marketShare: { nvidia: '84%', amd: '10%', others: '6%' },
      moatRating: 'Very High (CUDA ecosystem & NVLink interconnect standard)',
      threats: ['Custom ASIC adoption at Amazon & Meta', 'Export restriction expansion']
    }, null, 2),
    reasoningSummary: 'Assessed CUDA software stickiness alongside hardware performance benchmarks.',
    memoryKeysAccessed: ['shared.competitor_database'],
    modelSwitchHistory: [],
    latencyMs: 920,
    iconName: 'BarChart3',
    colorScheme: 'cyan'
  },
  {
    id: 'finance',
    name: 'Finance Agent',
    role: 'Performs quantitative DCF valuation, EPS forecasting, and ratio comparisons.',
    model: 'gemini-3.1-pro-preview',
    whyModelSelected: 'Precision math reasoning required for financial modeling and multi-year projection tables.',
    status: 'completed',
    executionTime: 1.35,
    cost: 1.00,
    tokens: { prompt: 2100, completion: 1800, total: 3900 },
    confidenceScore: 97,
    position: { x: 420, y: 380 },
    systemPrompt: 'Build a 5-year discounted cash flow model. Calculate intrinsic share price target and sensitivity table.',
    temperature: 0.1,
    toolsUsed: ['dcf_calculator', 'financial_ratio_engine'],
    inputPayload: JSON.stringify({ WACC: 9.5, terminalGrowth: 3.5, baseRevenue: 130000 }, null, 2),
    outputPayload: JSON.stringify({
      intrinsicValuePerShare: '₹14,200',
      forwardPE: '32.4x',
      grossMarginTarget: '74.2%',
      bullCasePrice: '₹17,800',
      bearCasePrice: '₹10,600'
    }, null, 2),
    reasoningSummary: 'Calculated 5-year DCF using 9.5% WACC reflecting AI hardware growth cycle.',
    memoryKeysAccessed: ['shared.financial_multiples'],
    modelSwitchHistory: [],
    latencyMs: 1350,
    iconName: 'TrendingUp',
    colorScheme: 'emerald'
  },
  {
    id: 'verification',
    name: 'Verification Agent',
    role: 'Fact-checks cross-agent output, cross-references numbers, and enforces policy constraints.',
    model: 'gemini-3.6-flash',
    whyModelSelected: 'Fast schema and citation validation guardrail node.',
    status: 'completed',
    executionTime: 0.42,
    cost: 0.17,
    tokens: { prompt: 1900, completion: 450, total: 2350 },
    confidenceScore: 99,
    position: { x: 760, y: 150 },
    systemPrompt: 'You are the Guardrail Fact-Checker. Compare numbers between Research, Market, and Finance agents. Flag discrepancies.',
    temperature: 0.0,
    toolsUsed: ['fact_check_validator', 'math_verifier'],
    inputPayload: JSON.stringify({ checkTargets: ['Datacenter revenue', 'DCF intrinsic target', 'Competitor market share'] }, null, 2),
    outputPayload: JSON.stringify({
      verificationPassed: true,
      hallucinationDetected: false,
      discrepancyCount: 0,
      confidenceScore: 0.99
    }, null, 2),
    reasoningSummary: 'Validated financial calculations against Research findings. All 18 key data points match source material.',
    memoryKeysAccessed: ['shared.fact_check_index'],
    modelSwitchHistory: [],
    latencyMs: 420,
    iconName: 'ShieldCheck',
    colorScheme: 'amber'
  },
  {
    id: 'report',
    name: 'Report Agent',
    role: 'Synthesizes verified research into an executive PDF/Markdown report with visual tables.',
    model: 'gemini-3.6-flash',
    whyModelSelected: 'Excellent high-throughput markdown document generation.',
    status: 'completed',
    executionTime: 0.65,
    cost: 0.25,
    tokens: { prompt: 3800, completion: 2100, total: 5900 },
    confidenceScore: 96,
    position: { x: 1040, y: 220 },
    systemPrompt: 'Produce an executive research dossier with executive summary, SWOT grid, DCF table, and investment thesis.',
    temperature: 0.3,
    toolsUsed: ['markdown_formatter', 'chart_exporter'],
    inputPayload: JSON.stringify({ outputFormat: 'Executive Dossier (Markdown)', includeCharts: true }, null, 2),
    outputPayload: `# EXECUTIVE INVESTMENT DOSSIER: NVIDIA CORP (NVDA)

## 1. Executive Summary
NVIDIA continues to demonstrate dominant pricing power and market leadership in the AI accelerator sector (84% market share). DCF modeling yields an intrinsic value of **₹14,200/share** (+24% upside).

## 2. Quantitative Financial Projections
- **Datacenter Growth**: +124% YoY
- **Gross Margins**: 74.2% (sustained)
- **Forward P/E**: 32.4x

## 3. Key Catalysts & Moats
1. **Blackwell NVL72 Ramps**: Massive adoption among Tier-1 Cloud Service Providers.
2. **CUDA Software Moat**: Unrivaled developer ecosystem retention.

*Report compiled by AgentFlow Multi-Agent Pipeline.*`,
    reasoningSummary: 'Formatted all agent findings into structured C-suite executive briefing with tables and action items.',
    memoryKeysAccessed: ['shared.final_dossier_output'],
    modelSwitchHistory: [],
    latencyMs: 650,
    iconName: 'FileText',
    colorScheme: 'rose'
  }
];

export const INITIAL_EDGES: WorkflowEdge[] = [
  { id: 'e1', source: 'planner', target: 'research', label: 'Task #1: Web Research', animated: true, active: true },
  { id: 'e2', source: 'planner', target: 'market', label: 'Task #2: Market Share', animated: true, active: true },
  { id: 'e3', source: 'planner', target: 'finance', label: 'Task #3: Financial Model', animated: true, active: true },
  { id: 'e4', source: 'research', target: 'verification', label: 'Qualitative Data', animated: true, active: true },
  { id: 'e5', source: 'market', target: 'verification', label: 'Competitor Matrix', animated: true, active: true },
  { id: 'e6', source: 'finance', target: 'verification', label: 'Valuation Table', animated: true, active: true },
  { id: 'e7', source: 'verification', target: 'report', label: 'Verified Payload', animated: true, active: true }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'l1',
    timestamp: '01:10:01',
    agentId: 'planner',
    agentName: 'Planner Agent',
    level: 'info',
    message: 'Pipeline initialized with goal: NVIDIA Q2 2026 Equity Research.',
    details: 'Initiated sub-graph routing logic. Selected gemini-3.1-pro-preview for high reasoning decomposition.'
  },
  {
    id: 'l2',
    timestamp: '01:10:02',
    agentId: 'planner',
    agentName: 'Planner Agent',
    level: 'thinking',
    message: 'Thinking Process: Analyzing subtask dependence matrix...',
    details: 'Determined parallel execution for Research, Market, and Finance agents will reduce execution latency by 68%.'
  },
  {
    id: 'l3',
    timestamp: '01:10:03',
    agentId: 'research',
    agentName: 'Research Agent',
    level: 'tool',
    message: 'Invoked tool: google_search("NVIDIA Q2 2026 Blackwell GPU revenue")',
    details: 'Retrieved 14 verified articles & 2 SEC 10-Q filing documents.'
  },
  {
    id: 'l4',
    timestamp: '01:10:04',
    agentId: 'finance',
    agentName: 'Finance Agent',
    level: 'tool',
    message: 'Invoked tool: dcf_calculator(WACC=0.095, TerminalGrowth=0.035)',
    details: 'Intrinsic target value computed: ₹14,200 per share.'
  },
  {
    id: 'l5',
    timestamp: '01:10:05',
    agentId: 'verification',
    agentName: 'Verification Agent',
    level: 'success',
    message: 'Guardrail fact-check passed. Zero discrepancies found across 18 data points.',
    details: 'Confidence rating: 99.1%.'
  },
  {
    id: 'l6',
    timestamp: '01:10:06',
    agentId: 'report',
    agentName: 'Report Agent',
    level: 'success',
    message: 'Final Executive Investment Dossier synthesized & formatted in Markdown.',
    details: 'Pipeline finished in 4.29s with ₹3.67 total execution cost.'
  }
];

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 't1',
    title: 'Enterprise Equity & Market Research Pipeline',
    description: 'Comprehensive 6-agent orchestration for Wall Street equity analysis, DCF modeling, competitive moat verification, and report synthesis.',
    category: 'Equity Research',
    nodeCount: 6,
    estCost: '₹3.67 / run',
    avgLatency: '4.3s',
    accuracyRating: 99.2,
    tags: ['Wall Street', 'Valuation', 'DCF', 'Web Search', 'Fact-Check'],
    nodes: INITIAL_NODES,
    edges: INITIAL_EDGES
  },
  {
    id: 't2',
    title: 'Startup Due Diligence & Financial Health Check',
    description: 'Deconstructs startup pitch decks, cap tables, churn metrics, and competitive moat risks with automated red-flag detection.',
    category: 'Due Diligence',
    nodeCount: 5,
    estCost: '₹2.58 / run',
    avgLatency: '3.6s',
    accuracyRating: 98.7,
    tags: ['Venture Capital', 'Cap Table', 'Red Flags', 'SaaS Metrics'],
    nodes: INITIAL_NODES.slice(0, 5),
    edges: INITIAL_EDGES.slice(0, 5)
  },
  {
    id: 't3',
    title: 'Autonomous Cybersecurity Threat Hunter',
    description: 'Monitors threat feeds, parses CVE disclosures, verifies zero-day severity, and auto-generates remediation scripts.',
    category: 'Cybersecurity',
    nodeCount: 4,
    estCost: '₹1.83 / run',
    avgLatency: '2.8s',
    accuracyRating: 99.8,
    tags: ['CVE', 'Zero-Day', 'SOC 2', 'Automated Patching'],
    nodes: INITIAL_NODES.slice(0, 4),
    edges: INITIAL_EDGES.slice(0, 3)
  },
  {
    id: 't4',
    title: 'Product PRD & Architecture Synthesizer',
    description: 'Transforms raw customer feedback & telemetry logs into structured feature specifications and database schemas.',
    category: 'Product & Strategy',
    nodeCount: 5,
    estCost: '₹3.17 / run',
    avgLatency: '4.1s',
    accuracyRating: 97.9,
    tags: ['Product Management', 'PRD', 'System Design', 'User Stories'],
    nodes: INITIAL_NODES.slice(1, 6),
    edges: INITIAL_EDGES.slice(1, 6)
  }
];

export const MEMORY_ITEMS: MemoryItem[] = [
  {
    id: 'm1',
    key: 'global.enterprise_context',
    value: 'Target Firm: NVIDIA Corp (NVDA). Industry: Semiconductors & AI Hardware. Base Currency: INR.',
    scope: 'global',
    sourceAgent: 'System Initialization',
    updatedAt: '2026-08-07 01:05',
    vectorDimensions: 1536
  },
  {
    id: 'm2',
    key: 'shared.market_benchmarks',
    value: 'Average AI hardware P/E multiple: 31.5x. Risk-free rate (India 10Y G-Sec): 6.8%. Cost of Equity: 10.2%.',
    scope: 'shared_pipeline',
    sourceAgent: 'Planner Agent',
    updatedAt: '2026-08-07 01:08',
    vectorDimensions: 1536,
    similarityScore: 0.92
  },
  {
    id: 'm3',
    key: 'agent.research.search_cache',
    value: 'Cached web search queries for Blackwell GPU yield rates and TSMC CoWoS capacity allocations.',
    scope: 'agent_private',
    sourceAgent: 'Research Agent',
    updatedAt: '2026-08-07 01:09',
    vectorDimensions: 1536,
    similarityScore: 0.88
  },
  {
    id: 'm4',
    key: 'shared.dcf_assumptions',
    value: 'Discount Rate (WACC): 9.5%. Terminal Growth Rate: 3.5%. Revenue CAGR (2026-2030): 28.4%.',
    scope: 'shared_pipeline',
    sourceAgent: 'Finance Agent',
    updatedAt: '2026-08-07 01:10',
    vectorDimensions: 1536,
    similarityScore: 0.95
  }
];

export const EVALUATION_RESULTS: EvaluationResult[] = [
  {
    id: 'e1',
    runName: 'NVDA Q2 Valuation Pipeline Run #142',
    timestamp: '2026-08-07 01:10',
    overallScore: 98.4,
    hallucinationRate: 0.2,
    factualityScore: 99.6,
    latencySeconds: 4.29,
    costUsd: 3.67,
    agentCount: 6,
    judgeFeedback: 'Flawless execution. All numbers cross-verified against official SEC 10-Q filing. High reasoning fidelity from Planner Agent.'
  },
  {
    id: 'e2',
    runName: 'AMD Competitive SWOT Benchmark',
    timestamp: '2026-08-07 00:45',
    overallScore: 96.2,
    hallucinationRate: 0.8,
    factualityScore: 98.2,
    latencySeconds: 3.82,
    costUsd: 2.67,
    agentCount: 5,
    judgeFeedback: 'Strong performance. Minor delay on web grounding search for ROCm software release notes.'
  },
  {
    id: 'e3',
    runName: 'SaaS Startup Due Diligence Test',
    timestamp: '2026-08-06 22:15',
    overallScore: 97.8,
    hallucinationRate: 0.4,
    factualityScore: 99.1,
    latencySeconds: 3.51,
    costUsd: 2.42,
    agentCount: 5,
    judgeFeedback: 'Accurately flagged red flags in customer concentration metrics.'
  }
];

export const ANALYTICS_DATA: AnalyticsSummary = {
  totalCost7d: 10362.50,
  totalTokens7d: 14250000,
  avgLatencySec: 3.94,
  successRatePercent: 99.4,
  modelRoutingSavingsUsd: 15288.60,
  dailyCosts: [
    { date: 'Aug 1', cost: 1029.2, tokens: 1400000 },
    { date: 'Aug 2', cost: 1311.4, tokens: 1800000 },
    { date: 'Aug 3', cost: 1178.6, tokens: 1600000 },
    { date: 'Aug 4', cost: 1568.7, tokens: 2100000 },
    { date: 'Aug 5', cost: 1834.3, tokens: 2500000 },
    { date: 'Aug 6', cost: 1618.5, tokens: 2200000 },
    { date: 'Aug 7', cost: 1821.8, tokens: 2650000 }
  ],
  agentTokenDistribution: [
    { name: 'Planner Agent', tokens: 3200000, cost: 3195.5 },
    { name: 'Research Agent', tokens: 4100000, cost: 2008.6 },
    { name: 'Market Analysis', tokens: 2800000, cost: 1502.3 },
    { name: 'Finance Agent', tokens: 2900000, cost: 2689.2 },
    { name: 'Verification Agent', tokens: 800000, cost: 514.6 },
    { name: 'Report Agent', tokens: 1400000, cost: 863.2 }
  ],
  singleVsMulti: [
    { metric: 'Factuality & Accuracy', singleAgent: 74, multiAgent: 99, unit: '%' },
    { metric: 'Hallucination Suppression', singleAgent: 68, multiAgent: 98, unit: '%' },
    { metric: 'Complex Reasoning Depth', singleAgent: 62, multiAgent: 96, unit: '%' },
    { metric: 'Execution Latency (sec)', singleAgent: 12.8, multiAgent: 4.2, unit: 's' },
    { metric: 'Cost per Task (₹)', singleAgent: 6.80, multiAgent: 3.67, unit: '₹' }
  ]
};
