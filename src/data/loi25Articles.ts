export interface Loi25Article {
  article: string;
  titre: string;
  resume: string;
  amendeMaxOrganisme: string;
  sanctionPmeMax: string;
  pointsControleAudit: string[];
}

export const LOI_25_ARTICLES: Loi25Article[] = [
  {
    article: 'Article 3.1 & 3.2',
    titre: 'Désignation officielle du Responsable de la protection des renseignements personnels (RPRP)',
    resume: 'La personne ayant la plus haute autorité au sein de l\'entreprise doit exercer cette fonction ou la déléguer par écrit. Son titre et ses coordonnées doivent être publiés sur le site internet.',
    amendeMaxOrganisme: 'Jusqu\'à 10 000 000 $ ou 2% du CA mondial (pénalité administrative) / 25 000 000 $ ou 4% (poursuites)',
    sanctionPmeMax: '2% à 4% du CA',
    pointsControleAudit: [
      'Présence des coordonnées du RPRP sur la page d\'accueil ou politique de confidentialité',
      'Acte officiel de délégation signé si la fonction n\'est pas exercée par le PDG',
      'Procédure documentée de traitement des plaintes des résidents québécois'
    ]
  },
  {
    article: 'Article 8 & 8.1',
    titre: 'Consentement explicite, manifeste, libre et éclairé & Paramètres par défaut',
    resume: 'Le consentement doit être demandé séparément pour chaque fin spécifique. Les paramètres de confidentialité des produits/services technologiques doivent assurer par défaut le plus haut niveau de confidentialité sans profilage non sollicité.',
    amendeMaxOrganisme: '25 000 000 $ ou 4% du CA mondial',
    sanctionPmeMax: '4% du CA',
    pointsControleAudit: [
      'Absence de cases pré-cochées pour la collecte de renseignements non essentiels',
      'Désactivation par défaut des témoins de traçage et technologies de profilage',
      'Information claire rédigée en français accessible (vocabulaire simple et précis)'
    ]
  },
  {
    article: 'Article 12',
    titre: 'Obligation de tenue d\'un Registre des incidents de confidentialité & Notification obligatoire',
    resume: 'Obligation de consigner tout incident de confidentialité (accès non autorisé, perte, vol). Notification sans délai à la CAI et aux personnes touchées si l\'incident présente un risque de préjudice sérieux.',
    amendeMaxOrganisme: '25 000 000 $ ou 4% du CA',
    sanctionPmeMax: '4% du CA',
    pointsControleAudit: [
      'Existence d\'un registre numérique immuable des bris de sécurité',
      'Matrice d\'évaluation de la gravité du préjudice (sensibilité, conséquences, probabilité)',
      'Protocole d\'alerte d\'urgence 72h vers la Commission d\'accès à l\'information du Québec (CAI)'
    ]
  },
  {
    article: 'Article 17',
    titre: 'Évaluation des facteurs relatifs à la vie privée (EFVP) et Transfert hors Québec',
    resume: 'Avant de communiquer des renseignements hors du Québec (hébergement cloud US, sous-traitants étrangers), l\'organisation doit obligatoirement réaliser une EFVP attestant que les données bénéficieront d\'une protection équivalente.',
    amendeMaxOrganisme: '25 000 000 $ ou 4% du CA',
    sanctionPmeMax: '4% du CA',
    pointsControleAudit: [
      'Cartographie des serveurs et résidences de données (Cloud AWS/Azure/GCP US vs Canada Central)',
      'Contrats écrits avec clauses de protection des données conformes au droit québécois',
      'Évaluation d\'impact formelle (EFVP) documentée et signée par le RPRP'
    ]
  },
  {
    article: 'Article 22 & 23',
    titre: 'Destruction sécurisée ou Anonymisation irréversible des données',
    resume: 'Lorsque la finalité de la collecte est accomplie, les renseignements personnels doivent être détruits de manière sécuritaire ou anonymisés pour utilisation à des fins sérieuses et légitimes.',
    amendeMaxOrganisme: '10 000 000 $ (sanction administrative) / 25 000 000 $ (pénale)',
    sanctionPmeMax: '2% à 4% du CA',
    pointsControleAudit: [
      'Politique de purge automatique des comptes inactifs et données périmées',
      'Procédés cryptographiques certifiés pour l\'anonymisation (impossibilité de ré-identification)',
      'Certificats de destruction physique ou logique des supports de stockage'
    ]
  }
];
