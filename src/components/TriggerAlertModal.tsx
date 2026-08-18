import { FC } from 'react';
import { Flame, ShieldAlert, CheckCircle2, Zap, ArrowRight, X } from 'lucide-react';
import { TriggerEvent } from '../types';

interface TriggerAlertModalProps {
  event: TriggerEvent;
  onClose: () => void;
  onRunAudit: (orgName: string) => void;
}

export const TriggerAlertModal: FC<TriggerAlertModalProps> = ({ event, onClose, onRunAudit }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
              DÉCLENCHEMENT DE TRIGGER : {event.type}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/30">
            SÉVÉRITÉ : {event.severity}
          </span>
          <h3 className="text-lg font-bold text-white mt-2">{event.title}</h3>
          <p className="text-xs text-slate-400 mt-1">
            Organisation ciblée : <strong className="text-emerald-400">{event.targetOrg}</strong> • Agent responsable : [{event.agentResponsible}]
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1">
            <span className="text-slate-400 font-mono text-[10px]">ANALYSE D&apos;INCIDENT :</span>
            <p className="text-slate-300 leading-relaxed">{event.description}</p>
            <div className="text-[11px] text-cyan-400 font-mono pt-1 font-semibold">
              Référence légale : {event.articleLoi25}
            </div>
          </div>

          <div className="bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-500/30 space-y-1">
            <span className="text-emerald-400 font-mono text-[10px] font-bold">PLAN DE MITIGATION RECOMMANDÉ :</span>
            <p className="text-emerald-200 text-xs leading-relaxed">{event.mitigation}</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Fermer l&apos;Alerte
          </button>
          <button
            onClick={() => {
              onClose();
              onRunAudit(event.targetOrg);
            }}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Lancer l&apos;Audit Complet (2500$)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
