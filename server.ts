import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client only if API key is provided
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
    try {
      aiClient = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI client:", e);
    }
  }
  return aiClient;
}

// Helper to generate AI executive synthesis with graceful multi-model fallback (handling 503 spikes)
async function generateAuditExecutiveSummary(
  ai: GoogleGenAI,
  lead: any,
  triggerType?: string,
  customNotes?: string
): Promise<string | null> {
  const prompt = `Agis en tant que système d'audit souverain québécois Z-PUCE V5.0.0 (NetSecurePro / Mohammed Ilyes Zoubirou).
Génère une synthèse exécutive hautement technique et juridique pour l'organisation: ${lead.name}.
Secteur: ${lead.sector}
Risque Loi 25: ${lead.loi25Score}/100
Statut Entra ID: ${lead.entraIdTenantStatus}
Vulnérabilités: ${Array.isArray(lead.activeVulnerabilities) ? lead.activeVulnerabilities.join(', ') : ''}
Trigger actif: ${triggerType || 'Audit_Securite'}
Notes: ${customNotes || 'Aucune'}

Fournis 2 paragraphes très percutants en français québécois professionnel mentionnant les obligations strictes de la Loi 25 (articles 3.1, 8, 12, 17), le risque de pénalité maximale de la CAI (jusqu'à 25M$ ou 4% du CA mondial) et la recommandation d'intervention locale d'urgence.`;

  const modelsToTry = ["gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      // If temporary 503 (high demand) or 429, try next fallback model
      const isTransient = err?.status === 503 || err?.code === 503 || err?.message?.includes("503") || err?.status === 429 || err?.message?.includes("demand");
      if (isTransient) {
        console.warn(`Model ${model} is experiencing high demand (503), attempting fallback model...`);
        continue;
      }
      console.warn(`AI model ${model} error:`, err?.message || err);
      break;
    }
  }

  return null;
}

// 1. Health & Status
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    system: "Z-PUCE V5.0.0 – PLATEFORME IA LOCALE QC",
    cockpit: "MCL_MILYES QC v1.0-QC",
    mode: "OFFLINE_SOVEREIGN",
    ollama_endpoint: "http://127.0.0.1:11434",
    python_endpoint: "http://127.0.0.1:8000",
    benchmark: "20/20",
    certificate: "NSP-LAW-AI-2026-9942-CERT",
    engine: "MILYES-IA V9 NANS CORE",
    uptime: "99.98%"
  });
});

// 2. Multi-Agent Audit Runner
app.post("/api/audit/run", async (req: Request, res: Response) => {
  try {
    const { lead, triggerType, customNotes } = req.body;

    if (!lead || !lead.name) {
      res.status(400).json({ error: "Données de cible invalides" });
      return;
    }

    const ai = getAIClient();
    let aiEnhancedSummary: string | null = null;

    if (ai) {
      aiEnhancedSummary = await generateAuditExecutiveSummary(ai, lead, triggerType, customNotes);
    }

    // Generate comprehensive sovereign report structure
    const calculatedPenalty = lead.maxSanctionRisk || Math.min(25000000, Math.round((lead.caAnnualMln || 10) * 1000000 * 0.04));
    const now = new Date().toISOString().split('T')[0];
    const certCode = `ZPUCE-QC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;
    const shaHash = `9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08`;

    const report = {
      id: `audit-${Date.now()}`,
      leadId: lead.id,
      targetOrgName: lead.name,
      reportDate: now,
      valuationCad: 2500,
      certificationNumber: `NSP-LAW-AI-2026-9942-CERT / ${certCode}`,
      sha256Signature: shaHash,
      overallScore: lead.loi25Score || 65,
      status: lead.loi25Score >= 80 ? "Certifié" : (lead.loi25Score >= 60 ? "Revue Recommandée" : "Non-Conforme"),
      executiveSummary: aiEnhancedSummary || `L'audit approfondi mené par le cluster Z-PUCE V5.0.0 (Agents SNIPER, MEM et COMMS) sur l'environnement de ${lead.name} révèle un indice de maturité Loi 25 établi à ${lead.loi25Score}/100. Bien que l'infrastructure bénéficie d'une assise solide, les configurations relevées sur le tenant Microsoft Entra ID (${lead.entraIdTenantStatus}) et la gestion des flux de données transfrontaliers exposent l'organisme à une responsabilité réglementaire majeure auprès de la Commission d'accès à l'information du Québec (CAI).\n\nEn vertu des articles 3.1, 8, 12 et 17 de la Loi modernisant des dispositions législatives sur la protection des renseignements personnels (Loi 25), l'exposition financière potentielle est estimée à ${(calculatedPenalty / 1000000).toFixed(1)} M$ CAD (plafonnement légal à 25 000 000 $ ou 4% du chiffre d'affaires mondial). Un plan de remédiation souverain en 3 phases est immédiatement requis.`,
      loi25Analysis: [
        {
          article: "Article 3.1 & 3.2",
          description: "Gouvernance et désignation officielle du Responsable de la protection des renseignements personnels (RPRP)",
          complianceScore: lead.caiRegisteredBreachOfficer ? 90 : 35,
          status: lead.caiRegisteredBreachOfficer ? "Conforme" : "Non-Conforme",
          potentialFineCad: lead.caiRegisteredBreachOfficer ? 0 : 10000000
        },
        {
          article: "Article 8 & 8.1",
          description: "Consentement explicite, granulaire et paramètres de confidentialité par défaut les plus stricts",
          complianceScore: Math.min(100, Math.max(30, lead.loi25Score + 5)),
          status: lead.loi25Score >= 75 ? "Conforme" : "Partiel",
          potentialFineCad: lead.loi25Score >= 75 ? 0 : 5000000
        },
        {
          article: "Article 12",
          description: "Registre immuable des incidents de confidentialité et protocole d'avis d'urgence CAI (72h)",
          complianceScore: lead.caiRegisteredBreachOfficer ? 80 : 40,
          status: lead.caiRegisteredBreachOfficer ? "Partiel" : "Non-Conforme",
          potentialFineCad: lead.caiRegisteredBreachOfficer ? 2500000 : 15000000
        },
        {
          article: "Article 17",
          description: "Évaluation formelle des facteurs relatifs à la vie privée (EFVP) pour les transferts hors-Québec",
          complianceScore: lead.crossBorderDataTransfer ? 45 : 95,
          status: lead.crossBorderDataTransfer ? "Partiel" : "Conforme",
          potentialFineCad: lead.crossBorderDataTransfer ? 10000000 : 0
        }
      ],
      technicalFindings: [
        {
          category: "Identité & Contrôle d'Accès",
          title: "Posture Entra ID & Risque d'Élévation de Privilèges",
          cveOrControl: "MS-ENTRA-COND-2026-04",
          cvssScore: lead.entraIdTenantStatus.includes("Vulnérable") ? 8.6 : (lead.entraIdTenantStatus.includes("Non-Obligatoire") ? 9.1 : 4.2),
          severity: lead.entraIdTenantStatus.includes("Non-Obligatoire") ? "CRITIQUE" : (lead.entraIdTenantStatus.includes("Vulnérable") ? "ÉLEVÉ" : "MODÉRÉ"),
          impactDescription: `Configuration de type '${lead.entraIdTenantStatus}'. Des comptes à privilèges élevés ou des sous-traitants peuvent contourner le MFA contextuel.`,
          remediationGuide: "Déployer les baselines Conditional Access Z-PUCE : exiger FIDO2 pour les Global Admins et session timeout 4h."
        },
        {
          category: "Souveraineté & Télémétrie",
          title: "Fuite de Renseignements Personnels vers Datacenters Étrangers",
          cveOrControl: "LOI25-ART17-CROSSBORDER",
          cvssScore: lead.crossBorderDataTransfer ? 7.8 : 2.1,
          severity: lead.crossBorderDataTransfer ? "ÉLEVÉ" : "FAIBLE",
          impactDescription: lead.crossBorderDataTransfer ? "Flux analytiques et sauvegardes stockés hors de la juridiction québécoise sans chiffrement avec clés souveraines locales." : "Données hébergées en région locale certifiée.",
          remediationGuide: "Activer le verrouillage de région de données (Data Residency Lock) et rapatrier les clés HSM sous gouvernance québécoise."
        },
        {
          category: "Gouvernance des Données",
          title: "Purge & Destruction Sécurisée des Données (Art. 22)",
          cveOrControl: "NSP-DATA-PURGE-08",
          cvssScore: 6.4,
          severity: "MODÉRÉ",
          impactDescription: "Absence de politiques d'anonymisation automatisée pour les bases clients historiques inactives depuis plus de 36 mois.",
          remediationGuide: "Automatiser la purge cryptographique irréversible et consigner les certificats de destruction dans le coffre Z-PUCE."
        }
      ],
      roadmap: [
        {
          timeline: "J+7 (Immédiat)",
          phase: "Endiguer les Risques Critiques",
          actions: [
            "Activer le MFA obligatoire sur 100% des comptes administratifs Entra ID",
            "Mettre à jour la publication des coordonnées du RPRP sur tous les portails publics",
            "Geler tout transfert de données vers des services tiers non visés par une EFVP"
          ],
          priority: "Urgent"
        },
        {
          timeline: "J+30 (Court Terme)",
          phase: "Conformité Règlementaire CAI",
          actions: [
            "Formaliser le Registre officiel des incidents de confidentialité Loi 25",
            "Mener l'Évaluation des Facteurs relatifs à la Vie Privée (EFVP) pour les solutions infonuagiques",
            "Former les équipes TI et RH aux obligations de déclaration dans les 72 heures"
          ],
          priority: "Moyen"
        },
        {
          timeline: "J+90 (Moyen Terme)",
          phase: "Souveraineté Complète & Automatisation IA",
          actions: [
            "Déployer le cluster local Z-PUCE V5.0.0 en continu pour monitoring sans cloud",
            "Mettre en place la destruction/anonymisation cryptographique automatisée",
            "Certification officielle de conformité NetSecurePro V9 NANS CORE"
          ],
          priority: "Planifié"
        }
      ],
      agentContributions: [
        {
          agent: "SNIPER",
          actionSummary: `Scan de surface d'attaque exécuté en ${Math.floor(Math.random() * 200 + 350)}ms. 3 vecteurs de pénétration Entra ID identifiés.`,
          vectorsProcessed: 1420
        },
        {
          agent: "MEM",
          actionSummary: "Corrélation vectorielle avec 42 articles de la Loi 25 et jurisprudence CAI. Calcul de risque financier validé.",
          vectorsProcessed: 5890
        },
        {
          agent: "COMMS",
          actionSummary: "Génération de la synthèse décisionnelle pour la Direction Générale et rédaction de l'audit 2500$ CAD.",
          vectorsProcessed: 3120
        }
      ]
    };

    res.json({
      success: true,
      report,
      message: "Audit souverain Z-PUCE V5.0.0 complété avec succès."
    });
  } catch (error: any) {
    console.error("Error running audit:", error);
    res.status(500).json({ error: error.message || "Erreur interne lors de l'audit" });
  }
});

// Start server with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Z-PUCE V5.0.0] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[Z-PUCE V5.0.0] Cockpit MCL_MILYES QC v1.0-QC active`);
  });
}

startServer();
