import React, { useState } from 'react';
import { AgentNode } from '../../types';
import { 
  Bot, 
  Sparkles, 
  Sliders, 
  Cpu, 
  Wrench, 
  Brain, 
  ShieldCheck, 
  DollarSign, 
  Clock,
  Play,
  Zap,
  CheckCircle2
} from 'lucide-react';

interface AgentsViewProps {
  nodes: AgentNode[];
  onSelectNode: (node: AgentNode) => void;
  onUpdateNode: (updatedNode: AgentNode) => void;
  onRunSolo: (node: AgentNode) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({
  nodes,
  onSelectNode,
  onUpdateNode,
  onRunSolo
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(nodes[0]?.id || 'planner');

  const selectedAgent = nodes.find((n) => n.id === selectedAgentId) || nodes[0];

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-transparent relative z-1 space-y-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Agent Fleet Configuration & System Prompts
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Configure system directives, model hyperparameters, and tool assignments for each specialized agent in the pipeline.
          </p>
        </div>
      </div>

      {/* Main Split Layout: Agent List (Left) + Detail Config (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Fleet List */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Deployed Agent Fleet</span>
          {nodes.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            return (
              <div
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-100">{agent.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {agent.model}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{agent.role}</p>

                <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800 text-slate-400">
                  <span>Confidence: <strong className="text-emerald-400">{agent.confidenceScore}%</strong></span>
                  <span>Tools: <strong className="text-blue-400">{agent.toolsUsed.length}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Agent Editor */}
        {selectedAgent && (
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedAgent.name}</h2>
                  <span className="text-xs font-mono text-purple-400">{selectedAgent.model}</span>
                </div>
              </div>

              <button
                onClick={() => onRunSolo(selectedAgent)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Agent</span>
              </button>
            </div>

            {/* Model Selection Reason */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-xs font-mono text-purple-400 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-400" /> Model Selection Rationale
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedAgent.whyModelSelected}
              </p>
            </div>

            {/* System Prompt Editor */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300">System Instruction Prompt</label>
              <textarea
                value={selectedAgent.systemPrompt}
                onChange={(e) => onUpdateNode({ ...selectedAgent, systemPrompt: e.target.value })}
                rows={5}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500/50 leading-relaxed"
              />
            </div>

            {/* Hyperparameters */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Temperature</span>
                  <span className="text-blue-400 font-bold">{selectedAgent.temperature}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateNode({ ...selectedAgent, temperature: Math.max(0, parseFloat((selectedAgent.temperature - 0.1).toFixed(2))) })}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono font-bold rounded-lg border border-slate-800 text-xs transition-colors"
                    title="Decrease temperature"
                  >
                    -
                  </button>
                  <div className="flex-1 flex gap-1">
                    {[0.2, 0.5, 0.8].map((val) => (
                      <button
                        key={val}
                        onClick={() => onUpdateNode({ ...selectedAgent, temperature: val })}
                        className={`flex-1 py-1 rounded-lg text-xs font-mono border transition-colors ${
                          selectedAgent.temperature === val
                            ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => onUpdateNode({ ...selectedAgent, temperature: Math.min(1, parseFloat((selectedAgent.temperature + 0.1).toFixed(2))) })}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-200 font-mono font-bold rounded-lg border border-slate-800 text-xs transition-colors"
                    title="Increase temperature"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Target Model</span>
                  <span className="text-purple-400 font-bold">{selectedAgent.model}</span>
                </div>
                <select
                  value={selectedAgent.model}
                  onChange={(e) => onUpdateNode({ ...selectedAgent, model: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="gemini-3.6-flash">gemini-3.6-flash (Fast)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (High Reasoning)</option>
                </select>
              </div>
            </div>

            {/* Assigned Tools */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-400" /> Authorized Tool Function Definitions
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.toolsUsed.map((tool) => (
                  <span key={tool} className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-mono">
                    {tool}()
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
