import React from 'react';
import { 
  Play, 
  Sparkles, 
  IndianRupee, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle,
  ChevronDown,
  Layers,
  Terminal
} from 'lucide-react';
import { NodeStatus } from '../types';
import { UserProfile } from './Views/AccountView';

interface HeaderProps {
  projectName: string;
  onChangeProject: (name: string) => void;
  status: NodeStatus;
  totalCost: number;
  totalTokens: number;
  executionTime: number;
  onRunPipeline: () => void;
  onOpenPromptModal: () => void;
  onAutoLayout: () => void;
  onExport: () => void;
  onToggleConsole: () => void;
  consoleOpen: boolean;
  onSelectAccount?: () => void;
  userProfile?: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  onChangeProject,
  status,
  totalCost,
  totalTokens,
  executionTime,
  onRunPipeline,
  onOpenPromptModal,
  onAutoLayout,
  onExport,
  onToggleConsole,
  consoleOpen,
  onSelectAccount,
  userProfile = {
    name: 'Atharv Chaurasiya',
    email: 'atharvchaurasiya56@gmail.com',
    role: 'Lead AI Architect',
    avatarInitials: 'AC',
    plan: 'Pro Plan',
    joinedDate: 'August 2024',
    organization: 'AgentFlow Labs',
    notificationsEnabled: true,
    twoFactorEnabled: true,
  }
}) => {
  const projects = [
    'Enterprise Research Suite v2.4',
    'Startup Due Diligence Engine',
    'Cybersecurity Threat Scanner',
    'Product PRD & System Synthesizer'
  ];

  return (
    <header className="h-16 bg-[#0a0c12]/95 backdrop-blur-xl border-b border-slate-800/80 px-6 flex items-center justify-between z-20 shrink-0">
      {/* Left: Status Badge */}
      <div className="flex items-center gap-4">
        {/* Run Status Badge */}
        <div className="flex items-center">
          {status === 'running' && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              RUNNING PIPELINE...
            </span>
          )}
          {status === 'completed' && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              EXECUTION SUCCESSFUL
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              EXECUTION ERROR
            </span>
          )}
        </div>
      </div>

      {/* Middle: Live Telemetry Metrics */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs">
        <div className="flex items-center gap-1.5" title="Total Execution Cost">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">Cost:</span>
          <span className="text-emerald-400 font-bold">₹{totalCost.toFixed(2)}</span>
        </div>
        <div className="w-[1px] h-4 bg-slate-800" />
        <div className="flex items-center gap-1.5" title="Total Tokens Consumed">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Tokens:</span>
          <span className="text-blue-400 font-bold">{totalTokens.toLocaleString()}</span>
        </div>
        <div className="w-[1px] h-4 bg-slate-800" />
        <div className="flex items-center gap-1.5" title="Pipeline Execution Time">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-400">Time:</span>
          <span className="text-purple-400 font-bold">{executionTime.toFixed(2)}s</span>
        </div>
      </div>

      {/* Right: Quick Actions & User Profile */}
      <div className="flex items-center gap-3">
        {/* Toggle Execution Console Button */}
        <button
          onClick={onToggleConsole}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
            consoleOpen 
              ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-sm' 
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
          title="Toggle Terminal Logs"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Console</span>
        </button>

        {/* Run Pipeline Primary Button */}
        <button
          onClick={onRunPipeline}
          disabled={status === 'running'}
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {status === 'running' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>Run Pipeline</span>
        </button>

        {/* User Account Profile Quick Access */}
        {onSelectAccount && (
          <button
            onClick={onSelectAccount}
            className="pl-2 border-l border-slate-800/80 flex items-center gap-2 group focus:outline-none"
            title={`Account: ${userProfile.name}`}
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-[1.5px] shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[10.5px] bg-slate-950 flex items-center justify-center text-xs font-extrabold text-blue-300">
                {userProfile.avatarInitials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>
          </button>
        )}
      </div>
    </header>
  );
};
