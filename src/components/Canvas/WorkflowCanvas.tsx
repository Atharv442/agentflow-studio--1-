import React, { useState, useRef, useEffect } from 'react';
import { AgentNode, WorkflowEdge } from '../../types';
import { NodeCard } from './NodeCard';
import { Minimap } from './Minimap';
import { 
  Plus, 
  Grid, 
  Sparkles, 
  Bot, 
  Trash2, 
  RotateCcw,
  Zap,
  SlidersHorizontal,
  X,
  Link
} from 'lucide-react';

interface WorkflowCanvasProps {
  nodes: AgentNode[];
  edges: WorkflowEdge[];
  selectedNode: AgentNode | null;
  onSelectNode: (node: AgentNode | null) => void;
  onNodePositionChange: (id: string, newPos: { x: number; y: number }) => void;
  onRunSoloNode: (node: AgentNode) => void;
  onAddAgentNode: (agentType: string, customPos?: { x: number; y: number }, connectFromSourceId?: string) => void;
  onResetLayout: () => void;
  onAddEdge?: (sourceId: string, targetId: string, label?: string) => void;
  onDeleteEdge?: (edgeId: string) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  selectedNode,
  onSelectNode,
  onNodePositionChange,
  onRunSoloNode,
  onAddAgentNode,
  onResetLayout,
  onAddEdge,
  onDeleteEdge
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Connection Dragging State (n8n Style)
  const [connectionDraft, setConnectionDraft] = useState<{
    sourceNodeId: string;
    currentX: number;
    currentY: number;
  } | null>(null);

  const [hoverTargetNodeId, setHoverTargetNodeId] = useState<string | null>(null);

  // Quick Connect Popover on Canvas Drop
  const [quickConnectMenu, setQuickConnectMenu] = useState<{
    sourceNodeId: string;
    canvasX: number;
    canvasY: number;
    screenX: number;
    screenY: number;
  } | null>(null);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const draggingNodeRef = useRef<{ id: string; startX: number; startY: number; initialPosX: number; initialPosY: number } | null>(null);
  const isPanningRef = useRef(false);
  const startPanRef = useRef({ x: 0, y: 0 });

  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const panRef = useRef(pan);
  panRef.current = pan;

  const connectionDraftRef = useRef(connectionDraft);
  connectionDraftRef.current = connectionDraft;

  const hoverTargetRef = useRef(hoverTargetNodeId);
  hoverTargetRef.current = hoverTargetNodeId;

  // Convert client screen coordinates to canvas space coordinates
  const screenToCanvasCoords = (clientX: number, clientY: number) => {
    if (!canvasContainerRef.current) return { x: 0, y: 0 };
    const rect = canvasContainerRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - panRef.current.x) / zoomRef.current,
      y: (clientY - rect.top - panRef.current.y) / zoomRef.current
    };
  };

  // Node Drag Handler (Mouse or Touch)
  const handleNodeMouseDown = (e: React.MouseEvent | React.TouchEvent, node: AgentNode) => {
    e.stopPropagation();
    setQuickConnectMenu(null);

    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    draggingNodeRef.current = {
      id: node.id,
      startX: clientX,
      startY: clientY,
      initialPosX: node.position.x,
      initialPosY: node.position.y
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('touchmove', handleWindowMouseMove, { passive: false });
    window.addEventListener('touchend', handleWindowMouseUp);
  };

  // Start Connection Line Drag (n8n Style)
  const handleStartConnect = (sourceNodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setQuickConnectMenu(null);

    const sourceNode = nodes.find((n) => n.id === sourceNodeId);
    if (!sourceNode) return;

    const coords = screenToCanvasCoords(e.clientX, e.clientY);

    setConnectionDraft({
      sourceNodeId,
      currentX: coords.x,
      currentY: coords.y
    });

    window.addEventListener('mousemove', handleConnectMouseMove);
    window.addEventListener('mouseup', handleConnectMouseUp);
  };

  const handleConnectMouseMove = (e: MouseEvent) => {
    if (!connectionDraftRef.current) return;

    const coords = screenToCanvasCoords(e.clientX, e.clientY);
    const sourceId = connectionDraftRef.current.sourceNodeId;

    // Check if mouse is hovering over any potential target node card
    let targetId: string | null = null;
    for (const node of nodes) {
      if (node.id === sourceId) continue;
      const nx = node.position.x;
      const ny = node.position.y;
      // Hit box around the 288x180 node card
      if (
        coords.x >= nx - 25 &&
        coords.x <= nx + 310 &&
        coords.y >= ny - 25 &&
        coords.y <= ny + 200
      ) {
        targetId = node.id;
        break;
      }
    }

    setHoverTargetNodeId(targetId);
    setConnectionDraft((prev) => (prev ? { ...prev, currentX: coords.x, currentY: coords.y } : null));
  };

  const handleConnectMouseUp = (e: MouseEvent) => {
    window.removeEventListener('mousemove', handleConnectMouseMove);
    window.removeEventListener('mouseup', handleConnectMouseUp);

    const activeDraft = connectionDraftRef.current;
    const activeTarget = hoverTargetRef.current;

    if (activeDraft) {
      if (activeTarget && onAddEdge) {
        // Connected to an existing node
        onAddEdge(activeDraft.sourceNodeId, activeTarget);
      } else {
        // Dropped in open canvas space -> show n8n quick connect menu
        const coords = screenToCanvasCoords(e.clientX, e.clientY);
        setQuickConnectMenu({
          sourceNodeId: activeDraft.sourceNodeId,
          canvasX: coords.x,
          canvasY: coords.y,
          screenX: e.clientX,
          screenY: e.clientY
        });
      }
    }

    setConnectionDraft(null);
    setHoverTargetNodeId(null);
  };

  const handleWindowMouseMove = (e: MouseEvent | TouchEvent) => {
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    if (draggingNodeRef.current) {
      const dx = (clientX - draggingNodeRef.current.startX) / zoomRef.current;
      const dy = (clientY - draggingNodeRef.current.startY) / zoomRef.current;
      const newX = Math.round(draggingNodeRef.current.initialPosX + dx);
      const newY = Math.round(draggingNodeRef.current.initialPosY + dy);

      onNodePositionChange(draggingNodeRef.current.id, { x: newX, y: newY });
    } else if (isPanningRef.current) {
      const dx = clientX - startPanRef.current.x;
      const dy = clientY - startPanRef.current.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      startPanRef.current = { x: clientX, y: clientY };
    }
  };

  const handleWindowMouseUp = () => {
    draggingNodeRef.current = null;
    isPanningRef.current = false;
    window.removeEventListener('mousemove', handleWindowMouseMove);
    window.removeEventListener('mouseup', handleWindowMouseUp);
    window.removeEventListener('touchmove', handleWindowMouseMove);
    window.removeEventListener('touchend', handleWindowMouseUp);
  };

  // Canvas Pan handler (Mouse)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      onSelectNode(null);
      setQuickConnectMenu(null);
      isPanningRef.current = true;
      startPanRef.current = { x: e.clientX, y: e.clientY };
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }
  };

  // Touch Pinch-To-Zoom & Trackpad Gesture Engine
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    let initialTouchDistance = 0;
    let initialZoom = 1;
    let initialPan = { x: 0, y: 0 };
    let initialMidpoint = { x: 0, y: 0 };
    let isTouchPinching = false;
    let singleTouchPanStart: { x: number; y: number; initialPan: { x: number; y: number } } | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let zoomFactor = 1;

      if (e.ctrlKey || e.metaKey) {
        // Trackpad pinch gesture or Ctrl+Wheel
        zoomFactor = Math.pow(1.008, -e.deltaY);
      } else {
        // Direct wheel zoom towards cursor
        zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      }

      const newZoom = Math.min(2.5, Math.max(0.2, zoomRef.current * zoomFactor));
      if (newZoom === zoomRef.current) return;

      const zoomRatio = newZoom / zoomRef.current;
      const newPanX = mouseX - (mouseX - panRef.current.x) * zoomRatio;
      const newPanY = mouseY - (mouseY - panRef.current.y) * zoomRatio;

      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Two-finger pinch zoom gesture start
        e.preventDefault();
        isTouchPinching = true;
        singleTouchPanStart = null;

        const t1 = e.touches[0];
        const t2 = e.touches[1];

        initialTouchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialZoom = zoomRef.current;
        initialPan = { ...panRef.current };
        initialMidpoint = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };
      } else if (e.touches.length === 1 && !isTouchPinching) {
        // Single finger pan on background canvas
        const targetEl = e.target as HTMLElement;
        const isInteractive = targetEl.closest('button, input, a, [role="button"]');
        if (!isInteractive) {
          singleTouchPanStart = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            initialPan: { ...panRef.current }
          };
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && isTouchPinching) {
        e.preventDefault();

        const t1 = e.touches[0];
        const t2 = e.touches[1];

        const currentDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        if (initialTouchDistance <= 0) return;

        const scale = currentDistance / initialTouchDistance;
        const newZoom = Math.min(2.5, Math.max(0.2, initialZoom * scale));

        const rect = container.getBoundingClientRect();
        const currentMidpoint = {
          x: (t1.clientX + t2.clientX) / 2,
          y: (t1.clientY + t2.clientY) / 2
        };

        const focalX = initialMidpoint.x - rect.left;
        const focalY = initialMidpoint.y - rect.top;

        const zoomRatio = newZoom / initialZoom;
        const dx = currentMidpoint.x - initialMidpoint.x;
        const dy = currentMidpoint.y - initialMidpoint.y;

        const newPanX = focalX - (focalX - initialPan.x) * zoomRatio + dx;
        const newPanY = focalY - (focalY - initialPan.y) * zoomRatio + dy;

        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });
      } else if (e.touches.length === 1 && singleTouchPanStart) {
        const dx = e.touches[0].clientX - singleTouchPanStart.x;
        const dy = e.touches[0].clientY - singleTouchPanStart.y;

        setPan({
          x: singleTouchPanStart.initialPan.x + dx,
          y: singleTouchPanStart.initialPan.y + dy
        });
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        isTouchPinching = false;
      }
      if (e.touches.length === 0) {
        singleTouchPanStart = null;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  // Zoom helpers
  const handleZoomIn = () => setZoom((prev) => Math.min(1.8, prev + 0.15));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev - 0.15));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Calculate SVG curve coordinates between node ports
  const renderEdgePath = (edge: WorkflowEdge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    if (!sourceNode || !targetNode) return null;

    // Source port right center, Target port left center
    const x1 = sourceNode.position.x + 288;
    const y1 = sourceNode.position.y + 90;
    const x2 = targetNode.position.x;
    const y2 = targetNode.position.y + 90;

    // Cubic Bezier control points
    const dx = Math.abs(x2 - x1) * 0.5;
    const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return (
      <g key={edge.id} className="group cursor-pointer">
        {/* Wide hit-area path for easy hovering */}
        <path
          d={pathD}
          fill="none"
          stroke="transparent"
          strokeWidth="20"
          className="pointer-events-auto"
        />

        {/* Glow halo path */}
        <path
          d={pathD}
          fill="none"
          stroke={edge.active ? "rgba(96, 165, 250, 0.25)" : "rgba(51, 65, 85, 0.2)"}
          strokeWidth="10"
          strokeLinecap="round"
          className="group-hover:stroke-blue-500/30 transition-all duration-200"
        />

        {/* Base connection path */}
        <path
          d={pathD}
          fill="none"
          stroke={edge.active ? "#2563eb" : "#334155"}
          strokeWidth="3"
          strokeLinecap="round"
          className="group-hover:stroke-blue-500 transition-colors duration-200"
        />

        {/* Continuous Flowing Energy Stream Line */}
        <path
          d={pathD}
          fill="none"
          stroke={edge.active ? "#60a5fa" : "#818cf8"}
          strokeWidth="2.5"
          strokeDasharray="8 12"
          strokeLinecap="round"
          opacity={edge.active ? "0.9" : "0.6"}
        >
          <animate
            attributeName="stroke-dashoffset"
            from="40"
            to="0"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Traveling Data Energy Packet 1 (Blue/Cyan) */}
        <g className="pointer-events-none">
          <animateMotion
            path={pathD}
            dur="2.2s"
            repeatCount="indefinite"
            rotate="auto"
          />
          <circle r="7" fill="#38bdf8" opacity="0.4" />
          <circle r="3.5" fill="#60a5fa" />
          <circle r="1.8" fill="#ffffff" />
        </g>

        {/* Traveling Data Energy Packet 2 (Staggered Purple/Indigo) */}
        <g className="pointer-events-none">
          <animateMotion
            path={pathD}
            dur="2.2s"
            repeatCount="indefinite"
            begin="1.1s"
            rotate="auto"
          />
          <circle r="7" fill="#c084fc" opacity="0.4" />
          <circle r="3.5" fill="#a855f7" />
          <circle r="1.8" fill="#ffffff" />
        </g>

        {/* Interactive Label and Delete Button at Edge Center */}
        <g transform={`translate(${midX}, ${midY})`} className="pointer-events-auto">
          {/* Edge Label Badge */}
          {edge.label && (
            <g transform="translate(0, -18)">
              <rect
                x="-55"
                y="-10"
                width="110"
                height="20"
                rx="10"
                className="fill-slate-950/90 stroke-slate-800 group-hover:stroke-blue-500/50 shadow-xl transition-colors"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                className="fill-slate-300 text-[10px] font-mono font-semibold pointer-events-none"
              >
                {edge.label}
              </text>
            </g>
          )}

          {/* n8n Style Interactive Delete Badge */}
          {onDeleteEdge && (
            <g
              onClick={(e) => {
                e.stopPropagation();
                onDeleteEdge(edge.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer hover:scale-125"
            >
              <circle
                r="11"
                className="fill-rose-950 stroke-rose-500/80 shadow-lg hover:fill-rose-900"
              />
              <foreignObject x="-7" y="-7" width="14" height="14" className="pointer-events-none">
                <div className="w-full h-full flex items-center justify-center text-rose-300">
                  <Trash2 className="w-3 h-3" />
                </div>
              </foreignObject>
            </g>
          )}
        </g>
      </g>
    );
  };

  // Render Dragging Connection Line in Progress
  const renderConnectionDraft = () => {
    if (!connectionDraft) return null;

    const sourceNode = nodes.find((n) => n.id === connectionDraft.sourceNodeId);
    if (!sourceNode) return null;

    const x1 = sourceNode.position.x + 288;
    const y1 = sourceNode.position.y + 90;
    const x2 = connectionDraft.currentX;
    const y2 = connectionDraft.currentY;

    const dx = Math.abs(x2 - x1) * 0.5;
    const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

    return (
      <g className="pointer-events-none z-50">
        {/* Outer Glow Line */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(168, 85, 247, 0.4)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Core Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#a855f7"
          strokeWidth="3.5"
          strokeDasharray="6 8"
          className="animate-[dash_0.8s_linear_infinite]"
        />
        {/* Pulsing Target Cursor Endpoint */}
        <circle
          cx={x2}
          cy={y2}
          r="8"
          className="fill-purple-500/30 stroke-purple-400 animate-ping"
        />
        <circle
          cx={x2}
          cy={y2}
          r="5"
          className="fill-purple-400 stroke-slate-950 stroke-2"
        />
      </g>
    );
  };

  return (
    <div
      ref={canvasContainerRef}
      onMouseDown={handleCanvasMouseDown}
      className="relative flex-1 w-full h-full overflow-hidden bg-[#07080c] select-none cursor-crosshair"
    >
      {/* Radial Futuristic Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: `${32 * zoom}px ${32 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />

      {/* Main Transformable Canvas Workspace */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="absolute inset-0 transition-transform duration-75"
      >
        {/* SVG Edges Layer */}
        <svg className="absolute inset-0 w-[5000px] h-[5000px] overflow-visible">
          <defs>
            <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="train-headlight-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="train-headlight-grad-purple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
            </linearGradient>
          </defs>

          {edges.map(renderEdgePath)}
          {renderConnectionDraft()}
        </svg>

        {/* Render Agent Nodes */}
        {nodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            onSelect={onSelectNode}
            onMouseDown={handleNodeMouseDown}
            onRunSolo={onRunSoloNode}
            onStartConnect={handleStartConnect}
            onEndConnect={(targetId) => {
              if (connectionDraft && onAddEdge) {
                onAddEdge(connectionDraft.sourceNodeId, targetId);
                setConnectionDraft(null);
                setHoverTargetNodeId(null);
              }
            }}
            isConnectingSource={connectionDraft?.sourceNodeId === node.id}
            isConnectingTargetHover={hoverTargetNodeId === node.id}
            isConnectionActive={!!connectionDraft && connectionDraft.sourceNodeId !== node.id}
          />
        ))}
      </div>

      {/* Top Left Canvas Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl p-1.5 rounded-xl border border-slate-800 shadow-2xl">
        <button
          onClick={onResetLayout}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Reset canvas layout"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* n8n Style Quick Connect Popover (on connection drop) */}
      {quickConnectMenu && (
        <div
          style={{
            left: Math.min(window.innerWidth - 280, Math.max(16, quickConnectMenu.screenX)),
            top: Math.min(window.innerHeight - 300, Math.max(16, quickConnectMenu.screenY))
          }}
          className="fixed z-50 w-72 p-3 bg-slate-900/95 backdrop-blur-2xl border border-purple-500/40 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.3)] space-y-2 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono font-bold text-slate-200">
            <span className="flex items-center gap-1.5 text-purple-400">
              <Link className="w-4 h-4" /> CONNECT NEW NODE
            </span>
            <button
              onClick={() => setQuickConnectMenu(null)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[11px] text-slate-400 leading-tight">
            Select node type to spawn and connect automatically:
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar pt-1">
            {[
              { type: 'human', label: 'Human-in-the-Loop Node', desc: 'Pauses pipeline for manual compliance approval.', icon: 'SlidersHorizontal' },
              { type: 'evaluator', label: 'LLM Evaluator Node', desc: 'Grading agent measuring hallucination & consensus.', icon: 'Sparkles' },
              { type: 'router', label: 'Conditional Router Node', desc: 'Dynamic model switch based on prompt complexity.', icon: 'Zap' },
              { type: 'summarizer', label: 'Executive Summarizer', desc: 'Synthesizes long context outputs into bullet points.', icon: 'Grid' },
            ].map((p) => (
              <button
                key={p.type}
                onClick={() => {
                  onAddAgentNode(
                    p.type,
                    { x: quickConnectMenu.canvasX, y: quickConnectMenu.canvasY },
                    quickConnectMenu.sourceNodeId
                  );
                  setQuickConnectMenu(null);
                }}
                className="w-full text-left p-2 rounded-xl bg-slate-950/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 transition-all flex items-start gap-2.5 group"
              >
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-purple-300">{p.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Right Controls & Minimap */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-3 pointer-events-auto">
        <Minimap nodes={nodes} selectedNodeId={selectedNode?.id} pan={pan} zoom={zoom} />
      </div>
    </div>
  );
};
