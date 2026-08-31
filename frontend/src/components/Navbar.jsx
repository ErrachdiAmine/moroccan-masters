import React, { useState } from 'react';
import { GraduationCap, Bookmark, Menu, X, RefreshCw } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  savedCount,
  totalPrograms,
  onTriggerScrape,
  isScraping
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                Morocco Master Portal
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                English Studies Opportunities & Direct Portal Links
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setActiveTab('open')}
              className={`px-4 py-2 rounded-xl font-semibold text-xs transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'open'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Open Masters
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950/50 text-emerald-300">
                {totalPrograms}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarked')}
              className={`px-4 py-2 rounded-xl font-semibold text-xs transition flex items-center gap-2 cursor-pointer ${
                activeTab === 'bookmarked'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              Bookmarked Masters
              {savedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={onTriggerScrape}
              disabled={isScraping}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition border border-slate-700 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin text-emerald-400' : ''}`} />
              {isScraping ? 'Refreshing...' : 'Refresh Portals'}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => { setActiveTab('open'); setMobileMenuOpen(false); }}
            className={`w-full px-4 py-3 rounded-xl font-semibold text-xs flex items-center justify-between ${
              activeTab === 'open' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Open Masters
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/40">{totalPrograms}</span>
          </button>

          <button
            onClick={() => { setActiveTab('bookmarked'); setMobileMenuOpen(false); }}
            className={`w-full px-4 py-3 rounded-xl font-semibold text-xs flex items-center justify-between ${
              activeTab === 'bookmarked' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" /> Bookmarked Masters
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold">{savedCount}</span>
          </button>
        </div>
      )}
    </nav>
  );
}
