import React from 'react';
import { WorkflowTemplate } from '../../types';
import { WORKFLOW_TEMPLATES } from '../../data/mockData';
import { 
  Sparkles, 
  ArrowRight, 
  IndianRupee, 
  Clock, 
  Award, 
  CheckCircle2, 
  Zap, 
  Bot 
} from 'lucide-react';

interface TemplatesViewProps {
  onLoadTemplate: (template: WorkflowTemplate) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onLoadTemplate }) => {
  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-transparent relative z-1 space-y-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Enterprise Workflow Template Gallery
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Pre-configured, production-grade multi-agent orchestration blueprints ready for instant deployment.
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WORKFLOW_TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-blue-500/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold uppercase">
                  {tpl.category}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {tpl.accuracyRating}% Accuracy
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-blue-300 transition-colors">
                {tpl.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {tpl.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tpl.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-300 text-[10px] font-mono border border-slate-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Metrics & Action Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-blue-400" /> {tpl.nodeCount} Agents
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <IndianRupee className="w-3.5 h-3.5" /> {tpl.estCost}
                </span>
                <span className="flex items-center gap-1 text-purple-400">
                  <Clock className="w-3.5 h-3.5" /> {tpl.avgLatency}
                </span>
              </div>

              <button
                onClick={() => onLoadTemplate(tpl)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all"
              >
                <span>Load Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
