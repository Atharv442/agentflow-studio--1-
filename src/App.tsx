import React, { useState } from 'react';
import { 
  ViewType, 
  AgentNode, 
  WorkflowEdge, 
  LogEntry, 
  NodeStatus, 
  WorkflowTemplate, 
  AnalyticsSummary 
} from './types';
import { 
  INITIAL_NODES, 
  INITIAL_EDGES, 
  INITIAL_LOGS, 
  ANALYTICS_DATA 
} from './data/mockData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WorkflowCanvas } from './components/Canvas/WorkflowCanvas';
import { NeuralNetworkBackground } from './components/Canvas/NeuralNetworkBackground';
import { AgentInspector } from './components/Inspector/AgentInspector';
import { ExecutionConsole } from './components/Console/ExecutionConsole';

import { DashboardView } from './components/Views/DashboardView';
import { AnalyticsView } from './components/Views/AnalyticsView';
import { TemplatesView } from './components/Views/TemplatesView';
import { AgentsView } from './components/Views/AgentsView';
import { SettingsView } from './components/Views/SettingsView';
import { AccountView, UserProfile } from './components/Views/AccountView';

import { PromptModal } from './components/PromptModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [lastNonAccountView, setLastNonAccountView] = useState<ViewType>('dashboard');

  const handleSelectAccount = () => {
    if (currentView === 'account') {
      setCurrentView(lastNonAccountView !== 'account' ? lastNonAccountView : 'dashboard');
    } else {
      setLastNonAccountView(currentView);
      setCurrentView('account');
    }
  };
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  // Account User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Atharv Chaurasiya',
    email: 'atharvchaurasiya56@gmail.com',
    role: 'Lead AI Architect',
    avatarInitials: 'AC',
    plan: 'Active',
    joinedDate: 'August 2024',
    organization: 'AgentFlow Labs',
    notificationsEnabled: true,
    twoFactorEnabled: true,
  });

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  // Workflow Graph State
  const [projectName, setProjectName] = useState('Enterprise Research Suite v2.4');
  const [nodes, setNodes] = useState<AgentNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<WorkflowEdge[]>(INITIAL_EDGES);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(null);

  // Pipeline Execution Telemetry State
  const [pipelineStatus, setPipelineStatus] = useState<NodeStatus>('completed');
  const [totalCost, setTotalCost] = useState<number>(3.67);
  const [totalTokens, setTotalTokens] = useState<number>(23110);
  const [executionTime, setExecutionTime] = useState<number>(4.29);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Node position change drag
  const handleNodePositionChange = (id: string, newPos: { x: number; y: number }) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, position: newPos } : node))
    );
    if (selectedNode && selectedNode.id === id) {
      setSelectedNode((prev) => (prev ? { ...prev, position: newPos } : null));
    }
  };

  // Node property update from inspector
  const handleUpdateNode = (updatedNode: AgentNode) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === updatedNode.id ? updatedNode : node))
    );
    setSelectedNode(updatedNode);
  };

  // Add Agent Node from palette
  const handleAddAgentNode = (agentType: string, customPos?: { x: number; y: number }, connectFromSourceId?: string) => {
    const newId = `agent-${Date.now()}`;
    const nodePos = customPos || { x: 300 + Math.random() * 200, y: 150 + Math.random() * 100 };

    const newNode: AgentNode = {
      id: newId,
      name: `${agentType.toUpperCase()} Node`,
      role: 'Custom dynamic orchestration node.',
      model: 'gemini-3.6-flash',
      whyModelSelected: 'Low latency and high context efficiency.',
      status: 'idle',
      executionTime: 0.5,
      cost: 0.17,
      tokens: { prompt: 1000, completion: 400, total: 1400 },
      confidenceScore: 96,
      position: nodePos,
      systemPrompt: 'You are a custom specialized sub-agent node in AgentFlow Studio.',
      temperature: 0.3,
      toolsUsed: ['custom_tool'],
      inputPayload: JSON.stringify({ note: 'Dynamic payload input' }, null, 2),
      outputPayload: JSON.stringify({ result: 'Completed successfully' }, null, 2),
      reasoningSummary: 'Executed user configured logic block.',
      memoryKeysAccessed: ['shared.dynamic_cache'],
      modelSwitchHistory: [],
      latencyMs: 500,
      iconName: 'Zap',
      colorScheme: 'purple'
    };

    setNodes((prev) => [...prev, newNode]);

    // Connect from specific source if provided, or fallback to planner if present
    const sourceNodeId = connectFromSourceId || (nodes.find((n) => n.id === 'planner')?.id);
    if (sourceNodeId) {
      const newEdge: WorkflowEdge = {
        id: `e-${Date.now()}`,
        source: sourceNodeId,
        target: newId,
        label: 'Task Connection',
        animated: true,
        active: true
      };
      setEdges((prev) => [...prev, newEdge]);
    }

    showToast(`Added new ${agentType} node to workflow graph.`);
  };

  // Add Edge Connection between nodes
  const handleAddEdge = (sourceId: string, targetId: string, label?: string) => {
    if (sourceId === targetId) {
      showToast('Cannot connect a node to itself.');
      return;
    }
    const exists = edges.some((e) => e.source === sourceId && e.target === targetId);
    if (exists) {
      showToast('Nodes are already connected.');
      return;
    }

    const newEdge: WorkflowEdge = {
      id: `e-${Date.now()}`,
      source: sourceId,
      target: targetId,
      label: label || 'Data Stream',
      animated: true,
      active: true
    };

    setEdges((prev) => [...prev, newEdge]);
    const sourceNode = nodes.find((n) => n.id === sourceId);
    const targetNode = nodes.find((n) => n.id === targetId);
    showToast(`Connected [${sourceNode?.name || sourceId}] ➔ [${targetNode?.name || targetId}]`);
  };

  // Delete Edge Connection
  const handleDeleteEdge = (edgeId: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
    showToast('Connection line removed.');
  };

  // Auto-arrange layout
  const handleAutoLayout = () => {
    const layoutPositions: Record<string, { x: number; y: number }> = {
      planner: { x: 80, y: 180 },
      research: { x: 420, y: 60 },
      market: { x: 420, y: 220 },
      finance: { x: 420, y: 380 },
      verification: { x: 760, y: 150 },
      report: { x: 1040, y: 220 }
    };

    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        position: layoutPositions[n.id] || { x: 500, y: 200 }
      }))
    );
    showToast('Canvas graph auto-layout restored.');
  };

  // Export Workflow Code
  const handleExport = () => {
    const exportData = {
      version: '2.4',
      project: projectName,
      nodes,
      edges,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-workflow.json`;
    a.click();
    showToast('Workflow JSON definition exported successfully.');
  };

  // Load Template
  const handleLoadTemplate = (template: WorkflowTemplate) => {
    setProjectName(template.title);
    setNodes(template.nodes);
    setEdges(template.edges);
    setCurrentView('workflows');
    showToast(`Loaded template: ${template.title}`);
  };

  // Run Solo Node
  const handleRunSoloNode = (node: AgentNode) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === node.id ? { ...n, status: 'running' } : n))
    );

    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: node.id,
      agentName: node.name,
      level: 'info',
      message: `Executing solo agent step for [${node.name}]...`,
      details: `Model: ${node.model}, Temp: ${node.temperature}`
    };

    setLogs((prev) => [newLog, ...prev]);

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: 'completed' } : n))
      );
      showToast(`Agent [${node.name}] execution finished.`);
    }, 1200);
  };

  // Trigger Full Multi-Agent Pipeline Execution via Server API
  const handleRunPipeline = async (customGoal?: string, targetCompany?: string) => {
    setPipelineStatus('running');
    
    // Set all nodes to idle/running sequence animation
    setNodes((prev) => prev.map((n) => ({ ...n, status: 'idle' })));

    const startTime = Date.now();
    const activeGoal = customGoal || 'Conduct 360 Enterprise SWOT & Valuation for NVIDIA Q2 2026';

    const log1: LogEntry = {
      id: `log-${Date.now()}-1`,
      timestamp: new Date().toLocaleTimeString(),
      agentId: 'planner',
      agentName: 'Planner Agent',
      level: 'info',
      message: `Multi-Agent Pipeline launched with goal: '${activeGoal}'`,
      details: 'Routing sub-tasks across Gemini 3.1 Pro & 3.6 Flash fleet.'
    };
    setLogs((prev) => [log1, ...prev]);

    // Animate Stage 1: Planner Agent
    setNodes((prev) => prev.map((n) => (n.id === 'planner' ? { ...n, status: 'running' } : n)));

    try {
      // Call backend API
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: activeGoal, targetCompany })
      });
      const data = await res.json();

      setTimeout(() => {
        // Planner completed
        setNodes((prev) => prev.map((n) => (n.id === 'planner' ? { ...n, status: 'completed' } : n)));

        // Stage 2: Parallel execution (Research, Market, Finance)
        setNodes((prev) =>
          prev.map((n) =>
            ['research', 'market', 'finance'].includes(n.id) ? { ...n, status: 'running' } : n
          )
        );

        const log2: LogEntry = {
          id: `log-${Date.now()}-2`,
          timestamp: new Date().toLocaleTimeString(),
          level: 'tool',
          message: 'Executing parallel branches: Research Search, Market Moat, and DCF Valuation modeling...',
        };
        setLogs((prev) => [log2, ...prev]);

        setTimeout(() => {
          // Parallel completed
          setNodes((prev) =>
            prev.map((n) =>
              ['research', 'market', 'finance'].includes(n.id) ? { ...n, status: 'completed' } : n
            )
          );

          // Stage 3: Verification Agent
          setNodes((prev) => prev.map((n) => (n.id === 'verification' ? { ...n, status: 'running' } : n)));

          setTimeout(() => {
            setNodes((prev) => prev.map((n) => (n.id === 'verification' ? { ...n, status: 'completed' } : n)));

            // Stage 4: Report Agent
            setNodes((prev) => prev.map((n) => (n.id === 'report' ? { ...n, status: 'running' } : n)));

            setTimeout(() => {
              // Update report agent payload with real/simulated response
              setNodes((prev) =>
                prev.map((n) =>
                  n.id === 'report'
                    ? { ...n, status: 'completed', outputPayload: data.reportText || n.outputPayload }
                    : { ...n, status: 'completed' }
                )
              );

              setPipelineStatus('completed');
              setExecutionTime(data.executionTimeSec || 4.29);
              setTotalCost(data.totalCostInr || data.totalCostUsd || 3.67);
              setTotalTokens(data.totalTokens || 23110);

              const logSuccess: LogEntry = {
                id: `log-${Date.now()}-success`,
                timestamp: new Date().toLocaleTimeString(),
                agentId: 'report',
                agentName: 'Report Agent',
                level: 'success',
                message: `Pipeline completed successfully! Executive dossier synthesized in ${data.executionTimeSec || 4.29}s.`,
                details: `Cost: ₹${data.totalCostInr || data.totalCostUsd || 3.67}`
              };
              setLogs((prev) => [logSuccess, ...prev]);
              showToast('Multi-Agent Pipeline completed successfully!');
            }, 800);
          }, 800);
        }, 1000);
      }, 800);

    } catch {
      setPipelineStatus('error');
      showToast('Error during pipeline execution.');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07080c] font-sans antialiased text-slate-100 select-none relative">
      {/* Live Neural Network Background - Skipped on the workflow page */}
      {currentView !== 'workflows' && <NeuralNetworkBackground />}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/95 border border-blue-500/40 text-blue-300 font-mono text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Navigation Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        userProfile={userProfile}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Right Main Body Content Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header Navigation Bar */}
        <Header
          projectName={projectName}
          onChangeProject={setProjectName}
          status={pipelineStatus}
          totalCost={totalCost}
          totalTokens={totalTokens}
          executionTime={executionTime}
          onRunPipeline={() => handleRunPipeline()}
          onOpenPromptModal={() => setIsPromptModalOpen(true)}
          onAutoLayout={handleAutoLayout}
          onExport={handleExport}
          onToggleConsole={() => setConsoleOpen(!consoleOpen)}
          consoleOpen={consoleOpen}
          onSelectAccount={() => setCurrentView('account')}
          userProfile={userProfile}
        />

        {/* View Switcher Viewport */}
        <main className="flex-1 relative flex overflow-hidden">
          {currentView === 'dashboard' && (
            <DashboardView
              nodes={nodes}
              logs={logs}
              analytics={ANALYTICS_DATA}
              onSelectNode={setSelectedNode}
              onNavigateWorkflows={() => setCurrentView('workflows')}
            />
          )}

          {currentView === 'workflows' && (
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              onNodePositionChange={handleNodePositionChange}
              onRunSoloNode={handleRunSoloNode}
              onAddAgentNode={handleAddAgentNode}
              onResetLayout={handleAutoLayout}
              onAddEdge={handleAddEdge}
              onDeleteEdge={handleDeleteEdge}
            />
          )}

          {currentView === 'agents' && (
            <AgentsView
              nodes={nodes}
              onSelectNode={setSelectedNode}
              onUpdateNode={handleUpdateNode}
              onRunSolo={handleRunSoloNode}
            />
          )}

          {currentView === 'templates' && (
            <TemplatesView onLoadTemplate={handleLoadTemplate} />
          )}

          {currentView === 'account' && (
            <AccountView
              userProfile={userProfile}
              onUpdateProfile={handleUpdateProfile}
              onShowToast={showToast}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView />
          )}

          {/* Right Slide-out Inspector Panel (Active when node selected) */}
          {selectedNode && (
            <AgentInspector
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onUpdateNode={handleUpdateNode}
              onRunSolo={handleRunSoloNode}
            />
          )}
        </main>

        {/* Bottom Docked Terminal Execution Console */}
        {consoleOpen && (
          <ExecutionConsole
            logs={logs}
            onClearLogs={() => setLogs([])}
            onRunPrompt={(p) => handleRunPipeline(p)}
            isExecuting={pipelineStatus === 'running'}
            onClose={() => setConsoleOpen(false)}
          />
        )}
      </div>

      {/* AI Task Prompt Launcher Modal */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        onRunPromptPipeline={(goal, company) => handleRunPipeline(goal, company)}
        isExecuting={pipelineStatus === 'running'}
      />
    </div>
  );
}
