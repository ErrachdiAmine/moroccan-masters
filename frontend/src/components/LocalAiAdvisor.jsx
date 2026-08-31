import React, { useState } from 'react';
import { Bot, Sparkles, Send, Copy, Check, Calculator, Award, FileText, Cpu, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function LocalAiAdvisor() {
  const [activeSubTab, setActiveSubTab] = useState('evaluator');

  // Evaluator state
  const [gpa, setGpa] = useState(13.5);
  const [mentions, setMentions] = useState(2);
  const [retakes, setRetakes] = useState(0);
  const [targetUniv, setTargetUniv] = useState('FLSH Rabat');
  const [evalResult, setEvalResult] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);

  // SOP State
  const [studentName, setStudentName] = useState('');
  const [targetProgTitle, setTargetProgTitle] = useState('Master in Applied Linguistics & ELT');
  const [researchInterest, setResearchInterest] = useState('Linguistics, Discourse Analysis & TEFL Methodology');
  const [generatedSop, setGeneratedSop] = useState('');
  const [sopLoading, setSopLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Local Moroccan Master AI Assistant. Ask me anything about preselection formulas, written exam topics, or dossier requirements!' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Handlers
  const handleEvaluate = async (e) => {
    e.preventDefault();
    setEvalLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/ai/evaluate_eligibility/', {
        gpa, mentions, retakes, program_title: targetProgTitle, university: targetUniv
      });
      setEvalResult(res.data);
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setEvalLoading(false);
    }
  };

  const handleGenerateSop = async (e) => {
    e.preventDefault();
    setSopLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/ai/generate_sop/', {
        candidate_name: studentName,
        program_title: targetProgTitle,
        university: targetUniv,
        research_interest: researchInterest
      });
      setGeneratedSop(res.data.sop_text);
    } catch (err) {
      console.error("SOP error:", err);
    } finally {
      setSopLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/ai/chat/', { message: userMsg });
      setMessages(prev => [...prev, { sender: 'ai', text: res.data.response }]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopySop = () => {
    navigator.clipboard.writeText(generatedSop);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              Local Academic AI Workbench
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold border border-emerald-500/30">
                100% Offline / Local
              </span>
            </h3>
            <p className="text-xs text-slate-400">Preselection odds calculator, SOP generator & instant AI assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('evaluator')}
          className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
            activeSubTab === 'evaluator' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" /> Score & Odds Calculator
        </button>

        <button
          onClick={() => setActiveSubTab('sop')}
          className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
            activeSubTab === 'sop' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> SOP Writer
        </button>

        <button
          onClick={() => setActiveSubTab('chat')}
          className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
            activeSubTab === 'chat' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" /> AI Assistant Chat
        </button>
      </div>

      {/* Tab 1: Evaluator */}
      {activeSubTab === 'evaluator' && (
        <form onSubmit={handleEvaluate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">S1-S6 Average GPA (/20)</label>
              <input
                type="number"
                step="0.01"
                min="10"
                max="20"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Mentions Count (Assez Bien+)</label>
              <input
                type="number"
                min="0"
                max="6"
                value={mentions}
                onChange={(e) => setMentions(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Retake Years (Pénalité)</label>
              <input
                type="number"
                min="0"
                max="4"
                value={retakes}
                onChange={(e) => setRetakes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={evalLoading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            {evalLoading ? 'Calculating Odds...' : 'Calculate Pre-selection Score & Admission Probability'}
          </button>

          {evalResult && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pre-selection Estimated Score:</span>
                <strong className="text-emerald-400 text-base font-extrabold">{evalResult.calculated_score} / 20</strong>
              </div>

              <div className="flex items-center justify-between border-t border-slate-900 pt-2">
                <span className="text-slate-400">Admission Pre-selection Odds:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  evalResult.badge_color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  evalResult.badge_color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {evalResult.eligibility_status}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px] pt-1">{evalResult.summary}</p>
            </div>
          )}
        </form>
      )}

      {/* Tab 2: SOP Generator */}
      {activeSubTab === 'sop' && (
        <form onSubmit={handleGenerateSop} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Reda Alami"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Target University / Faculty</label>
              <input
                type="text"
                value={targetUniv}
                onChange={(e) => setTargetUniv(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Research Interest / Focus Area</label>
            <input
              type="text"
              value={researchInterest}
              onChange={(e) => setResearchInterest(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={sopLoading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            {sopLoading ? 'Generating SOP...' : 'Generate 4-Paragraph Statement of Purpose'}
          </button>

          {generatedSop && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold text-[11px]">Generated Statement of Purpose:</span>
                <button
                  type="button"
                  onClick={handleCopySop}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold text-[11px] cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy SOP'}
                </button>
              </div>

              <textarea
                readOnly
                rows={9}
                value={generatedSop}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none"
              />
            </div>
          )}
        </form>
      )}

      {/* Tab 3: AI Assistant Chat */}
      {activeSubTab === 'chat' && (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-64 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl max-w-lg leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about preselection notes, written exams, SOP writing..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
