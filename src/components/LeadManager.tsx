import { FC, useState, useMemo, FormEvent } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Globe, 
  UserCheck, 
  DollarSign, 
  Lock, 
  ArrowUpRight,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import { LeadOrg, RiskLevel } from '../types';

interface LeadManagerProps {
  leads: LeadOrg[];
  onAddLead: (lead: LeadOrg) => void;
  onRunAudit: (lead: LeadOrg) => void;
}

export const LeadManager: FC<LeadManagerProps> = ({
  leads,
  onAddLead,
  onRunAudit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [minScore, setMinScore] = useState<number>(0);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'risk' | 'score-asc' | 'score-desc' | 'name' | 'sanction'>('risk');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeLeadDetails, setActiveLeadDetails] = useState<LeadOrg | null>(leads[0] || null);

  // New Lead Form State
  const [newName, setNewName] = useState('');
  const [newSector, setNewSector] = useState<LeadOrg['sector']>('PME / Manufacturier');
  const [newHq, setNewHq] = useState('Québec, QC');
  const [newEmployees, setNewEmployees] = useState(250);
  const [newCa, setNewCa] = useState(35);
  const [newCiso, setNewCiso] = useState('Directeur TI & Conformité');
  const [newEntraId, setNewEntraId] = useState<LeadOrg['entraIdTenantStatus']>('Hybride Vulnérable');
  const [newScore, setNewScore] = useState(55);
  const [newCrossBorder, setNewCrossBorder] = useState(true);
  const [newOfficer, setNewOfficer] = useState(false);
  const [newVulnerabilities, setNewVulnerabilities] = useState('MFA non requis pour télétravail, Absence de registre CAI');

  // Calculate compliance counts
  const complianceCounts = useMemo(() => {
    return {
      all: leads.length,
      critique: leads.filter((l) => l.overallRisk === 'CRITIQUE').length,
      eleve: leads.filter((l) => l.overallRisk === 'ÉLEVÉ').length,
      modere: leads.filter((l) => l.overallRisk === 'MODÉRÉ').length,
      conforme: leads.filter((l) => l.overallRisk === 'CONFORME').length,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const result = leads.filter((lead) => {
      const matchesSearch = !term || 
        lead.name.toLowerCase().includes(term) ||
        lead.headquarters.toLowerCase().includes(term) ||
        lead.cisoContact.toLowerCase().includes(term) ||
        lead.sector.toLowerCase().includes(term) ||
        lead.entraIdTenantStatus.toLowerCase().includes(term) ||
        lead.overallRisk.toLowerCase().includes(term) ||
        lead.activeVulnerabilities.some(v => v.toLowerCase().includes(term));

      const matchesSector = selectedSector === 'ALL' || lead.sector === selectedSector;
      const matchesRisk = selectedRisk === 'ALL' || lead.overallRisk === selectedRisk;
      const matchesScore = lead.loi25Score >= minScore && lead.loi25Score <= maxScore;

      return matchesSearch && matchesSector && matchesRisk && matchesScore;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'score-asc') return a.loi25Score - b.loi25Score;
      if (sortBy === 'score-desc') return b.loi25Score - a.loi25Score;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'sanction') return b.maxSanctionRisk - a.maxSanctionRisk;
      // Default: risk priority (CRITIQUE > ÉLEVÉ > MODÉRÉ > FAIBLE / CONFORME)
      const priority: Record<RiskLevel, number> = { CRITIQUE: 5, ÉLEVÉ: 4, MODÉRÉ: 3, FAIBLE: 2, CONFORME: 1 };
      return (priority[b.overallRisk] || 0) - (priority[a.overallRisk] || 0);
    });
  }, [leads, searchTerm, selectedSector, selectedRisk, minScore, maxScore, sortBy]);

  const isFiltered = searchTerm !== '' || selectedSector !== 'ALL' || selectedRisk !== 'ALL' || minScore > 0 || maxScore < 100;

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSector('ALL');
    setSelectedRisk('ALL');
    setMinScore(0);
    setMaxScore(100);
    setSortBy('risk');
  };

  const handleCreateLead = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    let risk: RiskLevel = 'MODÉRÉ';
    if (newScore < 50) risk = 'CRITIQUE';
    else if (newScore < 70) risk = 'ÉLEVÉ';
    else if (newScore < 85) risk = 'MODÉRÉ';
    else risk = 'CONFORME';

    const maxSanction = Math.min(25000000, Math.round(newCa * 1000000 * 0.04));

    const created: LeadOrg = {
      id: `lead-custom-${Date.now()}`,
      name: newName,
      sector: newSector,
      headquarters: newHq,
      employees: Number(newEmployees),
      caAnnualMln: Number(newCa),
      cisoContact: newCiso,
      entraIdTenantStatus: newEntraId,
      loi25Score: Number(newScore),
      overallRisk: risk,
      maxSanctionRisk: maxSanction,
      activeVulnerabilities: newVulnerabilities.split(',').map((s) => s.trim()).filter(Boolean),
      crossBorderDataTransfer: newCrossBorder,
      caiRegisteredBreachOfficer: newOfficer,
      lastAuditDate: new Date().toISOString().split('T')[0],
      notes: 'Entité ajoutée manuellement pour audit Loi 25 et scan de vulnérabilités Entra ID.'
    };

    onAddLead(created);
    setActiveLeadDetails(created);
    setShowAddModal(false);
    setNewName('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
              RÉPERTOIRE SOUVERAIN QC
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {leads.length} Entités Stratégiques
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Base Leads Intégrée Québec</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Surveillance continue de la posture Loi 25, configurations Microsoft Entra ID et exposition financière CAI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-lg text-xs font-bold shadow-md shadow-emerald-500/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Organisation</span>
          </button>
        </div>
      </div>

      {/* Real-time Search & Compliance Filter Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-lg">
        {/* Top Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Real-Time Input with Clear Button */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="lead-search-input"
              type="text"
              placeholder="Recherche en temps réel par nom, niveau de conformité, ville, contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 text-white text-xs rounded-lg pl-10 pr-9 py-2.5 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:outline-none placeholder:text-slate-500 transition-all font-sans"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Effacer la recherche"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sector Filter */}
          <div className="flex items-center gap-2 min-w-[190px]">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              id="lead-sector-filter"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 text-white text-xs rounded-lg px-2.5 py-2.5 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:outline-none"
            >
              <option value="ALL">Tous les Secteurs</option>
              <option value="Banque & Finance">Banque & Finance</option>
              <option value="Énergie & Utilités">Énergie & Utilités</option>
              <option value="Société d'État">Société d&apos;État</option>
              <option value="Secteur Public">Secteur Public</option>
              <option value="Services TI & Conseil">Services TI & Conseil</option>
              <option value="PME / Manufacturier">PME / Manufacturier</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 min-w-[180px]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              id="lead-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700/80 text-white text-xs rounded-lg px-2.5 py-2.5 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 focus:outline-none"
            >
              <option value="risk">Trier par : Priorité Risque</option>
              <option value="score-asc">Score Loi 25 (Plus faible)</option>
              <option value="score-desc">Score Loi 25 (Plus élevé)</option>
              <option value="sanction">Risque Amende CAI (Max)</option>
              <option value="name">Nom d&apos;organisation (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges for Compliance Level */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <span>Niveau de Conformité :</span>
            </span>

            {/* ALL */}
            <button
              type="button"
              onClick={() => setSelectedRisk('ALL')}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 border ${
                selectedRisk === 'ALL'
                  ? 'bg-slate-100 text-slate-950 border-white shadow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>Tous</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedRisk === 'ALL' ? 'bg-slate-300 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {complianceCounts.all}
              </span>
            </button>

            {/* CRITIQUE */}
            <button
              type="button"
              onClick={() => setSelectedRisk('CRITIQUE')}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 border ${
                selectedRisk === 'CRITIQUE'
                  ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Critique (&lt;50%)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-950/80 text-rose-200 font-mono border border-rose-500/30">
                {complianceCounts.critique}
              </span>
            </button>

            {/* ÉLEVÉ */}
            <button
              type="button"
              onClick={() => setSelectedRisk('ÉLEVÉ')}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 border ${
                selectedRisk === 'ÉLEVÉ'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Élevé (50-69%)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-950/80 text-amber-200 font-mono border border-amber-500/30">
                {complianceCounts.eleve}
              </span>
            </button>

            {/* MODÉRÉ */}
            <button
              type="button"
              onClick={() => setSelectedRisk('MODÉRÉ')}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 border ${
                selectedRisk === 'MODÉRÉ'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Modéré (70-84%)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950/80 text-cyan-200 font-mono border border-cyan-500/30">
                {complianceCounts.modere}
              </span>
            </button>

            {/* CONFORME */}
            <button
              type="button"
              onClick={() => setSelectedRisk('CONFORME')}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 border ${
                selectedRisk === 'CONFORME'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conforme (85%+)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-200 font-mono border border-emerald-500/30">
                {complianceCounts.conforme}
              </span>
            </button>
          </div>

          {/* Results Counter & Reset Button */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">
              <strong className="text-emerald-400">{filteredLeads.length}</strong> / {leads.length} organisation{leads.length > 1 ? 's' : ''}
            </span>
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700"
                title="Réinitialiser tous les filtres"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Leads List + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lead Cards */}
        <div className="lg:col-span-7 space-y-3">
          {filteredLeads.map((lead) => {
            const isSelected = activeLeadDetails?.id === lead.id;
            const scoreColor = lead.loi25Score >= 85 ? 'bg-emerald-400' : lead.loi25Score >= 70 ? 'bg-cyan-400' : lead.loi25Score >= 50 ? 'bg-amber-400' : 'bg-rose-400';
            const scoreTextColor = lead.loi25Score >= 85 ? 'text-emerald-400' : lead.loi25Score >= 70 ? 'text-cyan-400' : lead.loi25Score >= 50 ? 'text-amber-400' : 'text-rose-400';

            return (
              <div
                key={lead.id}
                onClick={() => setActiveLeadDetails(lead)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-sm">{lead.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {lead.sector}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{lead.headquarters}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-bold font-mono inline-block ${
                        lead.overallRisk === 'CRITIQUE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : lead.overallRisk === 'ÉLEVÉ'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : lead.overallRisk === 'MODÉRÉ'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {lead.overallRisk}
                    </span>
                    <div className={`text-xs font-semibold mt-1 font-mono ${scoreTextColor}`}>
                      Conformité: {lead.loi25Score}%
                    </div>
                  </div>
                </div>

                {/* Score Progress Bar */}
                <div className="mt-2.5 w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${scoreColor}`}
                    style={{ width: `${Math.max(5, lead.loi25Score)}%` }}
                  />
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    <span>Entra ID: <strong className="text-slate-200">{lead.entraIdTenantStatus}</strong></span>
                  </span>
                  <span className="text-amber-400 font-mono">
                    Max CAI: {(lead.maxSanctionRisk / 1000000).toFixed(1)} M$
                  </span>
                </div>
              </div>
            );
          })}

          {filteredLeads.length === 0 && (
            <div className="p-10 text-center bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
              <Search className="w-8 h-8 text-slate-500 mx-auto" />
              <div className="text-white font-semibold text-sm">
                Aucune organisation trouvée
              </div>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                Aucun résultat ne correspond à &quot;{searchTerm}&quot; ou aux critères de conformité sélectionnés.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 mt-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Effacer tous les filtres</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Lead Deep Inspector */}
        <div className="lg:col-span-5">
          {activeLeadDetails ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 sticky top-24 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider font-semibold">
                    Dossier d&apos;Audit Actif
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{activeLeadDetails.name}</h3>
                </div>
                <button
                  onClick={() => onRunAudit(activeLeadDetails)}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-md text-xs shadow transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Auditer (2500$)</span>
                </button>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Chiffre d&apos;Affaires :</span>
                  <div className="text-sm font-bold text-white mt-0.5">{activeLeadDetails.caAnnualMln.toLocaleString()} M$ CAD</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Effectif :</span>
                  <div className="text-sm font-bold text-white mt-0.5">{activeLeadDetails.employees.toLocaleString()} employés</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Contact Sécurité / RPRP :</span>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5 truncate">{activeLeadDetails.cisoContact}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400">Plafond Amende CAI :</span>
                  <div className="text-xs font-bold text-rose-400 mt-0.5">
                    {(activeLeadDetails.maxSanctionRisk / 1000000).toFixed(1)} M$ CAD
                  </div>
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>RPRP désigné & inscrit CAI (Art. 3.1)</span>
                  </span>
                  <span className={activeLeadDetails.caiRegisteredBreachOfficer ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {activeLeadDetails.caiRegisteredBreachOfficer ? 'OUI' : 'NON DÉCLARÉ'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Transferts Cloud US sans EFVP (Art. 17)</span>
                  </span>
                  <span className={activeLeadDetails.crossBorderDataTransfer ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {activeLeadDetails.crossBorderDataTransfer ? 'RISQUE DÉTECTÉ' : 'SOUVERAIN LOCAL'}
                  </span>
                </div>
              </div>

              {/* Vulnerabilities List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vulnérabilités Identifiées par [SNIPER]</span>
                </span>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {activeLeadDetails.activeVulnerabilities.map((vuln, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-slate-950/80 rounded border border-rose-500/20 text-[11px] text-rose-200/90 leading-tight flex items-start gap-2"
                    >
                      <span className="text-rose-400 font-mono font-bold">•</span>
                      <span>{vuln}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => onRunAudit(activeLeadDetails)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Générer Rapport d&apos;Audit Certifié 2500$</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm">
              Sélectionnez une organisation pour inspecter son dossier d&apos;audit.
            </div>
          )}
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Ajouter une Cible d&apos;Audit Québec</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Fermer
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom de l&apos;Organisation / Entreprise :</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: PME Manufacturière Beauce Inc."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Secteur d&apos;Activité :</label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="PME / Manufacturier">PME / Manufacturier</option>
                    <option value="Banque & Finance">Banque & Finance</option>
                    <option value="Énergie & Utilités">Énergie & Utilités</option>
                    <option value="Société d'État">Société d&apos;État</option>
                    <option value="Secteur Public">Secteur Public</option>
                    <option value="Services TI & Conseil">Services TI & Conseil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Siège Social :</label>
                  <input
                    type="text"
                    value={newHq}
                    onChange={(e) => setNewHq(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Chiffre d&apos;Affaires Annuel (M$ CAD) :</label>
                  <input
                    type="number"
                    value={newCa}
                    onChange={(e) => setNewCa(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nombre d&apos;Employés :</label>
                  <input
                    type="number"
                    value={newEmployees}
                    onChange={(e) => setNewEmployees(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Posture Microsoft Entra ID :</label>
                <select
                  value={newEntraId}
                  onChange={(e) => setNewEntraId(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Hybride Vulnérable">Hybride Vulnérable (MFA partiel)</option>
                  <option value="Legacy ADFS">Legacy ADFS (Comptes synchronisés)</option>
                  <option value="MFA Non-Obligatoire">MFA Non-Obligatoire (Risque élevé)</option>
                  <option value="Conditionnel Flou">Conditionnel Flou</option>
                  <option value="Cloud Only Sécurisé">Cloud Only Sécurisé</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Score Estimé Loi 25 (0 à 100) : {newScore}%</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Vulnérabilités connues (séparées par virgules) :</label>
                <textarea
                  value={newVulnerabilities}
                  onChange={(e) => setNewVulnerabilities(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow"
                >
                  Enregistrer l&apos;Organisation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
