import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import StatsBanner from './components/StatsBanner';
import FilterToolbar from './components/FilterToolbar';
import ProgramList from './components/ProgramList';
import BookmarkedMastersView from './components/BookmarkedMastersView';

const API_BASE = '/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('open'); // 'open', 'bookmarked'
  const [programs, setPrograms] = useState([]);
  const [stats, setStats] = useState(null);
  const [isScraping, setIsScraping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Per-user Local Storage for Bookmarks
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('user_saved_master_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Filters state
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('ALL');
  const [specialization, setSpecialization] = useState('ALL');
  const [source, setSource] = useState('ALL');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('user_view_mode') || 'cards';
  });

  // Save viewMode preference to localStorage
  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('user_view_mode', mode);
  };

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('user_saved_master_ids', JSON.stringify(savedIds));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }, [savedIds]);

  // Fetch initial data
  const fetchPrograms = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/programs/`, {
        params: {
          search: search || undefined,
          city: city !== 'ALL' ? city : undefined,
          specialization: specialization !== 'ALL' ? specialization : undefined,
          source: source !== 'ALL' ? source : undefined,
        }
      });
      setPrograms(res.data);
    } catch (err) {
      console.error('Error fetching programs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/programs/summary_stats/`);
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchStats();
  }, [search, city, specialization, source]);

  // Actions
  const handleTriggerScrape = async () => {
    setIsScraping(true);
    try {
      await axios.post(`${API_BASE}/programs/trigger_scrape/`);
      await fetchPrograms();
      await fetchStats();
    } catch (err) {
      console.error('Scrape error:', err);
    } finally {
      setIsScraping(false);
    }
  };

  const handleToggleBookmark = (program) => {
    setSavedIds((prev) => {
      if (prev.includes(program.id)) {
        return prev.filter((id) => id !== program.id);
      } else {
        return [...prev, program.id];
      }
    });
  };

  // Map backend programs with local user saved state
  const enrichedPrograms = programs.map((p) => ({
    ...p,
    is_saved: savedIds.includes(p.id)
  }));

  const savedPrograms = enrichedPrograms.filter((p) => p.is_saved);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Mobile & Desktop Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedIds.length}
        totalPrograms={stats?.total_programs || programs.length}
        onTriggerScrape={handleTriggerScrape}
        isScraping={isScraping}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Moroccan University Concours & Pre-registration
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
              Moroccan English Studies Master's Tracker
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Find open Master programs in Applied Linguistics, TEFL, Cultural Studies & Media across Moroccan public universities with direct application portal links.
            </p>
          </div>
        </div>

        {/* Stats Banner */}
        <StatsBanner
          stats={{
            ...stats,
            saved_count: savedIds.length
          }}
        />

        {/* Content Views */}
        {activeTab === 'open' && (
          <div className="space-y-6">
            <FilterToolbar
              search={search}
              setSearch={setSearch}
              city={city}
              setCity={setCity}
              specialization={specialization}
              setSpecialization={setSpecialization}
              source={source}
              setSource={setSource}
              viewMode={viewMode}
              setViewMode={handleSetViewMode}
            />

            <ProgramList
              programs={enrichedPrograms}
              viewMode={viewMode}
              onToggleBookmark={handleToggleBookmark}
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === 'bookmarked' && (
          <BookmarkedMastersView
            savedPrograms={savedPrograms}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        Moroccan Master's Application Tracker • Real-time portal links for English Studies graduates
      </footer>

    </div>
  );
}
