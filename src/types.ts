export type AgentRole = 'SNIPER' | 'MEM' | 'COMMS';

export interface AgentStatus {
  id: AgentRole;
  name: string;
  codename: string;
  role: string;
  status: 'idle' | 'scanning' | 'analyzing' | 'generating' | 'alert';
  model: string;
  temperature: number;
  memoryVectors: number;
  lastAction: string;
  latencyMs: number;
  tasksCompleted: number;
}

export type RiskLevel = 'CRITIQUE' | 'ÉLEVÉ' | 'MODÉRÉ' | 'FAIBLE' | 'CONFORME';

export type TriggerType =
  | 'Entra_ID_Vulnerability'
  | 'Loi25_NonCompliance'
  | 'Audit_Securite'
  | 'Data_Transfer_CrossBorder'
  | 'Consent_Registry_Failure';

export interface TriggerEvent {
  id: string;
  type: TriggerType;
  title: string;
  severity: 'CRITIQUE' | 'ÉLEVÉ' | 'MODÉRÉ';
  targetOrg: string;
  timestamp: string;
  agentResponsible: AgentRole;
  description: string;
  mitigation: string;
  articleLoi25: string;
  resolved: boolean;
}

export interface LeadOrg {
  id: string;
  name: string;
  sector: 'Banque & Finance' | 'Énergie & Utilités' | 'Société d\'État' | 'Secteur Public' | 'Services TI & Conseil' | 'PME / Manufacturier';
  headquarters: string;
  employees: number;
  caAnnualMln: number; // Chiffre d'affaires en M$
  cisoContact: string;
  entraIdTenantStatus: 'Hybride Vulnérable' | 'Legacy ADFS' | 'Cloud Only Sécurisé' | 'MFA Non-Obligatoire' | 'Conditionnel Flou';
  loi25Score: number; // 0 à 100
  overallRisk: RiskLevel;
  maxSanctionRisk: number; // Montant max Loi 25 (jusqu'à 25M$ ou 4%)
  activeVulnerabilities: string[];
  crossBorderDataTransfer: boolean; // US Cloud storage transfer
  caiRegisteredBreachOfficer: boolean;
  lastAuditDate: string;
  notes: string;
}

export interface AuditReport {
  id: string;
  leadId: string;
  targetOrgName: string;
  reportDate: string;
  valuationCad: number; // 2500$ standard
  certificationNumber: string;
  sha256Signature: string;
  overallScore: number;
  status: 'Certifié' | 'En Cours' | 'Revue Recommandée';
  executiveSummary: string;
  loi25Analysis: {
    article: string;
    description: string;
    complianceScore: number;
    status: 'Non-Conforme' | 'Partiel' | 'Conforme';
    potentialFineCad: number;
  }[];
  technicalFindings: {
    category: string;
    title: string;
    cveOrControl: string;
    cvssScore: number;
    severity: RiskLevel;
    impactDescription: string;
    remediationGuide: string;
  }[];
  roadmap: {
    timeline: string;
    phase: string;
    actions: string[];
    priority: 'Urgent' | 'Moyen' | 'Planifié';
  }[];
  agentContributions: {
    agent: AgentRole;
    actionSummary: string;
    vectorsProcessed: number;
  }[];
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  prompt: string;
  output: string;
  type: 'command' | 'stdout' | 'stderr' | 'system' | 'agent';
}

export interface SystemStats {
  mode: 'OFFLINE_SOVEREIGN' | 'HYBRID_SOVEREIGN';
  benchmarkScore: string; // '20/20'
  ollamaPort: number;
  pythonPort: number;
  totalAudited: number;
  preventedFinesCad: number;
  criticalVulnerabilitiesCount: number;
  activeAgentsCount: number;
  uptime: string;
}
