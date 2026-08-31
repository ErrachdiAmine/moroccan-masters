import React from 'react';
import { Search, Grid, List } from 'lucide-react';

const CITIES = [
  "Agadir", "Aït Melloul", "Beni Mellal", "Berrechid", "Casablanca", 
  "El Jadida", "Errachidia", "Es-Semara", "Fès", "Guelmim", "Kenitra", 
  "Khouribga", "Laâyoune", "Marrakech", "Martil", "Meknès", "Mohammedia", 
  "Ouarzazate", "Oujda", "Rabat", "Settat", "Tangier", "Taroudant", "Tétouan"
];

const FACULTIES = [
  { label: "All Schools & Faculties", value: "ALL" },
  { label: "FLSH / FLLA (Letters & Languages)", value: "FLSH" },
  { label: "ESEF / ENS (Education & TEFL)", value: "ESEF" },
  { label: "FSJES / FEG (Economics & Law)", value: "FSJES" },
  { label: "FSA / FST / FS (Sciences)", value: "FSA" },
  { label: "ENCG (Commerce & Management)", value: "ENCG" },
  { label: "EST / ENSA / ENSAM (Engineering)", value: "EST" },
  { label: "ISMAC / ISSS / FMP (Institutes)", value: "INSTITUTES" }
];

const SPECIALIZATIONS = [
  { label: "All Specializations", value: "ALL" },
  { label: "English & Linguistics", value: "Linguistics" },
  { label: "Literature & Culture", value: "Literature" },
  { label: "TEFL & Education", value: "TEFL" },
  { label: "Media & Communication", value: "Communication" },
  { label: "Sciences & Technology", value: "Sciences" },
  { label: "Economics & Management", value: "Economics" },
  { label: "Law & Humanities", value: "Law" }
];

const SOURCES = [
  { label: "All Portals", value: "ALL" },
  { label: "UM5 Preins (Rabat)", value: "UM5_PREINS" },
  { label: "UH2 Concours (Casablanca)", value: "UH2_PORTAL" },
  { label: "AlMaster Maroc Feed", value: "ALMASTER_BLOGGER" },
  { label: "Curated Orientation", value: "CURATED" }
];

export default function FilterToolbar({
  search,
  setSearch,
  city,
  setCity,
  faculty,
  setFaculty,
  specialization,
  setSpecialization,
  source,
  setSource,
  viewMode,
  setViewMode
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
      
      {/* Top Search Bar & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Master title, university, or city (e.g. TEFL, FLSH, Agadir, Ouarzazate)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        {/* View Mode Switches */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            title="Grid view"
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'cards'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Table list view"
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'table'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 border-t border-slate-800/60">
        
        {/* City Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            City / Region
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Cities (Morocco)</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Faculty / School Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            School / Faculty Type
          </label>
          <select
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {FACULTIES.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Specialization Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Specialization
          </label>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {SPECIALIZATIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Portal Source
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {SOURCES.map((src) => (
              <option key={src.value} value={src.value}>{src.label}</option>
            ))}
          </select>
        </div>

      </div>

    </div>
  );
}
