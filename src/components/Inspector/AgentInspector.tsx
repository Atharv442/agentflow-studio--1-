import React, { useState } from 'react';
import { AgentNode } from '../../types';
import { 
  X, 
  Sparkles, 
  Cpu, 
  Clock, 
  IndianRupee, 
  Sliders, 
  Copy, 
  Check, 
  Database, 
  Wrench, 
  History, 
  Brain, 
  FileCode2, 
  ShieldCheck,
  ChevronRight,
  Zap,
  Play
} from 'lucide-react';

interface AgentInspectorProps {
  node: AgentNode;
  onClose: () => void;
  onUpdateNode: (updatedNode: AgentNode) => void;
  onRunSolo: (node: AgentNode) => void;
}

export const AgentInspector: React.FC<AgentInspectorProps> = ({
  node,
  onClose,
  onUpdateNode,
  onRunSolo
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'metrics' | 'payload' | 'reasoning' | 'tools'>('details');
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const handleCopy = (text: string, isOutput: boolean) => {
    navigator.clipboard.writeText(text);
    if (isOutput) {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    } else {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    }
  };

  return (
    <aside className="fixed right-0 top-16 bottom-0 w-[440px] bg-[#0a0c12]/95 backdrop-blur-2xl border-l border-slate-800/80 z-30 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-start justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              {node.name}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {node.model}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{node.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onRunSolo(node)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-mono border border-blue-500/30 transition-colors"
            title="Run single agent node"
          >
            <Play className="w-3 h-3 fill-current" /> Run Solo
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center border-b border-slate-800/80 px-4 bg-slate-950/60 overflow-x-auto text-xs font-mono custom-scrollbar">
        {[
          { id: 'details', label: 'Details & Config', icon: Sliders },
          { id: 'metrics', label: 'Cost & Perf', icon: IndianRupee },
          { id: 'payload', label: 'Inputs & Outputs', icon: FileCode2 },
          { id: 'reasoning', label: 'Reasoning', icon: Sparkles },
          { id: 'tools', label: 'Tools & Memory', icon: Wrench },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3 py-3 border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-blue-500 text-blue-400 font-bold bg-blue-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-xs">
        {/* TAB 1: DETAILS & CONFIG */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Model Selection Explanation Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-950 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-purple-300 font-bold font-mono text-xs">
                <Zap className="w-4 h-4 text-purple-400" /> WHY THIS MODEL WAS SELECTED
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {node.whyModelSelected}
              </p>
            </div>

            {/* Model Switch History */}
            {node.modelSwitchHistory.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  <History className="w-3.5 h-3.5 text-blue-400" /> Model Switch History
                </div>
                {node.modelSwitchHistory.map((h, i) => (
                  <div key={i} className="flex items-start justify-between text-[11px] font-mono p-2 rounded bg-slate-950/80 border border-slate-800/80">
                    <div>
                      <span className="text-slate-400">{h.timestamp}: </span>
                      <span className="text-rose-400 line-through mr-1">{h.fromModel}</span>
                      <ChevronRight className="w-3 h-3 inline text-slate-500" />
                      <span className="text-emerald-400 ml-1 font-bold">{h.toModel}</span>
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5">{h.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* System Prompt Editor */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-mono font-bold flex items-center justify-between">
                <span>System Prompt Directive</span>
                <span className="text-[10px] text-slate-500 font-normal">Editable</span>
              </label>
              <textarea
                value={node.systemPrompt}
                onChange={(e) => onUpdateNode({ ...node, systemPrompt: e.target.value })}
                rows={4}
                className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-blue-500/50 resize-y"
              />
            </div>

            {/* Hyperparameters Controls */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[11px] text-slate-400">
                  <span>Temperature</span>
                  <span className="text-blue-400 font-bold">{node.temperature}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateNode({ ...node, temperature: Math.max(0, parseFloat((node.temperature - 0.1).toFixed(2))) })}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold rounded-lg border border-slate-700 text-xs transition-colors"
                    title="Decrease temperature"
                  >
                    -
                  </button>
                  <div className="flex-1 flex gap-1">
                    {[0.2, 0.5, 0.8].map((val) => (
                      <button
                        key={val}
                        onClick={() => onUpdateNode({ ...node, temperature: val })}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-mono border transition-colors ${
                          node.temperature === val
                            ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => onUpdateNode({ ...node, temperature: Math.min(1, parseFloat((node.temperature + 0.1).toFixed(2))) })}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold rounded-lg border border-slate-700 text-xs transition-colors"
                    title="Increase temperature"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[11px] text-slate-400">
                  <span>Confidence Bar</span>
                  <span className="text-emerald-400 font-bold">{node.confidenceScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-emerald-500 h-full" style={{ width: `${node.confidenceScore}%` }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COST & METRICS */}
        {activeTab === 'metrics' && (
          <div className="space-y-4 font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Execution Cost</span>
                <div className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" /> {node.cost.toFixed(2)}
                </div>
                <p className="text-[10px] text-slate-400 font-sans">Prompt & Completion tokens</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Latency Waterfall</span>
                <div className="text-lg font-bold text-purple-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {node.executionTime}s
                </div>
                <p className="text-[10px] text-slate-400 font-sans">{node.latencyMs}ms end-to-end</p>
              </div>
            </div>

            {/* Token Distribution Breakdown */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" /> TOKEN DISTRIBUTION
              </h4>

              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Prompt Tokens (Input)</span>
                  <span className="text-slate-200 font-bold">{node.tokens.prompt.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${(node.tokens.prompt / node.tokens.total) * 100}%` }} />
                </div>

                <div className="flex justify-between text-slate-400 pt-1">
                  <span>Completion Tokens (Output)</span>
                  <span className="text-slate-200 font-bold">{node.tokens.completion.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${(node.tokens.completion / node.tokens.total) * 100}%` }} />
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-slate-200">
                  <span>Total Tokens</span>
                  <span className="text-blue-400">{node.tokens.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INPUTS & OUTPUTS */}
        {activeTab === 'payload' && (
          <div className="space-y-4">
            {/* Input Payload */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-mono font-bold">Input Payload (JSON)</span>
                <button
                  onClick={() => handleCopy(node.inputPayload, false)}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200"
                >
                  {copiedInput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedInput ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto custom-scrollbar max-h-40">
                {node.inputPayload}
              </pre>
            </div>

            {/* Output Payload */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-mono font-bold">Output Payload</span>
                <button
                  onClick={() => handleCopy(node.outputPayload, true)}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200"
                >
                  {copiedOutput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedOutput ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-sans text-slate-200 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                {node.outputPayload}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REASONING & THINKING */}
        {activeTab === 'reasoning' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-4 h-4 text-purple-400" /> REASONING SUMMARY
              </h4>
              <p className="text-slate-300 font-sans leading-relaxed">
                {node.reasoningSummary}
              </p>
            </div>

            {/* Chain of Thought Thinking Logs */}
            {node.thinkingLogs && node.thinkingLogs.length > 0 && (
              <div className="space-y-2">
                <span className="text-slate-400 font-mono font-bold text-[11px]">Chain-of-Thought Trace</span>
                <div className="space-y-1.5">
                  {node.thinkingLogs.map((log, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300 flex items-start gap-2">
                      <span className="text-slate-500 select-none">0{idx + 1}.</span>
                      <p className="flex-1">{log}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TOOLS & MEMORY */}
        {activeTab === 'tools' && (
          <div className="space-y-4 font-mono">
            {/* Tools Used Badges */}
            <div className="space-y-2">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-400" /> Tools Invoked
              </span>
              <div className="flex flex-wrap gap-1.5">
                {node.toolsUsed.map((tool) => (
                  <span key={tool} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[11px]">
                    {tool}()
                  </span>
                ))}
              </div>
            </div>

            {/* Memory Keys Accessed */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-400" /> Shared Memory Context Keys
              </span>
              <div className="space-y-1.5">
                {node.memoryKeysAccessed.map((key) => (
                  <div key={key} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-purple-300 flex items-center justify-between">
                    <span>{key}</span>
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      READ / WRITE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
