import { AgentStatus } from '../types';

export const INITIAL_AGENTS: AgentStatus[] = [
  {
    id: 'SNIPER',
    name: 'Agent SNIPER (Recon & Détection)',
    codename: 'MCL-SNIPER-QC',
    role: 'Scan de vulnérabilités Entra ID / M365, découverte d\'actifs exposés, détection des fuites télémétriques et configurations d\'accès critiques.',
    status: 'idle',
    model: 'mistral-7b-instruct-v0.3-q4_0',
    temperature: 0.1,
    memoryVectors: 14200,
    lastAction: 'Prêt pour scan de surface d\'attaque et audit Entra ID',
    latencyMs: 18,
    tasksCompleted: 34
  },
  {
    id: 'MEM',
    name: 'Agent MEM (Mémoire Vectorielle & Jurisprudence)',
    codename: 'MCL-MEM-QC',
    role: 'Indexation vectorielle de la Loi 25 québécoise, décisions de la CAI, RGPD & EU AI Act, calcul des pénalités maximales (25M$ / 4%).',
    status: 'idle',
    model: 'llama3.2:3b-q4_k_m',
    temperature: 0.2,
    memoryVectors: 58900,
    lastAction: 'Base vectorielle Loi 25 art. 3.1 à 23 synchronisée en local',
    latencyMs: 12,
    tasksCompleted: 89
  },
  {
    id: 'COMMS',
    name: 'Agent COMMS (Synthèse Exécutive & Avis Officiels)',
    codename: 'MCL-COMMS-QC',
    role: 'Génération de rapports d\'audit d\'une valeur de 2500$, mémos pour CISO/CA, notifications d\'incidents CAI et plans de remédiation.',
    status: 'idle',
    model: 'qwen2.5-coder:7b-instruct',
    temperature: 0.3,
    memoryVectors: 31200,
    lastAction: 'Gabarit de rapport certifié NetSecurePro prêt pour export',
    latencyMs: 24,
    tasksCompleted: 42
  }
];

export const PRESET_TRIGGERS = [
  {
    type: 'Entra_ID_Vulnerability' as const,
    title: 'Vulnérabilité Entra ID / Microsoft 365',
    defaultOrg: 'Banque Nationale du Canada',
    article: 'Loi 25 art. 3.2 & Politiques de Contrôle d\'Accès',
    description: 'Comptes synchronisés sans authentification multifactorielle conditionnelle stricte (MFA) détectés sur le tenant.',
    mitigation: 'Appliquer immédiatement une stratégie Conditional Access bloquant l\'authentification basique et forçant FIDO2/Microsoft Authenticator.'
  },
  {
    type: 'Loi25_NonCompliance' as const,
    title: 'Non-Conformité RPRP & Registre des Incidents',
    defaultOrg: 'Société des alcools du Québec (SAQ)',
    article: 'Loi 25 art. 3.1 & 12',
    description: 'Absence de désignation publique du responsable de la protection des renseignements personnels et registre CAI incomplet.',
    mitigation: 'Publier la délégation officielle du RPRP et déployer le registre cryptographique d\'incidents Z-PUCE.'
  },
  {
    type: 'Data_Transfer_CrossBorder' as const,
    title: 'Transfert de données hors-Québec sans EFVP',
    defaultOrg: 'Hydro-Québec',
    article: 'Loi 25 art. 17',
    description: 'Télémétrie et logs utilisateurs routés vers des datacenters US sans Évaluation des Facteurs relatifs à la Vie Privée.',
    mitigation: 'Relocaliser le traitement dans la région AWS ca-central-1 (Montréal) ou exécuter une EFVP certifiée NetSecurePro.'
  },
  {
    type: 'Consent_Registry_Failure' as const,
    title: 'Défaut de consentement & Profilage actif',
    defaultOrg: 'Cliniques Médicales ProSanté QC (Réseau 45 cliniques)',
    article: 'Loi 25 art. 8 & 8.1',
    description: 'Collecte de données de santé et profilage sans consentement explicite distinct et séparé.',
    mitigation: 'Reconfigurer les formulaires d\'accueil pour séparer les consentements aux soins des consentements analytiques.'
  },
  {
    type: 'Audit_Securite' as const,
    title: 'Audit de Sécurité TI Global',
    defaultOrg: 'Ville de Montréal',
    article: 'Loi 25 art. 3.1 à 23 (Audit Global)',
    description: 'Évaluation exhaustive de la surface d\'attaque réseau, des identités et de la conformité réglementaire CAI.',
    mitigation: 'Lancement du protocole d\'intervention tri-agents [SNIPER] + [MEM] + [COMMS].'
  }
];
