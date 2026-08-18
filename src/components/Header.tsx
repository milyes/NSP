import { FC } from 'react';
import { ShieldCheck, Cpu, Terminal, Sparkles, Lock, Building2, FileText, Scale } from 'lucide-react';
import { SystemStats } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  stats: SystemStats;
  toggleMode: () => void;
  onOpenAuditForLead?: () => void;
}

export const Header: FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  stats,
  toggleMode,
}) => {
  const tabs = [
    { id: 'cockpit', label: 'Cockpit MCL_MILYES', icon: Cpu, badge: 'v1.0-QC' },
    { id: 'leads', label: 'Base Leads QC', icon: Building2, badge: '8 Cibles' },
    { id: 'agents', label: 'Agents Tri-Matrix', icon: Sparkles, badge: '3 Actifs' },
    { id: 'audit', label: 'Rapport d\'Audit', icon: FileText, badge: '2500$' },
    { id: 'terminal', label: 'Terminal Termux', icon: Terminal, badge: ':11434' },
    { id: 'legal', label: 'Loi 25 & Certificat', icon: Scale, badge: 'RGPD / EU' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Banner: Sovereign / Offline Status */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 px-4 py-1.5 border-b border-emerald-500/20 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            [MODE: {stats.mode === 'OFFLINE_SOVEREIGN' ? 'OFFLINE SOUVERAIN' : 'HYBRIDE'}]
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400 font-medium">[AGENTS: 3 ACTIFS]</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400 font-semibold">[BENCHMARK: 20/20]</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 hidden md:inline">Zéro Cloud Extérieur • Zéro Fuite de Données</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMode}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-0.5 rounded border border-slate-700 text-slate-300 transition-colors"
            title="Basculer le mode de connectivité souveraine"
          >
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Posture:</span>
            <span className="font-semibold text-emerald-400">
              {stats.mode === 'OFFLINE_SOVEREIGN' ? '100% Locale' : 'Hybride Accéléré'}
            </span>
          </button>
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-900/30 text-emerald-300 text-[11px] px-2 py-0.5 rounded border border-emerald-700/50 font-mono">
            <ShieldCheck className="w-3 h-3" />
            <span>LICENCE: NSP-LAW-AI-2026-9942-CERT</span>
          </div>
        </div>
      </div>

      {/* Main App Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 via-cyan-600 to-blue-700 p-0.5 shadow-lg shadow-emerald-900/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                Z‑PUCE <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">V5.0.0</span>
              </h1>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">• PLATEFORME IA LOCALE QC</span>
            </div>
            <p className="text-xs text-slate-400">
              NetSecurePro <span className="text-slate-600">|</span> <span className="text-slate-300">Mohammed Ilyes Zoubirou</span>
            </p>
          </div>
        </div>

        {/* Tabs Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 bg-slate-900/60 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive
                        ? 'bg-slate-950 text-emerald-400'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
