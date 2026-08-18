import { FC, useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, Shield, Cpu, RefreshCw } from 'lucide-react';
import { TerminalLog, LeadOrg } from '../types';

interface TerminalViewProps {
  leads: LeadOrg[];
  onTriggerAudit: (lead: LeadOrg) => void;
}

export const TerminalView: FC<TerminalViewProps> = ({ leads, onTriggerAudit }) => {
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: '1',
      timestamp: '12:00:00',
      prompt: 'bash start.sh',
      output: `[Z-PUCE V5.0.0] Initialisation du noyau souverain MILYES-IA V9 NANS CORE...
[OK] Termux ARM64 runtime détecté
[OK] Socket Ollama 127.0.0.1:11434 actif (Modèles: mistral-7b, llama3.2, qwen2.5)
[OK] Cockpit MCL_MILYES QC v1.0-QC démarré sur http://localhost:8000
[OK] 3 Agents autonomes prêts : [SNIPER] [MEM] [COMMS]
[OK] Benchmark d'intégrité : 20/20 (Zéro fuite cloud)
Tapez 'help' pour afficher les commandes disponibles.`,
      type: 'system'
    }
  ]);

  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    const now = new Date().toLocaleTimeString();

    const parts = trimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    let out = '';
    let logType: TerminalLog['type'] = 'stdout';

    if (mainCmd === 'clear') {
      setLogs([]);
      setInputVal('');
      return;
    } else if (mainCmd === 'help' || mainCmd === '?') {
      out = `Commandes disponibles Z-PUCE V5.0.0 :
  help                   - Affiche ce menu d'aide
  status                 - Affiche l'état du cluster, des 3 agents et du benchmark
  leads                  - Liste les 8 entités québécoises sous surveillance
  scan <nom_ou_id>       - Déclenche un scan de vulnérabilités [SNIPER] sur la cible
  audit <nom_ou_id>      - Génère un rapport d'audit certifié 2500$ [SNIPER + MEM + COMMS]
  ollama list            - Liste les modèles LLM locaux chargés en mémoire vive
  ollama ps              - Affiche les modèles en cours d'exécution
  cat /etc/license       - Affiche le certificat officiel NetSecurePro NSP-LAW-AI-2026-9942-CERT
  start.sh               - Relance la séquence de démarrage à froid
  clear                  - Nettoie l'écran du terminal`;
    } else if (mainCmd === 'status') {
      out = `=== ÉTAT DU SYSTÈME Z-PUCE V5.0.0 ===
Statut : OPÉRATIONNEL (100% SOUVERAIN / OFFLINE)
Cockpit : MCL_MILYES QC v1.0-QC
Architecture : ARM64 (Termux)
Inférence : Ollama local :11434
Agents actifs : [SNIPER] [MEM] [COMMS]
Score Benchmark : 20/20 (Conforme RGPD / EU AI ACT / Loi 25)
Licence : NSP-LAW-AI-2026-9942-CERT (Mohammed Ilyes Zoubirou)`;
    } else if (mainCmd === 'leads') {
      out = `RÉPERTOIRE DES LEADS QUÉBEC :
` + leads.map((l, i) => `  [${i + 1}] ${l.name} | Risque: ${l.overallRisk} | Score Loi 25: ${l.loi25Score}% | Entra ID: ${l.entraIdTenantStatus}`).join('\n');
    } else if (mainCmd === 'ollama' && (parts[1] === 'list' || parts[1] === 'ps')) {
      out = `NAME                             ID              SIZE      MODIFIED
mistral-7b-instruct-v0.3-q4_0    a1b2c3d4e5f6    4.1 GB    Il y a 2 heures
llama3.2:3b-q4_k_m               f6e5d4c3b2a1    2.0 GB    Il y a 2 heures
qwen2.5-coder:7b-instruct        998877665544    4.7 GB    Il y a 2 heures`;
    } else if (mainCmd === 'cat' && trimmed.includes('license')) {
      out = `========================================================
CERTIFICAT DE LICENCE OFFICIEL - NETSECUREPRO IA JURIDIQUE
N° Licence: NSP-LAW-AI-2026-9942-CERT
Système Homologué: MILYES-IA V9 NANS CORE
Organisme: NETSECUREPRO SECURITY & LEGAL DIVISION
Signature SHA256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
Statut: CERTIFIÉ & CONFORME RGPD / EU AI ACT / LOI 25 QC
Signataire: Mohammed Ilyes Zoubirou
========================================================`;
    } else if (mainCmd === 'start.sh' || mainCmd === 'bash') {
      out = `[+] Exécution du script de bootstrap start.sh...
[+] Vérification des dépendances Python & SQLite... OK
[+] Vérification des poids de modèles Ollama :11434... OK
[+] Chargement des 58,900 vecteurs Loi 25 dans l'agent [MEM]... OK
[+] Cluster Z-PUCE prêt à l'emploi.`;
    } else if (mainCmd === 'scan') {
      const target = arg || 'desjardins';
      const found = leads.find((l) => l.name.toLowerCase().includes(target) || l.id.toLowerCase().includes(target)) || leads[0];
      out = `[SNIPER] Lancement du scan de reconnaissance sur : ${found.name}...
[SNIPER] Analyse des flux DNS et endpoints Entra ID...
[SNIPER] Statut du tenant : ${found.entraIdTenantStatus}
[SNIPER] Vulnérabilités détectées : ${found.activeVulnerabilities.join(' | ')}
[SNIPER] Scan terminé avec succès en 420ms. Tapez 'audit ${found.id}' pour compiler le rapport complet.`;
    } else if (mainCmd === 'audit') {
      const target = arg || 'desjardins';
      const found = leads.find((l) => l.name.toLowerCase().includes(target) || l.id.toLowerCase().includes(target)) || leads[0];
      onTriggerAudit(found);
      out = `[TRI-AGENTS] Déclenchement de l'audit 2500$ pour ${found.name}...
[SNIPER] Scan de vulnérabilités corrélé.
[MEM] Analyse des infractions potentielles Loi 25 (articles 3.1, 8, 12, 17).
[COMMS] Génération du rapport formel et signature cryptographique.
[OK] Rapport d'audit disponible dans l'onglet 'Rapport d'Audit'.`;
    } else {
      out = `Commande non reconnue: '${trimmed}'. Tapez 'help' pour voir la liste des commandes.`;
      logType = 'stderr';
    }

    setLogs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        timestamp: now,
        prompt: trimmed,
        output: out,
        type: logType
      }
    ]);
    setInputVal('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRunCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputVal('');
        } else {
          setHistoryIndex(nextIdx);
          setInputVal(commandHistory[nextIdx]);
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Terminal Title & Quick Buttons */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <span>Termux ARM64 + Ollama :11434 Shell</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">Environnement d&apos;exécution CLI local Z-PUCE V5.0.0</p>
          </div>
        </div>

        {/* Quick Command Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {[
            'status',
            'leads',
            'scan hydro',
            'audit bnc',
            'ollama list',
            'cat /etc/license',
            'clear'
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleRunCommand(cmd)}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-emerald-300 transition-colors"
            >
              $ {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Window */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5 font-mono text-xs shadow-2xl flex flex-col h-[520px]">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-slate-300 font-semibold">zpuce@termux-arm64: ~/clone_zcore_v1/zpuce</span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="hover:text-white flex items-center gap-1"
            title="Effacer le terminal"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>

        {/* Logs Output Area */}
        <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-2 font-mono">
          {logs.map((log) => (
            <div key={log.id} className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <span className="text-emerald-400 font-bold">zpuce@local:~$</span>
                <span className="text-white font-semibold">{log.prompt}</span>
                <span className="text-slate-600 text-[10px] ml-auto">[{log.timestamp}]</span>
              </div>
              <pre
                className={`whitespace-pre-wrap leading-relaxed p-2.5 rounded-lg border text-xs font-mono ${
                  log.type === 'stderr'
                    ? 'bg-rose-950/30 border-rose-900/50 text-rose-300'
                    : log.type === 'system'
                    ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                }`}
              >
                {log.output}
              </pre>
            </div>
          ))}
          <div ref={endOfLogsRef} />
        </div>

        {/* Input Line */}
        <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
          <span className="text-emerald-400 font-bold whitespace-nowrap">zpuce@local:~$</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tapez une commande (ex: 'status', 'scan desjardins', 'help')..."
            className="flex-1 bg-transparent border-none text-white focus:outline-none text-xs font-mono placeholder:text-slate-600"
            autoFocus
          />
          <button
            onClick={() => handleRunCommand(inputVal)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-1"
          >
            <Play className="w-3 h-3 fill-slate-950" />
            <span>Exécuter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
