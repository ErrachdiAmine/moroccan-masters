import React from 'react';
import { X, CheckCircle2, Circle, FileText, Printer, Sparkles, ShieldCheck } from 'lucide-react';

const DOSSIER_ITEMS = [
  { id: 'cnie', label: "Photocopie légalisée de la CNIE (Carte d'Identité)", tag: 'Obligatoire' },
  { id: 'bac', label: 'Photocopie légalisée du Baccalauréat', tag: 'Obligatoire' },
  { id: 'licence', label: 'Diplôme de Licence ou Attestation de Réussite légalisée', tag: 'Obligatoire' },
  { id: 'releves', label: 'Relevés de notes originaux ou légalisés de S1 à S6', tag: 'Critique' },
  { id: 'cv', label: 'Curriculum Vitae académique détaillé', tag: 'Recommandé' },
  { id: 'lettre', label: 'Lettre de motivation argumentée et signée', tag: 'Recommandé' },
  { id: 'non_travail', label: 'Attestation de non-emploi ou autorisation de poursuivre les études', tag: 'Selon Faculté' },
  { id: 'photos', label: "4 Photos d'identité récentes", tag: 'Standard' },
  { id: 'recu', label: 'Fiche / Récépissé de préinscription imprimé avec code QR', tag: 'Obligatoire' },
];

export default function ChecklistModal({ isOpen, onClose, checkedItems, onToggleItem }) {
  if (!isOpen) return null;

  const total = DOSSIER_ITEMS.length;
  const completed = DOSSIER_ITEMS.filter((item) => checkedItems[item.id]).length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Dossier de Candidature Master</h2>
              <p className="text-xs text-slate-400">Checklist des pièces requises pour les facultés marocaines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Gauge */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">État de Préparation :</span>
            <span className={percent === 100 ? 'text-emerald-400 font-black' : 'text-amber-400 font-bold'}>
              {completed} / {total} Pièces ({percent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                percent === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Checklist List */}
        <div className="space-y-2.5">
          {DOSSIER_ITEMS.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isChecked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-emerald-400">
                    {isChecked ? <CheckCircle2 size={18} /> : <Circle size={18} className="text-slate-600" />}
                  </div>
                  <div>
                    <div className={`text-xs font-semibold ${isChecked ? 'line-through opacity-70' : ''}`}>
                      {item.label}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-400 shrink-0">
                  {item.tag}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Printer size={14} />
            <span>Imprimer la Fiche</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
