import React from 'react';
import { Bookmark, ExternalLink, Calendar, MapPin, Building2, BookOpen, Clock, AlertTriangle } from 'lucide-react';

export default function ProgramCard({ program, isBookmarked, onToggleBookmark }) {
  const getDaysLeft = (deadlineStr) => {
    if (!deadlineStr) return null;
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysLeft(program.deadline);
  const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
  const isPassed = daysLeft !== null && daysLeft < 0;

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/20">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
              <MapPin size={11} className="text-emerald-400" />
              <span>{program.city}</span>
            </span>

            {isPassed ? (
              <span className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] font-mono text-red-400 font-bold">
                Clôturé
              </span>
            ) : isUrgent ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[11px] font-mono text-amber-300 font-bold animate-pulse">
                <AlertTriangle size={11} />
                <span>Reste {daysLeft}j !</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400 font-bold">
                <Clock size={11} />
                <span>Ouvert</span>
              </span>
            )}
          </div>

          <button
            onClick={() => onToggleBookmark(program.id)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white'
            }`}
            title={isBookmarked ? 'Retirer des favoris' : 'Enregistrer'}
          >
            <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Master Title */}
        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
          {program.title}
        </h3>

        {/* University Name */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Building2 size={13} className="text-emerald-400 shrink-0" />
          <span>{program.university}</span>
        </div>

        {/* Specialization Tag */}
        {program.specialization && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-300 font-mono">
            <BookOpen size={11} className="text-cyan-400" />
            <span>{program.specialization}</span>
          </div>
        )}
      </div>

      {/* Footer / CTA */}
      <div className="pt-4 border-t border-white/5 mt-5 flex items-center justify-between gap-3">
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <Calendar size={12} className="text-slate-500" />
          <span>Date Limite: <strong className="text-slate-200">{program.deadline || 'À préciser'}</strong></span>
        </div>

        <a
          href={program.portal_url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 shrink-0"
        >
          <span>Postuler</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
