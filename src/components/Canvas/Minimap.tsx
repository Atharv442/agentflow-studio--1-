import React from 'react';
import { AgentNode } from '../../types';

interface MinimapProps {
  nodes: AgentNode[];
  selectedNodeId?: string;
  pan: { x: number; y: number };
  zoom: number;
}

export const Minimap: React.FC<MinimapProps> = ({ nodes, selectedNodeId }) => {
  // Minimap dimensions
  const width = 160;
  const height = 110;

  return (
    <div className="relative w-40 h-28 bg-slate-950/90 backdrop-blur-md rounded-xl border border-slate-800 shadow-2xl p-2 flex flex-col justify-between overflow-hidden select-none pointer-events-none">
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-b border-slate-800/80 pb-1">
        <span>MINIMAP</span>
        <span className="text-blue-400">{nodes.length} NODES</span>
      </div>

      <div className="relative flex-1 w-full h-full my-1 border border-slate-800/60 rounded bg-slate-900/60 overflow-hidden">
        {nodes.map((n) => {
          // Map node positions (0-1200x, 0-600y) to thumbnail coordinates
          const posX = Math.max(0, Math.min(width - 20, (n.position.x / 1300) * (width - 20)));
          const posY = Math.max(0, Math.min(height - 20, (n.position.y / 600) * (height - 30)));
          const isSelected = n.id === selectedNodeId;

          return (
            <div
              key={n.id}
              style={{
                left: `${posX}px`,
                top: `${posY}px`,
              }}
              className={`absolute w-4 h-2.5 rounded-[2px] transition-all ${
                isSelected 
                  ? 'bg-blue-400 ring-2 ring-blue-500 shadow-sm' 
                  : n.status === 'completed'
                  ? 'bg-emerald-500/80'
                  : n.status === 'running'
                  ? 'bg-purple-500 animate-pulse'
                  : 'bg-slate-600'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
