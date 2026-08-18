import { LeadOrg } from '../types';

export const INITIAL_LEADS: LeadOrg[] = [
  {
    id: 'lead-bnc',
    name: 'Banque Nationale du Canada',
    sector: 'Banque & Finance',
    headquarters: 'Montréal, QC (600 De La Gauchetière O)',
    employees: 30000,
    caAnnualMln: 10450,
    cisoContact: 'Direction Cybersécurité & Données Clientes',
    entraIdTenantStatus: 'Hybride Vulnérable',
    loi25Score: 78,
    overallRisk: 'MODÉRÉ',
    maxSanctionRisk: 25000000, // Plafond 25M$
    activeVulnerabilities: [
      'Entra ID Pass-Through Auth synchronisé sans MFA Conditional Access sur partenaires TI',
      'Flux télémétrie vers datacenters US (AWS us-east-1) sans EFVP formalisée (Loi 25 art. 17)',
      'Registre de consentement biométrique mobile non audité'
    ],
    crossBorderDataTransfer: true,
    caiRegisteredBreachOfficer: true,
    lastAuditDate: '2026-06-12',
    notes: 'Priorité d\'intervention : Audit des tiers fournisseurs et registre des incidents de confidentialité.'
  },
  {
    id: 'lead-desjardins',
    name: 'Mouvement Desjardins',
    sector: 'Banque & Finance',
    headquarters: 'Lévis, QC (100 Rue des Commandeurs)',
    employees: 59000,
    caAnnualMln: 22100,
    cisoContact: 'Bureau de la Protection des Renseignements Personnels',
    entraIdTenantStatus: 'Legacy ADFS',
    loi25Score: 84,
    overallRisk: 'FAIBLE',
    maxSanctionRisk: 25000000,
    activeVulnerabilities: [
      'Synchronisation résiduelle d\'anciens comptes Active Directory non purgés',
      'Besoin d\'évaluation automatisée des facteurs relatifs à la vie privée (EFVP) pour nouveaux projets IA',
      'Gouvernance des accès privilégiés aux bases de membres AccèsD'
    ],
    crossBorderDataTransfer: false,
    caiRegisteredBreachOfficer: true,
    lastAuditDate: '2026-07-04',
    notes: 'Posture de sécurité renforcée post-2019. Recherche d\'un audit 100% souverain hors-cloud pour conformité CAI.'
  },
  {
    id: 'lead-hydro',
    name: 'Hydro-Québec',
    sector: 'Énergie & Utilités',
    headquarters: 'Montréal, QC (75 René-Lévesque O)',
    employees: 22000,
    caAnnualMln: 16500,
    cisoContact: 'Direction principale Sécurité de l\'Information et Résilience',
    entraIdTenantStatus: 'Hybride Vulnérable',
    loi25Score: 68,
    overallRisk: 'ÉLEVÉ',
    maxSanctionRisk: 25000000,
    activeVulnerabilities: [
      'Exposition potentielle de données de consommation intelligente IoT vers serveurs SaaS externes',
      'Absence de journalisation chiffrée locale sur les sous-stations régionales',
      'MFA non systématique sur les accès télécommandés techniciens de terrain'
    ],
    crossBorderDataTransfer: true,
    caiRegisteredBreachOfficer: true,
    lastAuditDate: '2026-05-18',
    notes: 'Infrastructure critique nationale. Obligation stricte de souveraineté des données sur le territoire québécois.'
  },
  {
    id: 'lead-saq',
    name: 'Société des alcools du Québec (SAQ)',
    sector: 'Société d\'État',
    headquarters: 'Montréal, QC (905 Rue De Lorimier)',
    employees: 7500,
    caAnnualMln: 4100,
    cisoContact: 'Responsable de la conformité numérique & SAQ Inspire',
    entraIdTenantStatus: 'Conditionnel Flou',
    loi25Score: 61,
    overallRisk: 'ÉLEVÉ',
    maxSanctionRisk: 25000000,
    activeVulnerabilities: [
      'Base SAQ Inspire (profilage des habitudes d\'achat) sans opt-in granulaire conforme Loi 25 art. 8.1',
      'Cookies analytiques tiers activés par défaut sur le portail Web',
      'Accès API partenaires logistiques sans contrôle d\'expiration des jetons'
    ],
    crossBorderDataTransfer: true,
    caiRegisteredBreachOfficer: false,
    lastAuditDate: '2026-04-10',
    notes: 'Vulnérabilité légale sur le profilage client et les communications marketing automatisées.'
  },
  {
    id: 'lead-invest-qc',
    name: 'Investissement Québec',
    sector: 'Secteur Public',
    headquarters: 'Québec, QC (1001 Boulevard René-Lévesque E)',
    employees: 1200,
    caAnnualMln: 890,
    cisoContact: 'Délégué à la protection des données & audits TI',
    entraIdTenantStatus: 'Cloud Only Sécurisé',
    loi25Score: 88,
    overallRisk: 'FAIBLE',
    maxSanctionRisk: 25000000,
    activeVulnerabilities: [
      'Politiques de rétention des dossiers de prêts d\'entreprises non automatisées',
      'Gestion des clés de chiffrement partagées avec Microsoft Azure Canada'
    ],
    crossBorderDataTransfer: false,
    caiRegisteredBreachOfficer: true,
    lastAuditDate: '2026-07-29',
    notes: 'Excellente gouvernance. Intérêt marqué pour la solution d\'audit souverain local Z-PUCE V5.0.0.'
  },
  {
    id: 'lead-cgi',
    name: 'CGI Inc.',
    sector: 'Services TI & Conseil',
    headquarters: 'Montréal, QC (1350 René-Lévesque O)',
    employees: 90000,
    caAnnualMln: 14300,
    cisoContact: 'Global Chief Cybersecurity & Privacy Officer',
    entraIdTenantStatus: 'Cloud Only Sécurisé',
    loi25Score: 92,
    overallRisk: 'CONFORME',
    maxSanctionRisk: 25000000,
    activeVulnerabilities: [
      'Audit périodique requis pour les environnements de staging des clients du secteur public québécois'
    ],
    crossBorderDataTransfer: false,
    caiRegisteredBreachOfficer: true,
    lastAuditDate: '2026-08-01',
    notes: 'Leader TI mondial d\'origine montréalaise. Exige des audits automatisés pour ses pipelines DevOps QC.'
  },
  {
    id: 'lead-vdm',
    name: 'Ville de Montréal',
    sector: 'Secteur Public',
    headquarters: 'Montréal, QC (275 Rue Notre-Dame E)',
    employees: 28000,
    caAnnualMln: 6900,
    cisoContact: 'Service des technologies de l\'information (STI)',
    entraIdTenantStatus: 'MFA Non-Obligatoire',
    loi25Score: 49,
    overallRisk: 'CRITIQUE',
    maxSanctionRisk: 25000000,
    activeVulnerabilities: [
      'Comptes administratifs partagés sans journalisation immuable dans certains arrondissements',
      'Systèmes de billetterie citoyenne stockant des pièces d\'identité non chiffrées au repos',
      'Délai de notification d\'incident supérieur à 72h lors des simulations de bris'
    ],
    crossBorderDataTransfer: true,
    caiRegisteredBreachOfficer: false,
    lastAuditDate: '2026-02-14',
    notes: 'Priorité absolue de remédiation : Formation Loi 25 et déploiement de règles de verrouillage Entra ID.'
  },
  {
    id: 'lead-pme-sante',
    name: 'Cliniques Médicales ProSanté QC (Réseau 45 cliniques)',
    sector: 'PME / Manufacturier',
    headquarters: 'Laval, QC',
    employees: 380,
    caAnnualMln: 42,
    cisoContact: 'Direction médicale & Responsable Loi 25 désigné',
    entraIdTenantStatus: 'MFA Non-Obligatoire',
    loi25Score: 42,
    overallRisk: 'CRITIQUE',
    maxSanctionRisk: 1680000, // 4% du CA (1.68 M$)
    activeVulnerabilities: [
      'Dossiers médicaux électroniques (DME) transmis par courriels non chiffrés',
      'Absence de politique de destruction des données après le délai de conservation légal',
      'Faiblesse des mots de passe sur les postes d\'accueil et absence de verrouillage automatique'
    ],
    crossBorderDataTransfer: true,
    caiRegisteredBreachOfficer: false,
    lastAuditDate: '2026-01-20',
    notes: 'PME à haut risque sectoriel (données de santé sensibles). Candidat prioritaire pour le rapport d\'audit Z-PUCE 2500$.'
  }
];
