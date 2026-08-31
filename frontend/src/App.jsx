import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import StatsBanner from './components/StatsBanner';
import FilterToolbar from './components/FilterToolbar';
import ProgramList from './components/ProgramList';
import BookmarkedMastersView from './components/BookmarkedMastersView';
import fallbackData from './data/live_masters.json';

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

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('ALL');
  const [specialization, setSpecialization] = useState('ALL');
  const [source, setSource] = useState('ALL');
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline', 'status', 'title', 'city'
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

  // Helper for client-side filtering on fallback data
  const filterFallbackData = () => {
    return fallbackData.filter((item) => {
      const matchesSearch = !search || 
        item.title?.toLowerCase().includes(search.toLowerCase()) || 
        item.university?.toLowerCase().includes(search.toLowerCase()) ||
        item.city?.toLowerCase().includes(search.toLowerCase());
      
      const matchesCity = city === 'ALL' || item.city === city;
      const matchesSpec = specialization === 'ALL' || item.specialization === specialization;
      const matchesSource = source === 'ALL' || item.source === source;

      return matchesSearch && matchesCity && matchesSpec && matchesSource;
    });
  };

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
        },
        timeout: 3000
      });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setPrograms(res.data);
      } else {
        setPrograms(filterFallbackData());
      }
    } catch (err) {
      console.warn('Backend API unavailable, using embedded dataset fallback:', err.message);
      setPrograms(filterFallbackData());
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/programs/summary_stats/`, { timeout: 3000 });
      setStats(res.data);
    } catch (err) {
      // Calculate stats client-side from fallback dataset
      const total = fallbackData.length;
      const openCount = fallbackData.filter(p => p.status === 'OPEN').length;
      const closingSoon = fallbackData.filter(p => p.status === 'CLOSING_SOON').length;
      setStats({
        total_programs: total,
        open_programs: openCount,
        closing_soon: closingSoon,
        saved_count: savedIds.length
      });
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

  // Intelligent Sorting Engine
  const sortedPrograms = [...enrichedPrograms].sort((a, b) => {
    const isEnglishA = a.id >= 200 || a.specialization?.includes('Linguistics') || a.title?.toLowerCase().includes('english') || a.title?.toLowerCase().includes('gender') || a.title?.toLowerCase().includes('cultural');
    const isEnglishB = b.id >= 200 || b.specialization?.includes('Linguistics') || b.title?.toLowerCase().includes('english') || b.title?.toLowerCase().includes('gender') || b.title?.toLowerCase().includes('cultural');

    if (sortBy === 'deadline') {
      const todayStr = '2026-08-31';

      const getDeadlineScore = (item) => {
        const d = item.deadline;
        if (!d) return 999999;
        const diffDays = Math.ceil((new Date(d) - new Date(todayStr)) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) {
          return diffDays; // Active/future deadline (0, 1, 2, 5, 10 days...)
        } else {
          return 100000 + Math.abs(diffDays); // Expired deadlines pushed to bottom
        }
      };

      const scoreA = getDeadlineScore(a);
      const scoreB = getDeadlineScore(b);

      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }

      if (isEnglishA && !isEnglishB) return -1;
      if (!isEnglishA && isEnglishB) return 1;

      return 0;
    }

    if (sortBy === 'status') {
      const statusWeight = { 'OPEN': 1, 'CLOSING_SOON': 2, 'UPCOMING': 3, 'CLOSED': 4 };
      return (statusWeight[a.status] || 3) - (statusWeight[b.status] || 3);
    }

    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === 'city') {
      return a.city.localeCompare(b.city);
    }

    return 0;
  });

  const savedPrograms = sortedPrograms.filter((p) => p.is_saved);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Mobile & Desktop Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedIds.length}
        totalPrograms={stats?.total_programs || sortedPrograms.length}
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
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={handleSetViewMode}
            />

            <ProgramList
              programs={sortedPrograms}
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
