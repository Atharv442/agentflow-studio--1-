import React, { useState } from 'react';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  Workflow, 
  Bot, 
  Sparkles, 
  Database, 
  Settings, 
  Zap,
  User,
  LogOut,
  ChevronUp
} from 'lucide-react';

import { UserProfile } from './Views/AccountView';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  userProfile?: UserProfile;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
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
  },
  isCollapsed,
  onToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed;

  const handleLogoClick = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const navItems: { id: ViewType; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'templates', label: 'Templates', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen bg-[#0a0c12]/90 backdrop-blur-xl border-r border-slate-800/80 shrink-0 z-30 select-none transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header / Logo Button */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
        <button
          onClick={handleLogoClick}
          title={collapsed ? "Click logo to expand sidebar" : "Click logo to minimize sidebar"}
          className="flex items-center gap-3 overflow-hidden text-left w-full group py-1.5 px-1 -mx-1 rounded-xl hover:bg-slate-800/50 transition-all duration-200 cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-center w-full h-full bg-slate-950 rounded-[11px]">
              <Zap className="w-5 h-5 text-blue-400 animate-pulse group-hover:text-blue-300" />
            </div>
          </div>
          <div
            className={`flex flex-col transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap ${
              collapsed ? 'opacity-0 w-0 scale-95 pointer-events-none' : 'opacity-100 w-auto scale-100'
            }`}
          >
            <span className="font-bold text-slate-100 tracking-tight text-base flex items-center gap-1.5">
              AgentFlow
            </span>
            <span className="text-[11px] text-slate-400 font-mono tracking-wider">UNIFIED ORCHESTRATOR</span>
          </div>
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 space-y-2 overflow-y-auto custom-scrollbar px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              title={collapsed ? item.label : undefined}
              className={`group relative flex items-center rounded-xl transition-all duration-300 text-sm font-medium w-full py-2.5 ${
                collapsed ? 'justify-center px-0' : 'px-3'
              } ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 via-indigo-600/15 to-purple-600/10 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              
              <div
                className={`flex items-center justify-between flex-1 ml-3 overflow-hidden transition-all duration-300 whitespace-nowrap ${
                  collapsed ? 'opacity-0 w-0 ml-0 hidden' : 'opacity-100 w-auto'
                }`}
              >
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    item.badge === 'Live'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute top-2 bottom-2 w-1 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-r-full left-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Account Section Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 relative">
        {/* Expanded Popover Menu */}
        {showAccountMenu && (
          <div
            className={`absolute bottom-16 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
              collapsed ? 'left-1 w-52' : 'left-3 right-3'
            }`}
          >
            <div className="px-3 py-2 border-b border-slate-800/80">
              <p className="text-xs font-bold text-white">{userProfile.name}</p>
              <p className="text-[11px] text-slate-400 font-mono truncate">{userProfile.email}</p>
            </div>
            <button
              onClick={() => {
                onSelectView('account');
                setShowAccountMenu(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <User className="w-4 h-4 text-blue-400" />
              <span>Manage Account</span>
            </button>
            <button
              onClick={() => {
                onSelectView('settings');
                setShowAccountMenu(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
              <span>Workspace Settings</span>
            </button>
            <div className="pt-1 border-t border-slate-800/80">
              <button
                onClick={() => setShowAccountMenu(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowAccountMenu(!showAccountMenu)}
          title={collapsed ? userProfile.name : undefined}
          className={`w-full p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/80 flex items-center transition-all text-left group shadow-lg ${
            collapsed ? 'justify-center p-2' : 'justify-between gap-3'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-[1.5px] shrink-0 shadow-md">
              <div className="w-full h-full bg-slate-950 rounded-[10.5px] flex items-center justify-center text-xs font-bold text-white">
                {userProfile.avatarInitials}
              </div>
            </div>
            <div
              className={`flex flex-col overflow-hidden transition-all duration-300 whitespace-nowrap ${
                collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">{userProfile.name}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono truncate">{userProfile.email}</span>
            </div>
          </div>
          {!collapsed && (
            <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform ${showAccountMenu ? 'rotate-180 text-white' : ''}`} />
          )}
        </button>
      </div>
    </aside>
  );
};
