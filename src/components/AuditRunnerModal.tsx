import { FC, useState, useEffect } from 'react';
import { Sparkles, Shield, Cpu, CheckCircle2, Zap, AlertCircle } from 'lucide-react';
import { LeadOrg, AgentRole } from '../types';

interface AuditRunnerModalProps {
  lead: LeadOrg;
  onClose: () => void;
  onComplete: () => void;
}

export const AuditRunnerModal: FC<AuditRunnerModalProps> = ({ lead, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      agent: 'SNIPER' as AgentRole,
      title: 'Scan de vulnérabilités & Cartographie Entra ID',
      desc: `Analyse des flux d'authentification de ${lead.name}, statut: '${lead.entraIdTenantStatus}'. Détection des faiblesses MFA et des jetons d'accès.`,
      duration: 1200
    },
    {
      agent: 'MEM' as AgentRole,
      title: 'Indexation & Corrélation Loi 25 (QC) et CAI',
      desc: `Évaluation des 42 articles Loi 25 (articles 3.1, 8, 12, 17). Calcul du risque pécuniaire (${(lead.maxSanctionRisk / 1000000).toFixed(1)} M$).`,
      duration: 1400
    },
    {
      agent: 'COMMS' as AgentRole,
      title: 'Rédaction Exécutive & Certification 2500$ CAD',
      desc: `Synthèse décisionnelle, plan de remédiation J+7/J+30/J+90 et apposition de la signature cryptographique SHA-256 NetSecurePro.`,
      duration: 1200
    }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), steps[0].duration);
    const timer2 = setTimeout(() => setCurrentStep(2), steps[0].duration + steps[1].duration);
    const timer3 = setTimeout(() => {
      setCurrentStep(3);
      setTimeout(() => {
        onComplete();
      }, 700);
    }, steps[0].duration + steps[1].duration + steps[2].duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400">
              CLUSTER MULTI-AGENTS EN COURS D&apos;EXÉCUTION
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">2500$ CAD VALUE</span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">
            Audit de Conformité : {lead.name}
          </h3>
          <p className="text-xs text-slate-400">
            Protocole souverain coordonné par les agents autonomes Z-PUCE V5.0.0.
          </p>
        </div>

        {/* Steps Visualizer */}
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            const isPending = currentStep < idx;

            return (
              <div
                key={step.agent}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-slate-950 border-emerald-500 ring-1 ring-emerald-500/40 shadow-lg'
                    : isCompleted
                    ? 'bg-slate-950/60 border-slate-800 opacity-90'
                    : 'bg-slate-950/30 border-slate-900 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        step.agent === 'SNIPER'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : step.agent === 'MEM'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      [{step.agent}]
                    </span>
                    <span className="text-xs font-semibold text-white">{step.title}</span>
                  </div>

                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Zap className="w-4 h-4 text-emerald-400 animate-bounce" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </div>

                {isCurrent && (
                  <p className="text-[11px] text-slate-300 mt-2 font-mono leading-relaxed animate-pulse">
                    &gt; {step.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Inférence locale : 127.0.0.1:11434</span>
          <span>{currentStep === 3 ? 'Finalisation...' : 'Traitement en temps réel'}</span>
        </div>
      </div>
    </div>
  );
};
