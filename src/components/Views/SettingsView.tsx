import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Sparkles,
  Zap
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [apiKeyStatus, setApiKeyStatus] = useState<{ hasApiKey: boolean; service: string } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setApiKeyStatus(data))
      .catch(() => setApiKeyStatus({ hasApiKey: false, service: 'AgentFlow Server' }));
  }, []);

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-transparent relative z-1 space-y-8 text-slate-100 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Settings className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Workspace Settings & Gemini API Configuration
          </h1>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Manage system secrets, default Gemini model aliases, and thinking parameters.
        </p>
      </div>

      {/* Gemini API Key Status */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-400" /> Google Gemini API Connection
        </h3>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-slate-200">GEMINI_API_KEY Environment Variable</div>
            <p className="text-xs text-slate-400">
              Injected automatically via AI Studio workspace secrets panel.
            </p>
          </div>

          <div>
            {apiKeyStatus?.hasApiKey ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" /> ACTIVE & CONNECTED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4" /> DEMO / SIMULATION MODE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Model Preferences */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 font-mono text-xs">
        <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" /> Default Model Routing Parameters
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-200">High Reasoning Tasks</span>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Planner, Financial Modeling, Verification</p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30">
              gemini-3.1-pro-preview
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-200">Fast Parallel Synthesis</span>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Research, Market Analysis, Report Generation</p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/30">
              gemini-3.6-flash
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
