import React from 'react';
import { Search, Grid, List } from 'lucide-react';

const CITIES = [
  "Agadir", "Aït Melloul", "Beni Mellal", "Berrechid", "Casablanca", 
  "El Jadida", "Errachidia", "Es-Semara", "Fès", "Guelmim", 
  "Kenitra", "Khouribga", "Laâyoune", "Marrakech", "Martil", 
  "Meknès", "Mohammedia", "Ouarzazate", "Oujda", "Rabat", 
  "Settat", "Tangier", "Taroudant", "Tétouan"
];

export default function FilterToolbar({
  search,
  setSearch,
  city,
  setCity,
  specialization,
  setSpecialization,
  source,
  setSource,
  viewMode,
  setViewMode
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs, universities, cities (e.g. Ouarzazate, Fès, Applied Linguistics)..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-lg p-1">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer ${
              viewMode === 'cards' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer ${
              viewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" /> Table
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Specialization</label>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Specializations</option>
            <option value="Applied Linguistics & TEFL">Applied Linguistics & TEFL</option>
            <option value="Cultural Studies">Cultural Studies & Literature</option>
            <option value="Media & Communication">Communication & Media</option>
            <option value="Translation & Media Studies">Translation Studies</option>
            <option value="Language & Communication">Language & Communication</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">City / Region</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Cities ({CITIES.length})</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Data Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Sources</option>
            <option value="Almaster Maroc">Almaster-Maroc.com</option>
            <option value="Tawjihnet Portal">Tawjihnet.net</option>
            <option value="UIZ Official Portal">UIZ Official Portal</option>
            <option value="USMBA Official Portal">USMBA Official Portal</option>
            <option value="UM5 Official Portal">UM5 Official Portal</option>
          </select>
        </div>
      </div>
    </div>
  );
}
