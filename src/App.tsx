import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CockpitDashboard } from './components/CockpitDashboard';
import { LeadManager } from './components/LeadManager';
import { AgentMatrix } from './components/AgentMatrix';
import { AuditStudio } from './components/AuditStudio';
import { TerminalView } from './components/TerminalView';
import { LegalRegistry } from './components/LegalRegistry';
import { AuditRunnerModal } from './components/AuditRunnerModal';
import { TriggerAlertModal } from './components/TriggerAlertModal';

import { INITIAL_LEADS } from './data/mockLeads';
import { INITIAL_AGENTS, PRESET_TRIGGERS } from './data/agentDefinitions';
import { AgentStatus, LeadOrg, SystemStats, AuditReport, TriggerType, TriggerEvent, AgentRole } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('cockpit');
  const [leads, setLeads] = useState<LeadOrg[]>(INITIAL_LEADS);
  const [agents, setAgents] = useState<AgentStatus[]>(INITIAL_AGENTS);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    mode: 'OFFLINE_SOVEREIGN',
    benchmarkScore: '20/20',
    ollamaPort: 11434,
    pythonPort: 8000,
    totalAudited: 8,
    preventedFinesCad: 142500000,
    criticalVulnerabilitiesCount: 14,
    activeAgentsCount: 3,
    uptime: '14j 08h 22m'
  });

  const [activeReport, setActiveReport] = useState<AuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditingLead, setAuditingLead] = useState<LeadOrg | null>(null);
  const [activeTriggerAlert, setActiveTriggerAlert] = useState<TriggerEvent | null>(null);

  const [recentLogs, setRecentLogs] = useState<string[]>([
    'Cluster tri-agent Z-PUCE V5.0.0 actif sur socket locale Ollama :11434',
    'Noyau MILYES-IA V9 NANS CORE validé conforme RGPD / EU AI ACT / Loi 25 QC',
    'Base de connaissances Loi 25 (58,900 vecteurs) synchronisée',
    'Surveillance active sur les tenants Microsoft Entra ID québécois'
  ]);

  // Generate initial sample audit report for instant showcase
  useEffect(() => {
    generateInitialReport(leads[0]);
  }, []);

  const generateInitialReport = async (targetLead: LeadOrg) => {
    try {
      const response = await fetch('/api/audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: targetLead })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.report) {
          setActiveReport(data.report);
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback to local sovereign report creation:', e);
    }

    // Client-side fallback report
    const fallbackReport: AuditReport = {
      id: `audit-${Date.now()}`,
      leadId: targetLead.id,
      targetOrgName: targetLead.name,
      reportDate: new Date().toISOString().split('T')[0],
      valuationCad: 2500,
      certificationNumber: `NSP-LAW-AI-2026-9942-CERT / ZPUCE-QC-BNC`,
      sha256Signature: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      overallScore: targetLead.loi25Score,
      status: targetLead.loi25Score >= 80 ? 'Certifié' : 'Revue Recommandée',
      executiveSummary: `L'audit souverain mené par le cluster Z-PUCE V5.0.0 sur ${targetLead.name} met en évidence un score de conformité Loi 25 de ${targetLead.loi25Score}/100.\n\nLes principaux vecteurs de risque concernent le contrôle d'accès sur le tenant Microsoft Entra ID (${targetLead.entraIdTenantStatus}) et la formalisation des transferts hors-Québec en vertu de l'article 17. L'exposition maximale aux sanctions de la Commission d'accès à l'information (CAI) s'établit à ${(targetLead.maxSanctionRisk / 1000000).toFixed(1)} M$ CAD.`,
      loi25Analysis: [
        {
          article: 'Article 3.1 & 3.2',
          description: 'Désignation officielle du RPRP et publication des politiques',
          complianceScore: targetLead.caiRegisteredBreachOfficer ? 90 : 35,
          status: targetLead.caiRegisteredBreachOfficer ? 'Conforme' : 'Non-Conforme',
          potentialFineCad: targetLead.caiRegisteredBreachOfficer ? 0 : 10000000
        },
        {
          article: 'Article 8 & 8.1',
          description: 'Consentement explicite et paramètres de confidentialité par défaut',
          complianceScore: 75,
          status: 'Partiel',
          potentialFineCad: 5000000
        },
        {
          article: 'Article 12',
          description: 'Registre des incidents et notification obligatoire dans les 72h',
          complianceScore: 70,
          status: 'Partiel',
          potentialFineCad: 5000000
        },
        {
          article: 'Article 17',
          description: 'Évaluation des Facteurs relatifs à la Vie Privée (EFVP) pour transferts cloud US',
          complianceScore: targetLead.crossBorderDataTransfer ? 45 : 95,
          status: targetLead.crossBorderDataTransfer ? 'Partiel' : 'Conforme',
          potentialFineCad: targetLead.crossBorderDataTransfer ? 10000000 : 0
        }
      ],
      technicalFindings: [
        {
          category: 'Identité & Entra ID',
          title: 'Posture de Contrôle d\'Accès Conditionnel',
          cveOrControl: 'MS-ENTRA-2026-QC',
          cvssScore: 8.4,
          severity: 'ÉLEVÉ',
          impactDescription: `Configuration '${targetLead.entraIdTenantStatus}' identifiée sur les accès administratifs.`,
          remediationGuide: 'Déployer les baselines Conditional Access Z-PUCE forçant FIDO2 et session timeout.'
        },
        {
          category: 'Souveraineté des Données',
          title: 'Transfert de Télémétrie hors Juridiction Québécoise',
          cveOrControl: 'LOI25-ART17-DATARESIDENCY',
          cvssScore: 7.2,
          severity: 'MODÉRÉ',
          impactDescription: 'Stockage de sauvegardes résiduelles sur des datacenters infonuagiques US.',
          remediationGuide: 'Activer le verrouillage de résidence territoriale sur la région Canada Central (Montréal).'
        }
      ],
      roadmap: [
        {
          timeline: 'J+7 (Immédiat)',
          phase: 'Verrouillage des Risques Critiques',
          actions: [
            'Forcer le MFA sur 100% des comptes privilégiés',
            'Publication des coordonnées du RPRP sur le portail Web',
            'Gel des transferts non documentés par une EFVP'
          ],
          priority: 'Urgent'
        },
        {
          timeline: 'J+30 (Court Terme)',
          phase: 'Conformité Registre CAI',
          actions: [
            'Déploiement du registre numérique d\'incidents de confidentialité',
            'Évaluation d\'impact formelle (EFVP) signée'
          ],
          priority: 'Moyen'
        },
        {
          timeline: 'J+90 (Moyen Terme)',
          phase: 'Souveraineté Locale Z-PUCE',
          actions: [
            'Monitoring continu sans cloud avec la suite Z-PUCE V5.0.0',
            'Audit de renouvellement annuel de conformité'
          ],
          priority: 'Planifié'
        }
      ],
      agentContributions: [
        {
          agent: 'SNIPER',
          actionSummary: 'Scan de surface d\'attaque et analyse Entra ID complétés en 420ms.',
          vectorsProcessed: 1420
        },
        {
          agent: 'MEM',
          actionSummary: 'Corrélation vectorielle Loi 25 et calcul du risque de sanction CAI.',
          vectorsProcessed: 5890
        },
        {
          agent: 'COMMS',
          actionSummary: 'Génération du livrable professionnel d\'une valeur de 2500$ CAD.',
          vectorsProcessed: 3120
        }
      ]
    };
    setActiveReport(fallbackReport);
  };

  const handleRunAuditForLead = (lead: LeadOrg) => {
    setAuditingLead(lead);
    setIsAuditing(true);
  };

  const handleCompleteAudit = async () => {
    if (!auditingLead) return;
    try {
      const response = await fetch('/api/audit/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead: auditingLead })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.report) {
          setActiveReport(data.report);
        }
      }
    } catch (e) {
      console.warn('Error during audit compilation:', e);
      generateInitialReport(auditingLead);
    }
    setIsAuditing(false);
    setAuditingLead(null);
    setCurrentTab('audit');
  };

  const handleLaunchTrigger = (type: TriggerType, targetOrgName?: string) => {
    const preset = PRESET_TRIGGERS.find((p) => p.type === type) || PRESET_TRIGGERS[0];
    const target = targetOrgName || preset.defaultOrg;

    let responsible: AgentRole = 'SNIPER';
    if (type === 'Loi25_NonCompliance') responsible = 'MEM';
    else if (type === 'Audit_Securite') responsible = 'COMMS';

    const event: TriggerEvent = {
      id: `trig-${Date.now()}`,
      type,
      title: preset.title,
      severity: type === 'Entra_ID_Vulnerability' ? 'CRITIQUE' : 'ÉLEVÉ',
      targetOrg: target,
      timestamp: new Date().toLocaleTimeString(),
      agentResponsible: responsible,
      description: preset.description,
      mitigation: preset.mitigation,
      articleLoi25: preset.article,
      resolved: false
    };

    setActiveTriggerAlert(event);
  };

  const handleAddLead = (newLead: LeadOrg) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleUpdateAgent = (id: AgentRole, updates: Partial<AgentStatus>) => {
    setAgents((prev) =>
      prev.map((agent) => (agent.id === id ? { ...agent, ...updates } : agent))
    );
  };

  const toggleMode = () => {
    setSystemStats((prev) => ({
      ...prev,
      mode: prev.mode === 'OFFLINE_SOVEREIGN' ? 'HYBRID_SOVEREIGN' : 'OFFLINE_SOVEREIGN'
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Global Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        stats={systemStats}
        toggleMode={toggleMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-16">
        {currentTab === 'cockpit' && (
          <CockpitDashboard
            agents={agents}
            leads={leads}
            stats={systemStats}
            onLaunchTrigger={handleLaunchTrigger}
            onRunAuditForLead={handleRunAuditForLead}
            onNavigateTab={setCurrentTab}
            recentLogs={recentLogs}
          />
        )}

        {currentTab === 'leads' && (
          <LeadManager
            leads={leads}
            onAddLead={handleAddLead}
            onRunAudit={handleRunAuditForLead}
          />
        )}

        {currentTab === 'agents' && (
          <AgentMatrix
            agents={agents}
            onUpdateAgent={handleUpdateAgent}
          />
        )}

        {currentTab === 'audit' && (
          <AuditStudio
            report={activeReport}
            leads={leads}
            onGenerateReport={handleRunAuditForLead}
            isLoading={isAuditing}
          />
        )}

        {currentTab === 'terminal' && (
          <TerminalView
            leads={leads}
            onTriggerAudit={handleRunAuditForLead}
          />
        )}

        {currentTab === 'legal' && <LegalRegistry />}
      </main>

      {/* Audit Runner Progress Modal */}
      {isAuditing && auditingLead && (
        <AuditRunnerModal
          lead={auditingLead}
          onClose={() => setIsAuditing(false)}
          onComplete={handleCompleteAudit}
        />
      )}

      {/* Trigger Alert Modal */}
      {activeTriggerAlert && (
        <TriggerAlertModal
          event={activeTriggerAlert}
          onClose={() => setActiveTriggerAlert(null)}
          onRunAudit={(org) => {
            const found = leads.find((l) => l.name === org) || leads[0];
            handleRunAuditForLead(found);
          }}
        />
      )}

      {/* Sovereign Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">●</span>
          <span>Z‑PUCE V5.0.0 • Plateforme IA Locale QC (NetSecurePro)</span>
        </div>
        <div className="text-slate-400">
          Signataire : <strong>Mohammed Ilyes Zoubirou</strong> • N° Licence : NSP-LAW-AI-2026-9942-CERT
        </div>
      </footer>
    </div>
  );
}
