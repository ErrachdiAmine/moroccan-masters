import React, { useState, useEffect } from 'react';
import { X, ExternalLink, GraduationCap, CheckCircle2, FileText, Calendar, Search, Sparkles, Loader2, Globe, ShieldCheck, Cpu, BookOpen } from 'lucide-react';
import axios from 'axios';

export default function ProgramDetailModal({ program, isOpen, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dossier');

  useEffect(() => {
    if (program && isOpen) {
      setLoading(true);
      setDetails(null);
      axios.get(`http://127.0.0.1:8000/api/programs/${program.id}/fetch_details/`)
        .then(res => {
          setDetails(res.data);
        })
        .catch(err => {
          console.error("Error fetching program details:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [program, isOpen]);

  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white transition cursor-pointer">
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> AI Data Gathering (Omniroute Alucard)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              <Globe className="w-3 h-3 text-slate-400" /> Live Web Verified
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
            {program.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" /> {program.university} ({program.city})
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Gathering live data via Omniroute AI (Alucard) & official university portals...</p>
          </div>
        ) : details ? (
          <div className="space-y-6">
            
            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('dossier')}
                className={`px-3.5 py-2 rounded-t-lg flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'dossier'
                    ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" /> Dossier Checklist
              </button>

              <button
                onClick={() => setActiveTab('exam')}
                className={`px-3.5 py-2 rounded-t-lg flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'exam'
                    ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" /> Written & Oral Specs
              </button>

              <button
                onClick={() => setActiveTab('modules')}
                className={`px-3.5 py-2 rounded-t-lg flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'modules'
                    ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Curriculum & Modules
              </button>

              <button
                onClick={() => setActiveTab('snippets')}
                className={`px-3.5 py-2 rounded-t-lg flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'snippets'
                    ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Search className="w-4 h-4" /> Live Web Snippets ({details.web_snippets?.length || 0})
              </button>
            </div>

            {/* TAB 1: Dossier Checklist */}
            {activeTab === 'dossier' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1 font-semibold">Selection Procedure:</span>
                  <p className="text-emerald-400 font-extrabold">{details.selection_procedure}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">Required Physical & Legalized Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {details.required_dossier?.map((doc, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2.5 text-slate-200 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">Eligibility Conditions</h4>
                  <div className="space-y-1.5">
                    {details.eligibility_conditions?.map((cond, idx) => (
                      <div key={idx} className="p-2 bg-slate-950 border border-slate-800/80 rounded-md text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {cond}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Exam & Selection Specs */}
            {activeTab === 'exam' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" /> Core Written Concours Exam Topics
                  </h4>
                  <div className="space-y-2">
                    {details.written_exam_topics?.map((topic, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 leading-relaxed font-medium">
                        • {topic}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">Oral Jury Interview Guidelines</h4>
                  <div className="space-y-2">
                    {details.oral_interview_prep?.map((prep, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 leading-relaxed">
                        👉 {prep}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Curriculum Modules */}
            {activeTab === 'modules' && (
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">S1-S4 Master Curriculum & Syllabus Modules</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {details.curriculum_modules?.map((mod, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400">
                      {mod}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Live Web Snippets */}
            {activeTab === 'snippets' && (
              <div className="space-y-3 text-xs">
                {details.web_snippets?.map((snip, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                    <p className="text-slate-300 leading-relaxed">{snip.snippet}</p>
                    {snip.url && (
                      <a
                        href={snip.url.startsWith('http') ? snip.url : `https://${snip.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <ExternalLink className="w-3 h-3" /> View Source Web Link
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Direct University Link Button */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <a
                href={program.portal_url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center gap-2 text-xs shadow-lg shadow-emerald-600/20"
              >
                Launch Official Notice / Portal Registration <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">No details available.</div>
        )}

      </div>
    </div>
  );
}
