import React from 'react';
import { FolderCheck, Database, GitCommit, Lightbulb } from 'lucide-react';

export default function DossierChecklist({ checklist, onToggleChecklist }) {
  const readyCount = checklist.filter(c => c.is_completed).length;

  return (
    <div className="space-y-6">
      {/* Document Checklist Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Dossier Checklist</h3>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            {readyCount}/{checklist.length} Ready
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Track essential documents required for pre-registration deposit in Moroccan public universities:
        </p>

        <div className="space-y-2.5">
          {checklist.map((item) => (
            <label
              key={item.id}
              className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition"
            >
              <input
                type="checkbox"
                checked={item.is_completed}
                onChange={() => onToggleChecklist(item.id)}
                className="mt-0.5 rounded border-slate-700 text-emerald-600 bg-slate-900 w-4 h-4 cursor-pointer"
              />
              <span
                className={`text-xs ${
                  item.is_completed ? 'text-slate-400 line-through' : 'text-slate-200 font-medium'
                } leading-tight`}
              >
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Moroccan Selection Workflow */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <GitCommit className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-sm text-white">Selection Process in Morocco</h3>
        </div>

        <div className="relative pl-6 border-l-2 border-slate-800 space-y-4 text-xs">
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900"></div>
            <h4 className="font-semibold text-slate-200">1. Online Pre-Registration</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">Submit S1-S6 grades on emaster / university portal.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900"></div>
            <h4 className="font-semibold text-slate-200">2. Dossier Pre-Selection</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">Formula ranking based on overall average & retake count.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 border-4 border-slate-900"></div>
            <h4 className="font-semibold text-slate-200">3. Written Entrance Exam</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">ELT methodology, linguistics analysis, or literary theory essay.</p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-purple-500 border-4 border-slate-900"></div>
            <h4 className="font-semibold text-slate-200">4. Oral Interview & Registration</h4>
            <p className="text-slate-400 text-[11px] mt-0.5">Interview with university jury & final administrative deposit.</p>
          </div>
        </div>
      </div>

      {/* Advice Box */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-900/50 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
          <Lightbulb className="w-4 h-4" /> Pro Tip for English Majors
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Prepare two clean PDF scans of your transcripts S1-S6: one single combined PDF and individual files. Many Moroccan university portals reject uploads over 2MB.
        </p>
      </div>
    </div>
  );
}
