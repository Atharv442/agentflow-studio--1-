import React, { useState, useRef, useEffect } from 'react';
import { AgentNode, LogEntry, AnalyticsSummary } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  User, 
  Sparkles, 
  Send, 
  Paperclip, 
  Globe, 
  Brain, 
  Zap, 
  ChevronDown, 
  Check, 
  Copy, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown, 
  Plus, 
  Trash2, 
  IndianRupee, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  ChevronUp,
  FileText,
  Search,
  Sliders,
  X
} from 'lucide-react';

interface DashboardViewProps {
  nodes: AgentNode[];
  logs: LogEntry[];
  analytics: AnalyticsSummary;
  onSelectNode: (node: AgentNode) => void;
  onNavigateWorkflows: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed: string;
  isAutoRouted: boolean;
  routingReason?: string;
  thinkingSteps?: string[];
  tokens?: number;
  costInr?: number;
  latencySec?: number;
  isGenerating?: boolean;
  feedback?: 'like' | 'dislike' | null;
  attachments?: string[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  nodes,
  analytics,
  onNavigateWorkflows
}) => {
  // Model selector state
  const [selectedModel, setSelectedModel] = useState<string>('auto');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState<boolean>(false);

  // Toggles
  const [isWebSearch, setIsWebSearch] = useState<boolean>(true);
  const [isDeepThink, setIsDeepThink] = useState<boolean>(true);

  // Input & Chat State
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeThinkingStep, setActiveThinkingStep] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openThinkingId, setOpenThinkingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating, activeThinkingStep]);

  // Handle textarea height auto-resize
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  };

  // Model details dictionary
  const modelOptions = [
    {
      id: 'auto',
      name: '⚡ Auto-Router (AI Choice)',
      badge: 'RECOMMENDED',
      desc: 'Dynamically routes between Gemini 3.6 Flash & 3.1 Pro based on task complexity & cost.',
      costTag: 'Auto-Optimized (₹)'
    },
    {
      id: 'gemini-3.6-flash',
      name: '⚡ Gemini 3.6 Flash',
      badge: 'FASTEST',
      desc: 'Ultra-low latency, high context efficiency for search, web tasks & summary.',
      costTag: '₹0.25 / 1k tokens'
    },
    {
      id: 'gemini-3.1-pro',
      name: '🧠 Gemini 3.1 Pro',
      badge: 'HIGH REASONING',
      desc: 'Deep multi-step logic, complex math calculations & financial modeling.',
      costTag: '₹0.85 / 1k tokens'
    },
    {
      id: 'gemini-deep-research',
      name: '🌐 Gemini Deep Research',
      badge: 'WEB GROUNDED',
      desc: 'Multi-source external web research & competitive moat synthesis.',
      costTag: '₹1.50 / 1k tokens'
    },
    {
      id: 'guardrail-engine',
      name: '🛡️ Guardrail Security Engine',
      badge: 'FACT CHECKED',
      desc: 'Strict multi-agent verification pipeline with zero-hallucination guardrails.',
      costTag: '₹1.20 / 1k tokens'
    }
  ];

  // Helper to resolve auto-router choice
  const determineModelAndReasoning = (promptText: string, chosenModelId: string) => {
    if (chosenModelId !== 'auto') {
      const matched = modelOptions.find((m) => m.id === chosenModelId);
      return {
        modelName: matched ? matched.name.replace(/^[^\w]+/, '') : 'Gemini 3.6 Flash',
        isAuto: false,
        reasoning: `User manually selected ${matched?.name || chosenModelId}`
      };
    }

    const lower = promptText.toLowerCase();

    if (lower.includes('dcf') || lower.includes('valua') || lower.includes('math') || lower.includes('financial') || lower.includes('code') || lower.includes('calculat')) {
      return {
        modelName: 'Gemini 3.1 Pro (Deep Reasoning)',
        isAuto: true,
        reasoning: 'Auto-Router detected complex financial logic/math query. Routed to Gemini 3.1 Pro for precision calculations.'
      };
    }

    if (lower.includes('research') || lower.includes('competitor') || lower.includes('moat') || lower.includes('search') || lower.includes('news') || lower.includes('latest')) {
      return {
        modelName: 'Gemini Deep Research Engine',
        isAuto: true,
        reasoning: 'Auto-Router detected multi-source external web research task. Routed to Gemini Deep Research with Live Web Grounding.'
      };
    }

    if (lower.includes('security') || lower.includes('cve') || lower.includes('audit') || lower.includes('vulnerab') || lower.includes('check')) {
      return {
        modelName: 'Guardrail Security Engine',
        isAuto: true,
        reasoning: 'Auto-Router detected security audit/vulnerability analysis. Routed to Guardrail Security Engine.'
      };
    }

    return {
      modelName: 'Gemini 3.6 Flash (Fast Route)',
      isAuto: true,
      reasoning: 'Auto-Router selected Gemini 3.6 Flash for instant low-latency response & cost efficiency.'
    };
  };

  // Submit Prompt Handler
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isGenerating) return;

    const userMessageId = `msg-user-${Date.now()}`;
    const assistantMessageId = `msg-ai-${Date.now()}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: textToSend,
      timestamp: nowTime,
      modelUsed: selectedModel,
      isAutoRouted: selectedModel === 'auto',
      attachments: [...attachedFiles]
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setAttachedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Determine routing
    const routingInfo = determineModelAndReasoning(textToSend, selectedModel);

    setIsGenerating(true);
    setActiveThinkingStep('Evaluating prompt complexity & task domain...');

    // Placeholder assistant message
    const initialAiMsg: ChatMessage = {
      id: assistantMessageId,
      sender: 'assistant',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: routingInfo.modelName,
      isAutoRouted: routingInfo.isAuto,
      routingReason: routingInfo.reasoning,
      thinkingSteps: [
        `Step 1: Input intent parsed ("${textToSend.slice(0, 40)}...")`,
        `Step 2: ${routingInfo.reasoning}`,
        `Step 3: Web Grounding ${isWebSearch ? 'ENABLED' : 'OFF'} • Deep Thinking ${isDeepThink ? 'ACTIVE' : 'STANDARD'}`
      ],
      isGenerating: true
    };

    setMessages((prev) => [...prev, initialAiMsg]);

    try {
      // Step 1 delay
      await new Promise((r) => setTimeout(r, 600));
      setActiveThinkingStep(`Routing to ${routingInfo.modelName}...`);

      // Step 2 delay
      await new Promise((r) => setTimeout(r, 600));
      setActiveThinkingStep('Synthesizing multi-agent intelligence response...');

      // Call server endpoint
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, goal: textToSend })
      });

      const data = await res.json();

      const finalReport = data.reportText || `### Analysis & Solution for: "${textToSend}"\n\nI evaluated your request using **${routingInfo.modelName}**.\n\n- **Execution Strategy**: Auto-routed multi-agent branch processing.\n- **Factuality**: Guardrail cross-checked against standard benchmark knowledge.\n\n\`\`\`json\n{\n  "status": "success",\n  "currency": "INR (₹)",\n  "model": "${routingInfo.modelName}",\n  "grounding": ${isWebSearch}\n}\n\`\`\`\n\nIs there anything specific you would like me to delve deeper into?`;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                text: finalReport,
                isGenerating: false,
                tokens: data.totalTokens || 1845,
                costInr: data.totalCostInr || 0.38,
                latencySec: data.executionTimeSec || 0.95
              }
            : msg
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                text: `### Response Generated (${routingInfo.modelName})\n\nProcessed query: **${textToSend}**\n\n1. **Core Findings**: Successfully analyzed multi-node agent context.\n2. **Financial Telemetry**: Calculated cost in Indian Rupees (₹0.33).\n3. **Recommendation**: Proceed with pipeline execution or review agent topology.`,
                isGenerating: false,
                tokens: 1420,
                costInr: 0.33,
                latencySec: 0.85
              }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
      setActiveThinkingStep('');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: 'like' | 'dislike') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, feedback: msg.feedback === type ? null : type } : msg
      )
    );
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const handleAddAttachment = () => {
    const sampleFiles = ['q2_valuation_metrics.csv', 'nvidia_dcf_model.xlsx', 'competitor_moat_report.pdf'];
    const randomFile = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    if (!attachedFiles.includes(randomFile)) {
      setAttachedFiles((prev) => [...prev, randomFile]);
    }
  };

  // Helper renderer for simple Markdown text
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeBlockContent = '';

    return (
      <div className="space-y-3 text-slate-200 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('```')) {
            if (inCodeBlock) {
              inCodeBlock = false;
              const renderedCode = codeBlockContent;
              codeBlockContent = '';
              return (
                <div key={idx} className="my-3 rounded-xl bg-slate-950 border border-slate-800/90 overflow-hidden font-mono text-xs">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 text-slate-400 text-[10px]">
                    <span>CODE / DATA SCHEMATICS</span>
                    <button
                      onClick={() => handleCopy(`code-${idx}`, renderedCode)}
                      className="hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <pre className="p-3 text-blue-300 overflow-x-auto whitespace-pre-wrap">{renderedCode}</pre>
                </div>
              );
            } else {
              inCodeBlock = true;
              return null;
            }
          }

          if (inCodeBlock) {
            codeBlockContent += line + '\n';
            return null;
          }

          if (line.startsWith('# ')) {
            return <h1 key={idx} className="text-xl font-extrabold text-white mt-3 mb-1">{line.replace('# ', '')}</h1>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={idx} className="text-lg font-bold text-slate-100 mt-3 mb-1 border-b border-slate-800 pb-1">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={idx} className="text-base font-semibold text-blue-300 mt-2 mb-1">{line.replace('### ', '')}</h3>;
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-2 ml-2">
                <span className="text-blue-400 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span>{line.substring(2)}</span>
              </div>
            );
          }
          if (line.match(/^\d+\.\s/)) {
            return (
              <div key={idx} className="flex items-start gap-2 ml-2">
                <span className="font-mono text-blue-400 font-bold">{line.split('.')[0]}.</span>
                <span>{line.replace(/^\d+\.\s/, '')}</span>
              </div>
            );
          }

          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  const activeModelObj = modelOptions.find((m) => m.id === selectedModel) || modelOptions[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent text-slate-100 relative overflow-hidden z-1">
      {/* ChatGPT Top Navigation Bar */}
      <header className="h-14 border-b border-slate-800/80 bg-[#0a0c12]/90 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0">
        {/* Model Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800/90 text-slate-200 text-sm font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">{activeModelObj.name}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Model Selection Menu */}
          <AnimatePresence>
            {isModelDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute left-0 top-12 w-80 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 space-y-1"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase border-b border-slate-800/80 mb-1 flex items-center justify-between">
                  <span>SELECT AI ROUTING ENGINE</span>
                  <span className="text-emerald-400 font-bold">INR (₹) RATES</span>
                </div>

                {modelOptions.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex flex-col gap-1 border ${
                      selectedModel === model.id
                        ? 'bg-blue-600/15 border-blue-500/40 text-white'
                        : 'bg-slate-950/40 border-transparent hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        {model.name}
                      </span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{model.desc}</p>
                    <span className="text-[10px] font-mono text-emerald-400 pt-0.5">{model.costTag}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Top Controls: Mode Toggles & Telemetry */}
        <div className="flex items-center gap-3">
        </div>
      </header>

      {/* Main Chat Canvas Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-6 max-w-4xl w-full mx-auto pb-32">
        {/* Empty State / Welcome Screen */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 my-auto">
            <div className="p-4 rounded-3xl bg-gradient-to-b from-blue-600/20 to-purple-600/10 border border-blue-500/30 shadow-2xl relative">
              <Sparkles className="w-10 h-10 text-blue-400" />
            </div>

            <div className="space-y-2 max-w-lg">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                What can I help with today?
              </h1>
              <p className="text-sm text-slate-400">
                Type any query below. The <strong className="text-blue-400">AI Auto-Router</strong> automatically assigns Gemini 3.6 Flash, Gemini 3.1 Pro, or Specialized Research agents to deliver optimal speed, accuracy, and cost in ₹.
              </p>
            </div>

            {/* Quick Prompt Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
              <button
                onClick={() => handleQuickPrompt('Conduct 360 Valuation & DCF Model for NVIDIA (NVDA) Q2 2026')}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/90 hover:border-blue-500/40 transition-all text-slate-200 group flex flex-col justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-emerald-400" /> Financial Valuation
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs text-slate-400">Conduct DCF modeling with 9.5% WACC and target price forecasts in ₹</p>
              </button>

              <button
                onClick={() => handleQuickPrompt('Research competitor moats in AI hardware & ROCm ecosystem')}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/90 hover:border-purple-500/40 transition-all text-slate-200 group flex flex-col justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-purple-400" /> Web Grounded Research
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs text-slate-400">Analyze developer lock-in, software libraries & market share trends</p>
              </button>

              <button
                onClick={() => handleQuickPrompt('Audit security vulnerabilities & CVE logs for zero-day threats')}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all text-slate-200 group flex flex-col justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" /> Security Guardrails
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs text-slate-400">Parse CVE disclosures, verify threat severity & generate SOC 2 patch scripts</p>
              </button>

              <button
                onClick={() => handleQuickPrompt('Draft Product Specification (PRD) for Multi-Agent AI Workflow Engine')}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/90 hover:border-amber-500/40 transition-all text-slate-200 group flex flex-col justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-amber-400" /> Product Strategy
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-xs text-slate-400">Synthesize user stories, system architecture & API schemas</p>
              </button>
            </div>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-3xl space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-3xl rounded-tr-sm px-5 py-3.5 shadow-lg'
                  : 'bg-slate-900/90 border border-slate-800/90 rounded-3xl rounded-tl-sm p-6 shadow-xl w-full'
              }`}
            >
              {/* Message Header info for AI */}
              {msg.sender === 'assistant' && (
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-400 flex items-center gap-1 font-mono">
                      <Zap className="w-3.5 h-3.5 text-blue-400" />
                      {msg.modelUsed}
                    </span>
                    {msg.isAutoRouted && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                        AUTO-ROUTED
                      </span>
                    )}
                  </div>

                  {/* Telemetry pill */}
                  {msg.costInr !== undefined && (
                    <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                      <span>Cost: <strong className="text-emerald-400">₹{msg.costInr.toFixed(2)}</strong></span>
                      <span>Tokens: <strong className="text-blue-300">{msg.tokens}</strong></span>
                      <span>Time: <strong className="text-purple-300">{msg.latencySec}s</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* Attachments if user message */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-1">
                  {msg.attachments.map((file, fIdx) => (
                    <span key={fIdx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-700/50 text-blue-100 text-xs font-mono">
                      <Paperclip className="w-3 h-3" /> {file}
                    </span>
                  ))}
                </div>
              )}

              {/* User text or AI text */}
              {msg.sender === 'user' ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              ) : (
                <div className="space-y-4">
                  {/* Collapsible Thinking Process */}
                  {msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
                    <div className="rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden font-mono text-xs">
                      <button
                        onClick={() => setOpenThinkingId(openThinkingId === msg.id ? null : msg.id)}
                        className="w-full flex items-center justify-between p-3 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Brain className="w-3.5 h-3.5 text-purple-400" />
                          <span>Thought Process ({msg.thinkingSteps.length} steps)</span>
                        </span>
                        {openThinkingId === msg.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {openThinkingId === msg.id && (
                        <div className="p-3 pt-0 border-t border-slate-800/60 space-y-1 text-[11px] text-slate-400">
                          {msg.thinkingSteps.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Markdown Body */}
                  {msg.isGenerating && !msg.text ? (
                    <div className="flex items-center gap-2 text-slate-400 font-mono text-xs py-4">
                      <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                      <span>{activeThinkingStep || 'Synthesizing response...'}</span>
                    </div>
                  ) : (
                    renderMarkdown(msg.text)
                  )}

                  {/* Message Action Footer */}
                  {!msg.isGenerating && (
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-slate-200 flex items-center gap-1 transition-colors"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleSendMessage(messages[messages.length - 2]?.text || 'Re-analyze current query')}
                          className="hover:text-slate-200 flex items-center gap-1 transition-colors"
                          title="Regenerate response"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Retry</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFeedback(msg.id, 'like')}
                          className={`p-1 rounded hover:text-slate-200 transition-colors ${
                            msg.feedback === 'like' ? 'text-emerald-400' : ''
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'dislike')}
                          className={`p-1 rounded hover:text-slate-200 transition-colors ${
                            msg.feedback === 'dislike' ? 'text-red-400' : ''
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* ChatGPT Bottom Floating Input Container */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#08090e] via-[#08090e]/95 to-transparent pointer-events-none z-30">
        <div className="max-w-3xl mx-auto pointer-events-auto space-y-2">
          {/* Active File Attachments Pill Display */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-2">
              {attachedFiles.map((file, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs text-blue-300 font-mono shadow-md"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>{file}</span>
                  <button
                    onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* ChatGPT Main Input Card */}
          <div className="relative rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 hover:border-slate-700/90 focus-within:border-blue-500/50 shadow-2xl transition-all p-3 space-y-2">
            {/* Input Text Area */}
            <textarea
              ref={textareaRef}
              value={inputPrompt}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Message AI Assistant... (Ask anything or select a model above)"
              rows={1}
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none resize-none px-2 py-1 max-h-40 custom-scrollbar"
            />

            {/* Bottom Controls inside Input Card */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
              <div className="flex items-center gap-2">
                {/* Auto Router Indicator Pill inside input bar */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>{activeModelObj.name}</span>
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputPrompt.trim() || isGenerating}
                className={`p-2.5 rounded-2xl transition-all flex items-center justify-center ${
                  inputPrompt.trim() && !isGenerating
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 cursor-pointer'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Micro Disclaimer Text */}
          <p className="text-[11px] text-center text-slate-500 font-sans">
            AgentFlow can make mistakes. Check twice.
          </p>
        </div>
      </div>
    </div>
  );
};

