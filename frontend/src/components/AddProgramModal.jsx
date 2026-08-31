import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';

export default function AddProgramModal({ isOpen, onClose, onAddProgram }) {
  const [univ, setUniv] = useState('');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Rabat');
  const [specialization, setSpecialization] = useState('Applied Linguistics & ELT');
  const [deadline, setDeadline] = useState('2026-09-30');
  const [portalUrl, setPortalUrl] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProgram({
      university: univ,
      title: title,
      city: city,
      specialization: specialization,
      deadline: deadline,
      portal_url: portalUrl,
      source: 'User Custom',
      description: description || 'Custom added Master program.'
    });

    setUniv('');
    setTitle('');
    setPortalUrl('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-emerald-400" /> Add Custom Master Announcement
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">University Name</label>
            <input
              type="text"
              required
              value={univ}
              onChange={(e) => setUniv(e.target.value)}
              placeholder="e.g. Université Mohammed V - FLSH Rabat"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Master Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master in Applied Linguistics & ELT"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Rabat"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Specialization</label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              >
                <option value="Applied Linguistics & ELT">Applied Linguistics & ELT</option>
                <option value="Cultural Studies & Literature">Cultural Studies & Literature</option>
                <option value="Communication & Media">Communication & Media</option>
                <option value="Translation Studies">Translation Studies</option>
                <option value="Interdisciplinary Humanities">Interdisciplinary Humanities</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Application Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Portal URL</label>
              <input
                type="url"
                value={portalUrl}
                onChange={(e) => setPortalUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description / Selection Exam Info</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Written concourse and oral interview details..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
            ></textarea>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold cursor-pointer shadow-md shadow-emerald-600/20"
            >
              Save Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
