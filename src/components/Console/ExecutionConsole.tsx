import React, { useState } from 'react';
import { LogEntry } from '../../types';
import { 
  Terminal, 
  Trash2, 
  Download, 
  Search, 
  Play, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Wrench, 
  Brain, 
  Info,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';

interface ExecutionConsoleProps {
  logs: LogEntry[];
  onClearLogs: () => void;
  onRunPrompt: (prompt: string) => void;
  isExecuting: boolean;
  onClose: () => void;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({
  logs,
  onClearLogs,
  onRunPrompt,
  isExecuting,
  onClose
}) => {
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'tool' | 'thinking' | 'error' | 'success'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userPromptInput, setUserPromptInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.agentName && log.agentName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPromptInput.trim() || isExecuting) return;
    onRunPrompt(userPromptInput.trim());
    setUserPromptInput('');
  };

  const handleDownloadLogs = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentflow-console-logs-${Date.now()}.json`;
    a.click();
  };

  const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'info':
        return <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[9px] uppercase">INFO</span>;
      case 'tool':
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[9px] uppercase">TOOL</span>;
      case 'thinking':
        return <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-[9px] uppercase">THINKING</span>;
      case 'error':
        return <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono text-[9px] uppercase">ERROR</span>;
      case 'success':
        return <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[9px] uppercase">SUCCESS</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[9px] uppercase">LOG</span>;
    }
  };

  return (
    <div className="fixed bottom-0 left-64 right-0 z-20 bg-[#07080c]/95 backdrop-blur-2xl border-t border-slate-800/80 shadow-2xl transition-all duration-300 flex flex-col">
      {/* Console Header Bar */}
      <div className="h-10 px-4 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-blue-400 font-bold">
            <Terminal className="w-3.5 h-3.5" /> EXECUTION CONSOLE
          </span>

          <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {logs.length} EVENTS
          </span>

          {/* Filter Tabs */}
          <div className="hidden md:flex items-center gap-1 ml-4 border-l border-slate-800 pl-4">
            {(['all', 'info', 'tool', 'thinking', 'success', 'error'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded text-[10px] uppercase transition-colors ${
                  filterLevel === lvl
                    ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex items-center">
            <Search className="w-3 h-3 text-slate-500 absolute left-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-2 py-0.5 w-36 bg-slate-900 border border-slate-800 rounded text-[11px] text-slate-200 focus:outline-none focus:border-slate-700"
            />
          </div>

          <button
            onClick={onClearLogs}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Clear Terminal Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDownloadLogs}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Download JSON Telemetry Logs"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Terminal Log Output Body */}
      {isExpanded && (
        <div className="h-44 p-3 overflow-y-auto font-mono text-[11px] space-y-1.5 custom-scrollbar bg-slate-950/60">
          {filteredLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-600 font-mono">
              No telemetry events match filter criteria.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed hover:bg-slate-900/50 p-1 rounded transition-colors group">
                <span className="text-slate-500 shrink-0 text-[10px]">{log.timestamp}</span>
                <span className="shrink-0">{getLevelBadge(log.level)}</span>
                {log.agentName && (
                  <span className="text-blue-300 font-bold shrink-0">[{log.agentName}]:</span>
                )}
                <span className="text-slate-200 flex-1">{log.message}</span>
                {log.details && (
                  <span className="text-slate-500 text-[10px] hidden group-hover:inline transition-opacity">
                    {log.details}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Interactive Prompt Command Input Bar */}
      {isExpanded && (
        <form onSubmit={handleSubmitPrompt} className="p-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-purple-400 font-mono text-xs px-2 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI DIRECTIVE &gt;</span>
          </div>

          <input
            type="text"
            value={userPromptInput}
            onChange={(e) => setUserPromptInput(e.target.value)}
            placeholder="Type custom research task (e.g. 'Synthesize Q2 earnings & DCF target for Apple')..."
            disabled={isExecuting}
            className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-blue-500/50"
          />

          <button
            type="submit"
            disabled={!userPromptInput.trim() || isExecuting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition-all shrink-0"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Execute</span>
          </button>
        </form>
      )}
    </div>
  );
};
