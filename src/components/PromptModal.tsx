import React, { useState } from 'react';
import { Sparkles, X, Play, Loader2, Bot, Layers } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunPromptPipeline: (goal: string, company: string) => void;
  isExecuting: boolean;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  onRunPromptPipeline,
  isExecuting
}) => {
  const [goal, setGoal] = useState('Evaluate 360 Market Opportunities & Valuation for Apple Q3 2026');
  const [targetCompany, setTargetCompany] = useState('Apple Inc.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || isExecuting) return;
    onRunPromptPipeline(goal.trim(), targetCompany.trim());
    onClose();
  };

  const presetPrompts = [
    { company: 'NVIDIA Corp', goal: 'Conduct 360 Enterprise SWOT & DCF Valuation for NVIDIA' },
    { company: 'OpenAI', goal: 'Evaluate Enterprise Market Share & Revenue Growth Trajectory' },
    { company: 'CrowdStrike', goal: 'Security Zero-Day Threat Audit & Competitor Positioning' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Execute Custom Multi-Agent Pipeline</h2>
              <p className="text-xs text-slate-400">Specify research directive for Gemini Pro & Flash fleet orchestration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold">Target Firm / Subject</label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="e.g. Apple Inc. or Tesla Motors"
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-bold">Research Directive Goal</label>
            <textarea
              rows={4}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Describe research goals, required DCF modeling, and SWOT parameters..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-purple-500/50 leading-relaxed"
            />
          </div>

          {/* Presets */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] text-slate-500 uppercase">Quick Presets</span>
            <div className="flex flex-wrap gap-2">
              {presetPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setGoal(p.goal);
                    setTargetCompany(p.company);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] text-left transition-colors"
                >
                  {p.company}: {p.goal.slice(0, 30)}...
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isExecuting || !goal.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {isExecuting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>Launch Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
