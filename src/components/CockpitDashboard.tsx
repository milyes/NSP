import { FC, useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Play, 
  Zap, 
  Flame, 
  Database, 
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Server
} from 'lucide-react';
import { AgentStatus, LeadOrg, SystemStats, TriggerType } from '../types';

interface CockpitDashboardProps {
  agents: AgentStatus[];
  leads: LeadOrg[];
  stats: SystemStats;
  onLaunchTrigger: (type: TriggerType, targetOrg?: string) => void;
  onRunAuditForLead: (lead: LeadOrg) => void;
  onNavigateTab: (tab: string) => void;
  recentLogs: string[];
}

export const CockpitDashboard: FC<CockpitDashboardProps> = ({
  agents,
  leads,
  stats,
  onLaunchTrigger,
  onRunAuditForLead,
  onNavigateTab,
  recentLogs,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType>('Entra_ID_Vulnerability');

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const criticalLeadsCount = leads.filter((l) => l.overallRisk === 'CRITIQUE' || l.overallRisk === 'ÉLEVÉ').length;
  const avgLoi25 = Math.round(leads.reduce((acc, l) => acc + l.loi25Score, 0) / (leads.length || 1));

  return (
    <div className="space-y-6">
      {/* Top Banner: Cockpit Identification */}
      <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold border border-emerald-500/30">
                COCKPIT: MCL_MILYES QC v1.0-QC
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono">
                ARM64 + OLLAMA:11434
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Plateforme IA Souveraine d&apos;Audit Loi 25 & Cybersécurité
            </h2>
            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
              Solution 100% locale, sans dépendance infonuagique tierce. Automatisation intégrale des audits de conformité,
              analyse des vulnérabilités Microsoft Entra ID et gouvernance des données pour les institutions québécoises.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onRunAuditForLead(selectedLead)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-4 py-2.5 rounded-lg shadow-lg shadow-emerald-500/20 text-xs transition-all transform active:scale-95"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Lancer Audit 3-Agents (2500$)</span>
            </button>
            <button
              onClick={() => onNavigateTab('terminal')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Console Termux</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Organisations Sous Surveillance</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{leads.length}</span>
            <span className="text-xs text-slate-400">cibles stratégiques</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>BNC, Desjardins, Hydro-QC, SAQ...</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Exposition Amendes Loi 25</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400">142.5 M$</span>
            <span className="text-xs text-slate-400">CAD total</span>
          </div>
          <div className="mt-2 text-xs text-amber-400/80 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Plafond CAI : 25 M$ / 4% par entité</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Score Moyen Conformité QC</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">{avgLoi25}%</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="text-rose-400 font-semibold">{criticalLeadsCount} entités</span>
            <span>en zone rouge critique</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Latence Inférence Locale</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-cyan-400">14 ms</span>
            <span className="text-xs text-slate-400">Ollama ARM64</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-mono">
            <span>[BENCHMARK: 20/20] 0 ms cloud leak</span>
          </div>
        </div>
      </div>

      {/* Autonomous 3-Agent Matrix Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Matrice des 3 Agents Autonomes Z‑PUCE
            </h3>
          </div>
          <button
            onClick={() => onNavigateTab('agents')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Détails & Paramètres Modèles</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent) => {
            const isSniper = agent.id === 'SNIPER';
            const isMem = agent.id === 'MEM';
            const accentColor = isSniper
              ? 'border-rose-500/40 bg-rose-950/10'
              : isMem
              ? 'border-cyan-500/40 bg-cyan-950/10'
              : 'border-emerald-500/40 bg-emerald-950/10';

            const badgeColor = isSniper
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              : isMem
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

            return (
              <div
                key={agent.id}
                id={`agent-card-${agent.id}`}
                className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all hover:border-slate-600 ${accentColor}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded border ${badgeColor}`}>
                      [{agent.id}]
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      {agent.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-semibold text-white text-sm mt-2">{agent.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{agent.role}</p>

                  <div className="mt-3 space-y-1.5 text-xs font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-slate-400">
                      <span>Modèle local:</span>
                      <span className="text-slate-200">{agent.model}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Vecteurs RAG:</span>
                      <span className="text-cyan-400">{agent.memoryVectors.toLocaleString()} items</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Latence:</span>
                      <span className="text-emerald-400">{agent.latencyMs} ms</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="truncate max-w-[200px]">{agent.lastAction}</span>
                  <span className="text-slate-500 font-mono">{agent.tasksCompleted} tâches</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trigger Control Center & Target Quick Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Automated Triggers Launcher */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                Triggers Automatiques & Scénarios d&apos;Alerte
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Délai d&apos;exécution: &lt; 800ms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                type: 'Entra_ID_Vulnerability' as TriggerType,
                title: 'Entra_ID_Vulnerability',
                desc: 'Détection MFA manquant & fuite privilèges ADFS',
                color: 'hover:border-rose-500/50 hover:bg-rose-950/20 text-rose-300'
              },
              {
                type: 'Loi25_NonCompliance' as TriggerType,
                title: 'Loi25_NonCompliance',
                desc: 'Défaut RPRP & Registre d\'incidents CAI absent',
                color: 'hover:border-amber-500/50 hover:bg-amber-950/20 text-amber-300'
              },
              {
                type: 'Audit_Securite' as TriggerType,
                title: 'Audit_Securite_TI',
                desc: 'Audit complet 3-agents (valeur marchande 2500$)',
                color: 'hover:border-emerald-500/50 hover:bg-emerald-950/20 text-emerald-300'
              },
              {
                type: 'Data_Transfer_CrossBorder' as TriggerType,
                title: 'Data_Transfer_CrossBorder',
                desc: 'Transfert cloud US sans EFVP (Loi 25 art. 17)',
                color: 'hover:border-cyan-500/50 hover:bg-cyan-950/20 text-cyan-300'
              },
              {
                type: 'Consent_Registry_Failure' as TriggerType,
                title: 'Consent_Registry_Failure',
                desc: 'Profilage non sollicité & cookies non autorisés',
                color: 'hover:border-purple-500/50 hover:bg-purple-950/20 text-purple-300'
              }
            ].map((trig) => (
              <button
                key={trig.type}
                onClick={() => {
                  setSelectedTrigger(trig.type);
                  onLaunchTrigger(trig.type, selectedLead?.name);
                }}
                className={`text-left p-3 rounded-lg border border-slate-800 bg-slate-950/70 transition-all group flex flex-col justify-between ${trig.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white group-hover:text-emerald-300">
                    ⚡ {trig.title}
                  </span>
                  <Play className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{trig.desc}</p>
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-lg border border-slate-800/80">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 whitespace-nowrap">Cible active :</span>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-white text-xs rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none w-full sm:w-64"
              >
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} ({lead.loi25Score}% - {lead.overallRisk})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onLaunchTrigger(selectedTrigger, selectedLead?.name)}
              className="w-full sm:w-auto px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-md flex items-center justify-center gap-1.5 shadow"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Déclencher sur {selectedLead?.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>

        {/* Right Col: Quick Installation Guide & Stack Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Installation Rapide (30s)</span>
              </h3>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800 font-mono">
                ARM64
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300">
              <div className="text-slate-500"># 1. Prérequis Termux + Ollama</div>
              <div className="text-emerald-400">$ pkg install python ollama git</div>
              <div className="text-slate-500 mt-2"># 2. Dézipper le paquet démo</div>
              <div className="text-cyan-300">$ unzip VMS_ZPUCE_V5.0.0_DEMO.zip</div>
              <div className="text-slate-500 mt-2"># 3. Lancer le cluster tri-agent</div>
              <div className="text-amber-300">$ cd clone_zcore_v1/zpuce && bash start.sh</div>
              <div className="text-slate-500 mt-2"># 4. Accès au Cockpit</div>
              <div className="text-white">http://localhost:8000</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Uptime: {stats.uptime}</span>
            </span>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Voir les 8 Leads</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Target Leads Quick Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Cibles Stratégiques Prêtes pour Audit Immédiat</h3>
            <p className="text-xs text-slate-400">Sélectionnez une entité pour lancer l&apos;audit automatisé tri-agents ou inspecter ses vulnérabilités</p>
          </div>
          <button
            onClick={() => onNavigateTab('leads')}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Gestionnaire de Leads Complet</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {leads.slice(0, 4).map((lead) => (
            <div
              key={lead.id}
              className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {lead.sector}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      lead.overallRisk === 'CRITIQUE'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : lead.overallRisk === 'ÉLEVÉ'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {lead.overallRisk}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2 truncate">{lead.name}</h4>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Score Loi 25 :</span>
                  <span className="font-bold text-white">{lead.loi25Score}%</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400 truncate">
                  Entra ID : {lead.entraIdTenantStatus}
                </div>
              </div>

              <button
                onClick={() => onRunAuditForLead(lead)}
                className="w-full py-1.5 px-2.5 rounded bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Zap className="w-3 h-3" />
                <span>Auditer (2500$)</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
