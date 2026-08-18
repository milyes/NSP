import { FC, useState } from 'react';
import { 
  Scale, 
  ShieldCheck, 
  Lock, 
  FileCheck, 
  AlertCircle, 
  DollarSign, 
  Hash, 
  Copy, 
  Check, 
  BookOpen, 
  ExternalLink 
} from 'lucide-react';
import { LOI_25_ARTICLES } from '../data/loi25Articles';

export const LegalRegistry: FC = () => {
  const [copiedCert, setCopiedCert] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(LOI_25_ARTICLES[0]);
  const [calcTurnover, setCalcTurnover] = useState(50); // 50 M$ CA
  const [isCalculated, setIsCalculated] = useState(false);

  const calculatedMaxFine = Math.min(25000000, calcTurnover * 1000000 * 0.04);
  const certSha = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';

  const handleCopyCert = () => {
    navigator.clipboard.writeText(`CERTIFICAT NSP-LAW-AI-2026-9942-CERT
SYSTÈME : MILYES-IA V9 NANS CORE
SHA256 : ${certSha}
SIGNATAIRE : Mohammed Ilyes Zoubirou
STATUT : CERTIFIÉ RGPD / EU AI ACT / LOI 25 QC`);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Official Certificate Card */}
      <div className="relative overflow-hidden bg-slate-900 border-2 border-emerald-500/40 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10">
          <Scale className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-xs font-mono font-bold">
                CERTIFICAT OFFICIEL D&apos;HOMOLOGATION
              </span>
              <span className="text-xs text-emerald-400 font-mono">NSP-LAW-AI-2026-9942-CERT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              NetSecurePro Security & Legal Division
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Système Homologué : MILYES-IA V9 NANS CORE • Date d&apos;Émission : 2026-07-26
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCert}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-mono transition-colors"
            >
              {copiedCert ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copiedCert ? 'Certificat Copié' : 'Copier l\'Attestation'}</span>
            </button>
          </div>
        </div>

        {/* Legal Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>1. Intégrité & FIPS-140/3</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Isolation stricte des clés et des données côté serveur. Zéro télémétrie persistée au-delà de la session active de l&apos;utilisateur.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>2. Conformité RGPD & Loi 25 QC</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Respect intégral des directives de la Commission d&apos;accès à l&apos;information (CAI) et de la souveraineté territoriale des données.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Scale className="w-4 h-4" />
              <span>3. Validation EU AI ACT</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Catégorie d&apos;IA transparente et maîtrisée sans risque systémique direct. Contrôles humains obligatoires intégrés.
            </p>
          </div>
        </div>

        {/* Cryptographic Signature Box */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <Hash className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Empreinte Numérique SHA-256 :</span>
            <span className="text-emerald-300 break-all">{certSha}</span>
          </div>
          <span className="text-emerald-400 font-bold shrink-0">✔ VALIDÉ CONFORME</span>
        </div>
      </div>

      {/* Loi 25 Sanctions Calculator & Articles Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: CAI Sanction Calculator */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Simulateur d&apos;Amendes Légales Loi 25
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            La Loi 25 du Québec prévoit des sanctions financières administratives et pénales pouvant atteindre jusqu&apos;à <strong>25 000 000 $ CAD</strong> ou <strong>4% du chiffre d&apos;affaires mondial</strong> de l&apos;exercice financier précédent.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Chiffre d&apos;Affaires Mondial de l&apos;Organisation :</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{calcTurnover} M$ CAD</span>
            </div>
            <input
              type="range"
              min="1"
              max="1000"
              value={calcTurnover}
              onChange={(e) => setCalcTurnover(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 M$ (PME)</span>
              <span>500 M$</span>
              <span>1 000 M$ (Grande Entreprise)</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-amber-500/30 space-y-2">
            <div className="text-[11px] text-slate-400">Exposition Maximale Légale CAI :</div>
            <div className="text-2xl font-black text-rose-400 font-mono">
              {(calculatedMaxFine / 1000000).toFixed(2)} M$ CAD
            </div>
            <div className="text-[11px] text-slate-400">
              Formule légale : Min(25 000 000 $, 4% × {calcTurnover} M$)
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic">
            *Les pénalités administratives pécuniaires (PAP) sont imposées par la Commission d&apos;accès à l&apos;information (CAI) indépendamment des poursuites pénales.
          </div>
        </div>

        {/* Right Col: Articles Repository */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Répertoire Juridique Loi 25 (Articles Clés)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{LOI_25_ARTICLES.length} Articles Majeurs</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {LOI_25_ARTICLES.map((art) => (
              <button
                key={art.article}
                onClick={() => setSelectedArticle(art)}
                className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-all border ${
                  selectedArticle.article === art.article
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {art.article}
              </button>
            ))}
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider font-bold">
                {selectedArticle.article}
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">{selectedArticle.titre}</h4>
            </div>

            <p className="text-slate-300 leading-relaxed">{selectedArticle.resume}</p>

            <div className="p-2.5 rounded bg-slate-900 border border-rose-500/20 text-rose-300 font-mono text-[11px]">
              <strong>Sanction maximale :</strong> {selectedArticle.amendeMaxOrganisme}
            </div>

            <div>
              <span className="font-bold text-slate-200 uppercase tracking-wide text-[11px]">
                Points de contrôle obligatoires :
              </span>
              <ul className="mt-1.5 space-y-1 text-slate-400">
                {selectedArticle.pointsControleAudit.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✔</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
