import React from 'react';
import { ExternalLink, Bookmark, Calendar, MapPin, Building2, Globe, GraduationCap } from 'lucide-react';

export default function ProgramList({ programs, onToggleBookmark, viewMode, isLoading }) {
  
  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-5 w-20 bg-slate-800 rounded-md"></div>
              <div className="h-8 w-8 bg-slate-800 rounded-xl"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-slate-800 rounded-md"></div>
              <div className="h-4 w-1/2 bg-slate-800/60 rounded-md"></div>
            </div>
            <div className="h-4 w-1/3 bg-slate-800/40 rounded-md"></div>
            <div className="pt-3 border-t border-slate-800">
              <div className="h-9 w-full bg-slate-800 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!programs || programs.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-base font-bold text-white">No Master Programs Found</h3>
        <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
      </div>
    );
  }

  const calculateDaysLeft = (deadlineStr) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const today = new Date("2026-08-31");
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4">
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((prog) => {
            const daysLeft = calculateDaysLeft(prog.deadline);
            const isUrgent = daysLeft !== null && daysLeft <= 7;

            return (
              <div
                key={prog.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Top Bar: City & Bookmark Star */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {prog.city}
                    </span>

                    <button
                      onClick={() => onToggleBookmark(prog)}
                      className={`p-2 rounded-xl transition cursor-pointer ${
                        prog.is_saved
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                      title={prog.is_saved ? 'Remove Bookmark' : 'Bookmark Master'}
                    >
                      <Bookmark className={`w-4 h-4 ${prog.is_saved ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Title & University */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" /> {prog.university}
                    </p>
                  </div>

                  {/* Deadline & Source */}
                  <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                    {prog.deadline && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-bold text-xs ${
                        isUrgent
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        <Calendar className="w-3.5 h-3.5" />
                        Deadline: {prog.deadline}
                        {daysLeft !== null && (
                          <span className="text-[10px]">
                            ({daysLeft === 0 ? 'CLOSING TODAY' : daysLeft > 0 ? `${daysLeft} days left` : 'Closed'})
                          </span>
                        )}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[11px]">
                      <Globe className="w-3 h-3" /> {prog.source}
                    </span>
                  </div>

                </div>

                {/* Direct Inscription Action Link */}
                <div className="pt-3 border-t border-slate-800/80">
                  <a
                    href={prog.portal_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    Direct Inscription / Official Notice <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Bookmark</th>
                <th className="p-4">Master Program Title</th>
                <th className="p-4">University & City</th>
                <th className="p-4">Deadline</th>
                <th className="p-4 text-right">Portal Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {programs.map((prog) => (
                <tr key={prog.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-4">
                    <button
                      onClick={() => onToggleBookmark(prog)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        prog.is_saved ? 'text-amber-400' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${prog.is_saved ? 'fill-amber-400' : ''}`} />
                    </button>
                  </td>
                  <td className="p-4 font-bold text-white">{prog.title}</td>
                  <td className="p-4">{prog.university} ({prog.city})</td>
                  <td className="p-4">
                    <span className="font-semibold text-emerald-400">{prog.deadline || 'Ongoing'}</span>
                  </td>
                  <td className="p-4 text-right">
                    <a
                      href={prog.portal_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                    >
                      Apply / Notice <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
