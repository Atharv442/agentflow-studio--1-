import React from 'react';
import { AgentNode } from '../../types';
import { 
  BrainCircuit, 
  Globe, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Clock, 
  IndianRupee, 
  Sparkles,
  Zap,
  MoreVertical,
  Layers
} from 'lucide-react';

interface NodeCardProps {
  node: AgentNode;
  isSelected: boolean;
  onSelect: (node: AgentNode) => void;
  onMouseDown: (e: React.MouseEvent | React.TouchEvent, node: AgentNode) => void;
  onRunSolo: (node: AgentNode) => void;
  onStartConnect?: (nodeId: string, e: React.MouseEvent) => void;
  onEndConnect?: (nodeId: string) => void;
  isConnectingSource?: boolean;
  isConnectingTargetHover?: boolean;
  isConnectionActive?: boolean;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  node,
  isSelected,
  onSelect,
  onMouseDown,
  onRunSolo,
  onStartConnect,
  onEndConnect,
  isConnectingSource,
  isConnectingTargetHover,
  isConnectionActive
}) => {
  // Color scheme variants
  const colorMap = {
    purple: {
      border: 'border-purple-500/40 hover:border-purple-500/70',
      selectedGlow: 'ring-2 ring-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.35)]',
      badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-400',
      barGradient: 'from-purple-500 to-indigo-500'
    },
    blue: {
      border: 'border-blue-500/40 hover:border-blue-500/70',
      selectedGlow: 'ring-2 ring-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.35)]',
      badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      iconBg: 'bg-blue-500/20 text-blue-400',
      barGradient: 'from-blue-500 to-cyan-500'
    },
    cyan: {
      border: 'border-cyan-500/40 hover:border-cyan-500/70',
      selectedGlow: 'ring-2 ring-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.35)]',
      badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
      barGradient: 'from-cyan-500 to-teal-500'
    },
    emerald: {
      border: 'border-emerald-500/40 hover:border-emerald-500/70',
      selectedGlow: 'ring-2 ring-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.35)]',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      barGradient: 'from-emerald-500 to-green-400'
    },
    amber: {
      border: 'border-amber-500/40 hover:border-amber-500/70',
      selectedGlow: 'ring-2 ring-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.35)]',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-400',
      barGradient: 'from-amber-500 to-yellow-400'
    },
    rose: {
      border: 'border-rose-500/40 hover:border-rose-500/70',
      selectedGlow: 'ring-2 ring-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.35)]',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      iconBg: 'bg-rose-500/20 text-rose-400',
      barGradient: 'from-rose-500 to-pink-500'
    }
  };

  const scheme = colorMap[node.colorScheme || 'blue'];

  const getIcon = () => {
    switch (node.iconName) {
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, node)}
      onTouchStart={(e) => onMouseDown(e, node)}
      onMouseUp={(e) => {
        if (isConnectionActive && onEndConnect) {
          e.stopPropagation();
          onEndConnect(node.id);
        }
      }}
      onClick={() => onSelect(node)}
      style={{
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
      }}
      className={`absolute w-72 rounded-2xl bg-slate-900/90 backdrop-blur-xl border transition-all duration-200 cursor-grab active:cursor-grabbing select-none group ${
        scheme.border
      } ${
        isConnectingTargetHover
          ? 'ring-4 ring-emerald-400 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)] scale-[1.02] z-30'
          : isConnectingSource
          ? 'ring-4 ring-purple-400 border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.5)] z-30'
          : isSelected
          ? scheme.selectedGlow
          : 'shadow-xl shadow-slate-950/80 hover:shadow-2xl'
      }`}
    >
      {/* Target (Input) Port Handle - Left */}
      <div 
        onMouseUp={(e) => {
          if (onEndConnect) {
            e.stopPropagation();
            onEndConnect(node.id);
          }
        }}
        className={`absolute -left-3 top-1/2 -translate-y-1/2 z-30 w-6 h-6 rounded-full bg-slate-950 border-2 transition-all cursor-pointer flex items-center justify-center ${
          isConnectingTargetHover
            ? 'border-emerald-400 scale-125 ring-4 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.8)]'
            : isConnectionActive
            ? 'border-blue-400 animate-bounce scale-110'
            : 'border-slate-600 hover:border-blue-400 hover:scale-125'
        }`}
        title="Input Port (Release connection line here)"
      >
        <span className={`w-2 h-2 rounded-full ${isConnectingTargetHover ? 'bg-emerald-400' : 'bg-blue-400'}`} />
      </div>

      {/* Source (Output) Port Handle - Right */}
      <div 
        onMouseDown={(e) => {
          e.stopPropagation();
          if (onStartConnect) onStartConnect(node.id, e);
        }}
        className={`absolute -right-3 top-1/2 -translate-y-1/2 z-30 w-6.5 h-6.5 rounded-full bg-slate-950 border-2 transition-all cursor-crosshair flex items-center justify-center group/port ${
          isConnectingSource
            ? 'border-purple-400 scale-125 ring-4 ring-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.8)]'
            : 'border-slate-600 hover:border-purple-400 hover:scale-125 shadow-lg'
        }`}
        title="n8n Output Handle: Click or Drag to connect anywhere!"
      >
        <span className="w-2 h-2 rounded-full bg-purple-400 group-hover/port:scale-125 transition-transform" />
      </div>

      {/* Header Bar */}
      <div className="p-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${scheme.iconBg}`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">
                {node.name}
              </h3>
              <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-md border mt-0.5 ${scheme.badgeBg}`}>
                {node.model}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-1">
            {node.status === 'completed' && (
              <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-400" title="Execution Completed">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
            {node.status === 'running' && (
              <span className="p-1 rounded-full bg-blue-500/20 text-blue-400 animate-spin" title="Executing Agent Step...">
                <Loader2 className="w-4 h-4" />
              </span>
            )}
            {node.status === 'error' && (
              <span className="p-1 rounded-full bg-rose-500/20 text-rose-400" title="Error encountered">
                <AlertCircle className="w-4 h-4" />
              </span>
            )}
            {node.status === 'idle' && (
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" title="Idle" />
            )}
          </div>
        </div>

        {/* Role Brief */}
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-sans">
          {node.role}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="p-3 bg-slate-950/40 grid grid-cols-3 gap-2 text-center text-[11px] font-mono border-b border-slate-800/80">
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px] uppercase">Latency</span>
          <span className="text-slate-300 font-semibold flex items-center justify-center gap-0.5">
            <Clock className="w-2.5 h-2.5 text-purple-400" /> {node.executionTime}s
          </span>
        </div>
        <div className="flex flex-col border-x border-slate-800/60">
          <span className="text-slate-500 text-[9px] uppercase">Cost</span>
          <span className="text-emerald-400 font-semibold flex items-center justify-center gap-0.5">
            <IndianRupee className="w-2.5 h-2.5" /> {node.cost.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-500 text-[9px] uppercase">Tokens</span>
          <span className="text-blue-400 font-semibold">
            {(node.tokens.total / 1000).toFixed(1)}k
          </span>
        </div>
      </div>

      {/* Confidence Score Bar Footer */}
      <div className="p-3 flex items-center justify-between gap-3 text-xs">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Confidence</span>
            <span className="text-slate-200 font-bold">{node.confidenceScore}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${scheme.barGradient} transition-all duration-500`}
              style={{ width: `${node.confidenceScore}%` }}
            />
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRunSolo(node);
          }}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-mono border border-slate-700 transition-colors"
          title="Run single agent node"
        >
          <Sparkles className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
