import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Key, 
  Building, 
  CheckCircle2, 
  Sparkles, 
  Bell, 
  Lock, 
  Cpu, 
  Activity, 
  Edit3, 
  Save, 
  Copy, 
  Check, 
  Zap, 
  Download, 
  LogOut, 
  ShieldAlert,
  BarChart3,
  Globe
} from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
  plan: string;
  joinedDate: string;
  organization: string;
  notificationsEnabled: boolean;
  twoFactorEnabled: boolean;
}

interface AccountViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onShowToast: (msg: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  userProfile,
  onUpdateProfile,
  onShowToast
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState(userProfile.name);
  const [formEmail, setFormEmail] = useState(userProfile.email);
  const [formRole, setFormRole] = useState(userProfile.role);
  const [formOrg, setFormOrg] = useState(userProfile.organization);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = formName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AC';

    onUpdateProfile({
      name: formName,
      email: formEmail,
      role: formRole,
      organization: formOrg,
      avatarInitials: initials
    });
    setIsEditing(false);
    onShowToast('Account profile details updated successfully!');
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('AIzaSyAgentFlowKey_991823182736');
    setCopiedKey(true);
    onShowToast('Demo API Key copied to clipboard.');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-transparent relative z-1 space-y-8 text-slate-100 max-w-6xl mx-auto">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-purple-950/50 border border-slate-800/80 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 p-[2px] shadow-xl shadow-blue-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl font-black text-white tracking-wider">
                  {userProfile.avatarInitials}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 ring-4 ring-slate-950" title="Account Active" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                  {userProfile.name}
                </h1>
              </div>
              <p className="text-sm text-slate-400 font-mono flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> {userProfile.email}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-2 pt-0.5">
                <Building className="w-3.5 h-3.5 text-purple-400" /> {userProfile.role} • {userProfile.organization}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/25 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Form Modal/Section */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-slate-900/90 border border-blue-500/30 space-y-4 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" /> Update Account Information
            </h3>
            <span className="text-xs text-slate-400">All changes apply instantly across your session</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Role / Position</label>
              <input
                type="text"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Organization / Lab</label>
              <input
                type="text"
                value={formOrg}
                onChange={(e) => setFormOrg(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-md transition-colors"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Grid Section: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Resource Quota */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4 hover:border-slate-700 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Cpu className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              ACTIVE QUOTA
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Resource Allocation</h3>
            <p className="text-xs text-slate-400 mt-1">
              Unlimited multi-agent runs, Gemini 3.1 Pro & 3.6 Flash priority routing.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Monthly Token Limit</span>
              <span className="text-slate-200 font-bold">84.2K / 100K Used</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[84%]" />
            </div>
          </div>

          <button 
            onClick={() => onShowToast('Resource allocation limits are configured.')}
            className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors"
          >
            View Resource Limits
          </button>
        </div>

        {/* Card 2: Security & Authentication */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4 hover:border-slate-700 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              SECURE
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Security & Auth</h3>
            <p className="text-xs text-slate-400 mt-1">
              Protected via Google OAuth & Two-Factor Verification.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" /> Two-Factor Auth
              </span>
              <button
                onClick={() => {
                  onUpdateProfile({ twoFactorEnabled: !userProfile.twoFactorEnabled });
                  onShowToast(`2FA ${!userProfile.twoFactorEnabled ? 'enabled' : 'disabled'}.`);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                  userProfile.twoFactorEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {userProfile.twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-400" /> Email Alerts
              </span>
              <button
                onClick={() => {
                  onUpdateProfile({ notificationsEnabled: !userProfile.notificationsEnabled });
                  onShowToast(`Email notifications ${!userProfile.notificationsEnabled ? 'enabled' : 'disabled'}.`);
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                  userProfile.notificationsEnabled
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {userProfile.notificationsEnabled ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
          </div>

          <button 
            onClick={() => onShowToast('Password reset link sent to your registered email.')}
            className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors"
          >
            Reset Password
          </button>
        </div>

        {/* Card 3: Usage & Telemetry Stats */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4 hover:border-slate-700 transition-all shadow-xl">
          <div className="flex items-center justify-between">
            <span className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Activity className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              METRICS
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Usage Summary</h3>
            <p className="text-xs text-slate-400 mt-1">
              Telemetry from multi-agent pipeline executions.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Pipeline Runs</span>
              <span className="text-white font-bold text-sm">142 Execs</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Avg Latency</span>
              <span className="text-emerald-400 font-bold text-sm">4.2s</span>
            </div>
          </div>

          <button 
            onClick={() => onShowToast('Exported account telemetry data as CSV.')}
            className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Export Telemetry CSV
          </button>
        </div>
      </div>

      {/* API Key Management Section */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-400" /> API Keys & Access Credentials
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Personal authentication keys for programmatic API access and Gemini model routing.
            </p>
          </div>
          <button
            onClick={() => onShowToast('New API Key generated successfully.')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate New Secret Key
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200">Google Gemini API Workspace Key</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SYSTEM CONNECTED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Key ID: <span className="font-mono text-slate-300">key-gemini-3.6-pro-2026</span> • Created Aug 2026
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyApiKey}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs transition-colors"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
