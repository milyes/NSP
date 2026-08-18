import { FC, useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  DollarSign, 
  Lock, 
  Hash, 
  Copy, 
  Check,
  RefreshCw
} from 'lucide-react';
import { AuditReport, LeadOrg } from '../types';

interface AuditStudioProps {
  report: AuditReport | null;
  leads: LeadOrg[];
  onGenerateReport: (lead: LeadOrg) => void;
  isLoading: boolean;
}

export const AuditStudio: FC<AuditStudioProps> = ({
  report,
  leads,
  onGenerateReport,
  isLoading,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(leads[0]?.id || '');
  const [copiedSha, setCopiedSha] = useState(false);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const handleCopySha = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.sha256Signature);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!report) return;
    const mdContent = `# RAPPORT D'AUDIT OFFICIEL LOI 25 & CYBERSÉCURITÉ
**Plateforme :** Z-PUCE V5.0.0 (NetSecurePro | Mohammed Ilyes Zoubirou)  
**Numéro de Certification :** ${report.certificationNumber}  
**Date d'émission :** ${report.reportDate}  
**Valeur Marchande Standard :** 2 500 $ CAD  
**Empreinte Numérique SHA-256 :** \`${report.sha256Signature}\`  

---

## 1. ORGANISATION AUDITÉE
- **Nom :** ${report.targetOrgName}
- **Score Global de Conformité :** ${report.overallScore} / 100
- **Statut d'Audit :** ${report.status}

---

## 2. SYNTHÈSE EXÉCUTIVE
${report.executiveSummary}

---

## 3. ANALYSE JURIDIQUE DÉTAILLÉE (LOI 25 QUÉBEC)
${report.loi25Analysis
  .map(
    (item) => `### ${item.article} - ${item.description}
- **Score de conformité :** ${item.complianceScore}% (${item.status})
- **Exposition d'amende potentielle :** ${item.potentialFineCad.toLocaleString()} $ CAD
`
  )
  .join('\n')}

---

## 4. VULNÉRABILITÉS TECHNIQUES TI & POSTURE ENTRA ID
${report.technicalFindings
  .map(
    (f) => `### [${f.severity}] ${f.title} (${f.cveOrControl})
- **Catégorie :** ${f.category} | **Score CVSS :** ${f.cvssScore} / 10
- **Description de l'impact :** ${f.impactDescription}
- **Guide de remédiation :** ${f.remediationGuide}
`
  )
  .join('\n')}

---

## 5. PLAN D'ACTION ET FEUILLE DE ROUTE
${report.roadmap
  .map(
    (r) => `### ${r.timeline} : ${r.phase} [Priorité : ${r.priority}]
${r.actions.map((a) => `- ${a}`).join('\n')}
`
  )
  .join('\n')}

---

## 6. ATTESTATION DES AGENTS AUTONOMES
${report.agentContributions
  .map((c) => `- **[${c.agent}]** : ${c.actionSummary} (${c.vectorsProcessed} vecteurs traités)`)
  .join('\n')}

*Certifié conforme selon les exigences du Règlement Général sur la Protection des Données (RGPD) et de la Loi modernisant des dispositions législatives sur la protection des renseignements personnels (Loi 25 - Gouvernement du Québec).*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RAPPORT_AUDIT_LOI25_${report.targetOrgName.replace(/[^a-zA-Z0-9]/g, '_')}_ZPUCE.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AUDIT_ZPUCE_${report.targetOrgName.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Generator Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30">
              VALEUR COMMERCIALE : 2 500 $ CAD
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Générateur d&apos;Audit Certifié NetSecurePro
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Studio de Rapports d&apos;Audit Formels</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Livrables professionnels complets pour Conseils d&apos;Administration, CISO et conformité Commission d&apos;accès à l&apos;information (CAI).
          </p>
        </div>

        {/* Lead Selection and Generate Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedLeadId}
            onChange={(e) => setSelectedLeadId(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          >
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.loi25Score}%)
              </option>
            ))}
          </select>

          <button
            onClick={() => onGenerateReport(selectedLead)}
            disabled={isLoading}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Génération...' : 'Compiler l\'Audit 2500$'}</span>
          </button>
        </div>
      </div>

      {report ? (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 print:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Rapport certifié pour : <strong className="text-white">{report.targetOrgName}</strong></span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-emerald-400">{report.certificationNumber}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySha}
                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded text-xs border border-slate-700 transition-colors"
                title="Copier le hash SHA-256 de certification"
              >
                {copiedSha ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="font-mono">{copiedSha ? 'Copié !' : 'SHA-256'}</span>
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded text-xs border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Markdown (.md)</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded text-xs border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>JSON</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded text-xs shadow transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer / Exporter PDF</span>
              </button>
            </div>
          </div>

          {/* Printable Formal Document Sheet */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
            {/* Document Header */}
            <div className="border-b border-slate-800 print:border-gray-300 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold print:border-gray-400 print:text-black">
                    RAPPORT OFFICIEL D&apos;AUDIT TI & LOI 25
                  </span>
                  <span className="text-xs text-slate-400 print:text-gray-600 font-mono">
                    Valeur standard : 2 500 $ CAD
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black mt-2">
                  {report.targetOrgName}
                </h1>
                <p className="text-xs text-slate-400 print:text-gray-600 mt-1 font-mono">
                  Émis le {report.reportDate} • Validé par NetSecurePro & Cluster Z-PUCE V5.0.0
                </p>
              </div>

              {/* Score & Status Stamp */}
              <div className="flex items-center gap-4 bg-slate-950 print:bg-gray-100 p-4 rounded-xl border border-slate-800 print:border-gray-300">
                <div className="text-center">
                  <div className="text-xs text-slate-400 print:text-gray-600 font-mono">SCORE LOI 25</div>
                  <div className="text-3xl font-black text-emerald-400 print:text-black">
                    {report.overallScore}%
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-800 print:bg-gray-300" />
                <div className="text-center">
                  <div className="text-xs text-slate-400 print:text-gray-600 font-mono">STATUT</div>
                  <div className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 print:text-black border border-emerald-500/40 print:border-gray-400 mt-1">
                    {report.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Executive Summary */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-emerald-400 print:text-black uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>1. Synthèse Exécutive Décisionnelle</span>
              </h2>
              <div className="bg-slate-950/80 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg p-5 text-xs text-slate-300 print:text-gray-800 leading-relaxed space-y-3 font-sans">
                {report.executiveSummary.split('\n\n').map((par, i) => (
                  <p key={i}>{par}</p>
                ))}
              </div>
            </div>

            {/* 2. Loi 25 Legal Compliance Matrix */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-cyan-400 print:text-black uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>2. Analyse Détaillée des Articles Majeurs Loi 25</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.loi25Analysis.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-slate-950 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white print:text-black text-xs">
                        {item.article}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          item.status === 'Conforme'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.status === 'Partiel'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {item.status} ({item.complianceScore}%)
                      </span>
                    </div>
                    <p className="text-slate-400 print:text-gray-700 text-[11px] leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-2 border-t border-slate-800/80 print:border-gray-300 flex justify-between text-[11px]">
                      <span className="text-slate-400 print:text-gray-600">Exposition CAI :</span>
                      <span className="font-mono font-bold text-rose-400 print:text-black">
                        {item.potentialFineCad > 0 ? `${(item.potentialFineCad / 1000000).toFixed(1)} M$ CAD` : 'Nulle (Conforme)'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Technical Cyber Findings */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-amber-400 print:text-black uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>3. Vulnérabilités Techniques & Recommandations CISO</span>
              </h2>
              <div className="space-y-3">
                {report.technicalFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-slate-950 print:bg-gray-50 border border-slate-800 print:border-gray-300 space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white print:text-black text-xs">
                          {finding.title}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 print:bg-gray-200 text-slate-300 print:text-black">
                          {finding.cveOrControl}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-400 print:text-gray-600 text-[11px]">CVSS: {finding.cvssScore}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            finding.severity === 'CRITIQUE'
                              ? 'bg-rose-500/20 text-rose-300'
                              : finding.severity === 'ÉLEVÉ'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {finding.severity}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-400 print:text-gray-700 text-[11px] leading-relaxed">
                      <strong className="text-slate-300 print:text-black">Impact : </strong>
                      {finding.impactDescription}
                    </p>

                    <div className="bg-slate-900 print:bg-white p-2.5 rounded border border-slate-800 print:border-gray-300 text-[11px] text-emerald-300 print:text-emerald-900">
                      <strong>Remédiation Z-PUCE : </strong>
                      {finding.remediationGuide}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Action Roadmap */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-white print:text-black uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>4. Feuille de Route Opérationnelle (J+7 / J+30 / J+90)</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {report.roadmap.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-slate-950 print:bg-gray-50 border border-slate-800 print:border-gray-300 text-xs space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 print:text-black font-mono">
                          {step.timeline}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 print:bg-gray-200 text-slate-300 print:text-black">
                          {step.priority}
                        </span>
                      </div>
                      <h4 className="font-semibold text-white print:text-black text-xs mt-1">{step.phase}</h4>
                      <ul className="mt-2 space-y-1.5 text-slate-400 print:text-gray-700 text-[11px]">
                        {step.actions.map((act, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Cryptographic Certification & Signatures */}
            <div className="pt-6 border-t border-slate-800 print:border-gray-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white print:text-black flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Certification NetSecurePro Security & Legal Division</span>
                  </div>
                  <div className="text-[11px] text-slate-400 print:text-gray-600 font-mono mt-0.5">
                    Système Homologué : MILYES-IA V9 NANS CORE • Conforme RGPD / EU AI ACT / Loi 25 QC
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400 print:text-gray-600 font-mono">Signataire Référent :</div>
                  <div className="text-xs font-bold text-white print:text-black">Mohammed Ilyes Zoubirou</div>
                </div>
              </div>

              {/* SHA256 Signature Box */}
              <div className="p-3 bg-slate-950 print:bg-gray-100 rounded-lg border border-slate-800 print:border-gray-300 font-mono text-[11px] text-slate-400 print:text-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate max-w-lg">SHA-256 : {report.sha256Signature}</span>
                </div>
                <span className="text-emerald-400 print:text-black font-semibold shrink-0">
                  ✔ INTÉGRITÉ SOUVERAINE VÉRIFIÉE
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Aucun rapport d&apos;audit actif</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Sélectionnez une organisation cible dans la liste ci-dessus et cliquez sur &quot;Compiler l&apos;Audit 2500$&quot; pour lancer l&apos;analyse coordonnée tri-agents.
          </p>
          <button
            onClick={() => onGenerateReport(selectedLead)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg shadow transition-colors"
          >
            Générer l&apos;Audit pour {selectedLead?.name}
          </button>
        </div>
      )}
    </div>
  );
};
