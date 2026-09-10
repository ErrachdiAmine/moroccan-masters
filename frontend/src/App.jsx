import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Bookmark,
  FileCheck,
  Sparkles,
  Filter,
  Building2,
  Calendar,
  Layers,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import ProgramCard from './components/ProgramCard';
import ChecklistModal from './components/ChecklistModal';
import rawPrograms from './data/programs.json';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'urgent', 'bookmarked'
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mm_bookmarks') || '[]');
    } catch {
      return [];
    }
  });
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [checkedDossier, setCheckedDossier] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mm_dossier') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('mm_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('mm_dossier', JSON.stringify(checkedDossier));
  }, [checkedDossier]);

  const toggleBookmark = (id) => {
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]));
  };

  const toggleDossierItem = (id) => {
    setCheckedDossier((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Extract unique cities
  const cities = ['ALL', ...Array.from(new Set(rawPrograms.map((p) => p.city).filter(Boolean)))];

  const filteredPrograms = rawPrograms.filter((p) => {
    // Search match
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      p.title?.toLowerCase().includes(searchLower) ||
      p.university?.toLowerCase().includes(searchLower) ||
      p.city?.toLowerCase().includes(searchLower) ||
      p.specialization?.toLowerCase().includes(searchLower);

    // City match
    const matchesCity = selectedCity === 'ALL' || p.city === selectedCity;

    // Tab match
    if (activeTab === 'bookmarked') {
      return matchesSearch && matchesCity && bookmarks.includes(p.id);
    }
    if (activeTab === 'urgent') {
      if (!p.deadline) return false;
      const days = Math.ceil((new Date(p.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      return matchesSearch && matchesCity && days >= 0 && days <= 5;
    }
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <GraduationCap size={22} />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Morocco Masters</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  LIVE 2026
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Portail National des Concours de Master Universitaire</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChecklistOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
            >
              <FileCheck size={15} className="text-emerald-400" />
              <span className="hidden sm:inline">Dossier de Candidature</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto w-full pt-10 pb-8 text-center sm:text-left">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-emerald-300 text-xs font-mono">
              <Sparkles size={12} />
              <span>VEILLE AUTOMATISÉE DES DÉLAIS DE CANDIDATURE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Trouvez Votre Master au Maroc & <span className="gradient-text-emerald">Postulez Directement</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Explorez les masters ouverts dans les facultés publiques marocaines (FLSH, FSJES, FST, ESEF). Accédez en 1 clic aux formulaires officiels de préinscription.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-row md:flex-col gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center min-w-[120px]">
              <div className="text-xl font-mono font-black text-emerald-400">{rawPrograms.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Masters Répertoriés</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center min-w-[120px]">
              <div className="text-xl font-mono font-black text-cyan-400">{cities.length - 1}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Villes Universitaires</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="px-4 sm:px-8 max-w-7xl mx-auto w-full pb-16 flex-1 space-y-6">
        {/* Search, Filter & Tabs Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par intitulé, université, spécialité..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* City Selector */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {cities.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c === 'ALL' ? 'Toutes les Villes' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation View Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-emerald-500 text-black font-black'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Tous ({rawPrograms.length})
              </button>

              <button
                onClick={() => setActiveTab('urgent')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'urgent'
                    ? 'bg-amber-500 text-black font-black'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                ⏳ Clôture Imminente
              </button>

              <button
                onClick={() => setActiveTab('bookmarked')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'bookmarked'
                    ? 'bg-cyan-500 text-black font-black'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                ⭐ Mes Favoris ({bookmarks.length})
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Résultats : <strong className="text-white">{filteredPrograms.length}</strong> master(s)
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center space-y-3">
            <GraduationCap size={44} className="mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">Aucun master correspondant</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Essayez de modifier votre mot-clé de recherche ou réinitialisez le filtre de ville.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                isBookmarked={bookmarks.includes(program.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-white/5 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Morocco Masters Intelligence • Amine Errachdi</div>
          <div className="font-mono text-[11px]">Données synchronisées avec les portails officiels des universités</div>
        </div>
      </footer>

      {/* Legalized Dossier Checklist Modal */}
      <ChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        checkedItems={checkedDossier}
        onToggleItem={toggleDossierItem}
      />
    </div>
  );
}
