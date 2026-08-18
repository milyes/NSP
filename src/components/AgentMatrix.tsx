import { FC, useState, FormEvent } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Send, 
  Database, 
  Sliders, 
  Activity, 
  CheckCircle, 
  Zap, 
  Terminal,
  Shield,
  Layers
} from 'lucide-react';
import { AgentStatus, AgentRole } from '../types';

interface AgentMatrixProps {
  agents: AgentStatus[];
  onUpdateAgent: (id: AgentRole, updates: Partial<AgentStatus>) => void;
}

export const AgentMatrix: FC<AgentMatrixProps> = ({
  agents,
  onUpdateAgent,
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<AgentRole>('SNIPER');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'SYSTEM',
      text: 'Cluster tri-agent Z-PUCE V5.0.0 initialisé sur socket locale Ollama :11434. Modèles quantifiés ARM64 opérationnels.',
      time: '12:00:00'
    },
    {
      sender: 'SNIPER',
      text: 'Agent SNIPER paré : 14,200 signatures CVE Entra ID et matrices de reconnaissance chargées en mémoire vive.',
      time: '12:00:02'
    },
    {
      sender: 'MEM',
      text: 'Agent MEM synchronisé : 58,900 vecteurs indexés pour la Loi 25 québécoise et la jurisprudence de la CAI.',
      time: '12:00:03'
    },
    {
      sender: 'COMMS',
      text: 'Agent COMMS prêt : Module d\'exportation des audits formels (2500$ CAD) et gabarits de notification d\'urgence 72h armés.',
      time: '12:00:04'
    }
  ]);

  const activeAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const handleSendPrompt = (e: FormEvent) => {
    e.preventDefault();
    if (!agentPrompt.trim()) return;

    const userText = agentPrompt;
    const now = new Date().toLocaleTimeString();
    setChatHistory((prev) => [...prev, { sender: 'UTILISATEUR', text: userText, time: now }]);
    setAgentPrompt('');
    setIsProcessing(true);

    // Update agent status to analyzing/generating
    onUpdateAgent(activeAgent.id, {
      status: 'generating',
      lastAction: `Traitement de la requête: "${userText.slice(0, 30)}..."`,
      tasksCompleted: activeAgent.tasksCompleted + 1
    });

    setTimeout(() => {
      let responseText = '';
      if (activeAgent.id === 'SNIPER') {
        responseText = `[SNIPER] Analyse d'exposition complétée : Requête "${userText}" analysée contre les politiques d'accès conditionnel Microsoft Entra ID. Détection de 2 comptes de service non soumis au MFA avec jetons OAuth longue durée. Recommandation : activer Conditional Access baseline CA001 immédiatement.`;
      } else if (activeAgent.id === 'MEM') {
        responseText = `[MEM] Référence jurisprudentielle trouvée : En vertu de la Loi 25 (articles 3.1, 8 et 17), l'absence de traçabilité des accès aux données nominatives expose l'organisme à une amende administrative maximale de 10 000 000 $ ou 2% du CA mondial. Recommandation de tenue immédiate du registre immuable.`;
      } else {
        responseText = `[COMMS] Synthèse exécutive générée : "Rapport d'incident préliminaire prêt pour transmission au Conseil d'Administration et au RPRP. Délai de notification CAI : 72 heures respecté. Fiche de remédiation J+7 prête pour export PDF certifié."`;
      }

      setChatHistory((prev) => [
        ...prev,
        { sender: activeAgent.id, text: responseText, time: new Date().toLocaleTimeString() }
      ]);
      setIsProcessing(false);
      onUpdateAgent(activeAgent.id, {
        status: 'idle',
        lastAction: 'Requête complétée avec succès'
      });
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30">
              CLUSTER MULTI-AGENTS
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Inférence Souveraine Locale
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Matrice Tri-Agents : [SNIPER] [MEM] [COMMS]</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Architecture coordonnée d&apos;agents spécialisés pour l&apos;audit de sécurité, l&apos;interprétation juridique Loi 25 et la rédaction exécutive.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                selectedAgentId === agent.id
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              [{agent.id}]
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Agent Details & Parameters / Interactive Live Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Agent Specs & RAG Vectors */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider font-semibold">
                  Agent Sélectionné
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{activeAgent.name}</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono">
                {activeAgent.codename}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              {activeAgent.role}
            </p>

            {/* Performance Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400">Modèle Local :</span>
                <div className="font-mono text-white font-semibold mt-0.5 text-xs truncate">
                  {activeAgent.model}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400">Latence Moyenne :</span>
                <div className="font-mono text-emerald-400 font-semibold mt-0.5 text-xs">
                  {activeAgent.latencyMs} ms
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400">Vecteurs RAG Mémoire :</span>
                <div className="font-mono text-cyan-400 font-semibold mt-0.5 text-xs">
                  {activeAgent.memoryVectors.toLocaleString()} embeddings
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400">Tâches Exécutées :</span>
                <div className="font-mono text-amber-400 font-semibold mt-0.5 text-xs">
                  {activeAgent.tasksCompleted} opérations
                </div>
              </div>
            </div>

            {/* Tuning Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Température (Créativité vs Précision Légale) :</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">{activeAgent.temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={activeAgent.temperature}
                onChange={(e) =>
                  onUpdateAgent(activeAgent.id, { temperature: parseFloat(e.target.value) })
                }
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.0 (Déterministe & Légal)</span>
                <span>1.0 (Exploratoire)</span>
              </div>
            </div>
          </div>

          {/* Memory Inspector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dernière Activité Vectorielle</span>
            </h4>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
              <div className="text-slate-500 text-[10px]"># État du pipeline de connaissances :</div>
              <div className="text-emerald-400 mt-1">✔ {activeAgent.lastAction}</div>
              <div className="text-slate-400 text-[11px] mt-1">
                Indexation : Loi 25 (QC), CAI Jurisprudence 2024-2026, Microsoft Security Compliance Toolkit v1.0.
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Interactive Direct Agent Terminal / Conversation */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between h-[580px] shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white font-mono">
                Session Directe : [{activeAgent.id}]
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              OLLAMA 127.0.0.1:11434 (ARM64)
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto my-3 space-y-2.5 pr-2 font-mono text-xs">
            {chatHistory.map((item, idx) => {
              const isUser = item.sender === 'UTILISATEUR';
              const isSystem = item.sender === 'SYSTEM';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    isUser
                      ? 'bg-slate-800/80 border-slate-700 text-slate-200 ml-6'
                      : isSystem
                      ? 'bg-slate-950 border-cyan-500/30 text-cyan-300'
                      : 'bg-slate-950 border-emerald-500/30 text-slate-200 mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-emerald-400">[{item.sender}]</span>
                    <span>{item.time}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{item.text}</p>
                </div>
              );
            })}

            {isProcessing && (
              <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/40 text-emerald-300 animate-pulse flex items-center gap-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>[{activeAgent.id}] Inférence en cours sur le socket local...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendPrompt} className="pt-2 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder={`Interroger l'agent [${activeAgent.id}] (ex: Vérifier conformité art. 17 ou analyser Entra ID)...`}
              value={agentPrompt}
              onChange={(e) => setAgentPrompt(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-2.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-500 font-mono"
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-1.5 shadow transition-colors"
            >
              <Send className="w-3.5 h-3.5 fill-slate-950" />
              <span className="hidden sm:inline">Exécuter</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
