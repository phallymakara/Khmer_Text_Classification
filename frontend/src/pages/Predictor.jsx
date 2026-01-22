import React, { useState } from "react";
import { classifyText } from "../services/prediction";
import { fetchHistory } from "../services/history";
import LoadingSpinner from "../components/LoadingSpinner";
import HistoryDrawer from "../components/HistoryDrawer";
import {
  Search,
  Trash2,
  BarChart3,
  Globe,
  AlertCircle,
  History as HistoryIcon,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

const Predictor = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeModel, setActiveModel] = useState("1.0.0");
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const models = [
    { id: "1.0.0", label: "Model v1.0.0", status: "Active" },
    { id: "1.0.1", label: "Model v1.0.1", status: "Soon" },
    { id: "1.0.2", label: "Model v1.0.2", status: "Soon" },
  ];

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await classifyText(text);
      setResult(data);
    } catch (err) {
      setError("AI Engine unreachable. Please verify backend status.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDrawer = async () => {
    if (!isDrawerOpen) {
      try {
        const data = await fetchHistory(10);
        setHistoryData(data);
      } catch (err) {
        console.error(err);
      }
    }
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8FAFC] font-khmer py-8 px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
              Model
            </span>
            <div className="relative">
              <button
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="flex items-center gap-1 group transition-all">
                <h2 className="text-xs font-bold text-slate-400 group-hover:text-blue-500 transition-colors tracking-widest">
                  v{activeModel}
                </h2>
                <ChevronDown
                  size={12}
                  className={`text-slate-300 group-hover:text-blue-500 transition-transform ${showModelMenu ? "rotate-180" : ""}`}
                />
              </button>
              {showModelMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowModelMenu(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                    {models.map((m) => (
                      <button
                        key={m.id}
                        disabled={m.status === "Soon"}
                        onClick={() => {
                          setActiveModel(m.id);
                          setShowModelMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[10px] font-bold transition-all ${activeModel === m.id ? "bg-blue-50 text-blue-600" : "text-slate-500 hover:bg-slate-50"} ${m.status === "Soon" ? "opacity-30 italic" : ""}`}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleToggleDrawer}
            className="flex items-center gap-3 bg-white border-2 border-slate-900 px-8 py-3 rounded-[18px] text-sm font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)] active:scale-95">
            <HistoryIcon size={18} /> VIEW HISTORY
          </button>
        </div>

        {/* COMPACT WORKSPACE AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: INPUT */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[480px] focus-within:border-blue-500/50 transition-all duration-500">
              <textarea
                className="w-full flex-grow p-10 text-lg border-none focus:ring-0 resize-none placeholder:text-slate-200 text-slate-700 leading-relaxed font-light"
                placeholder="Enter Khmer text for analysis..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => setText("")}
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <Trash2 size={22} />
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="bg-slate-900 hover:bg-blue-600 text-white px-10 py-3.5 rounded-[18px] text-base font-black tracking-widest uppercase flex items-center gap-4 shadow-xl shadow-blue-500/10 transition-all disabled:bg-slate-200 active:scale-95">
                  {loading ?
                    <RefreshCw className="animate-spin" size={18} />
                  : <Search size={18} />}{" "}
                  EXECUTE ANALYSIS
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: RESULTS */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/20 h-full min-h-[480px] flex flex-col overflow-hidden relative">
              {loading && (
                <div className="m-auto flex flex-col items-center gap-4 animate-pulse text-blue-500 font-bold text-[10px] tracking-widest uppercase">
                  <LoadingSpinner />
                  Computing...
                </div>
              )}
              {!loading && !result && !error && (
                <div className="m-auto text-center p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-200">
                    <Globe size={32} />
                  </div>
                  <h3 className="text-slate-800 font-bold mb-1 text-base tracking-tight">
                    System Ready
                  </h3>
                  <p className="text-slate-400 text-[10px] max-w-[160px] mx-auto leading-relaxed">
                    Input text to initiate classification.
                  </p>
                </div>
              )}
              {error && (
                <div className="m-auto text-center p-10">
                  <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={32} />
                  </div>
                  <p className="text-slate-600 font-medium text-sm px-6">
                    {error}
                  </p>
                </div>
              )}
              {result && (
                <div className="p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center gap-2 text-blue-600 mb-6 font-bold uppercase tracking-[0.3em] text-[8px]">
                    <BarChart3 size={12} /> Neural Output
                  </div>
                  <div className="mb-8">
                    <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase mb-3 inline-block tracking-widest">
                      Primary Category
                    </span>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                      {result.primary_category}
                    </h2>
                  </div>
                  <div className="space-y-8">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-1">
                      Confidence Matrix
                    </p>
                    {result.top_predictions.map((pred, index) => (
                      <div key={index} className="group">
                        <div className="flex justify-between items-end mb-2">
                          <span
                            className={`font-bold text-sm transition-colors duration-500 ${index === 0 ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}>
                            {pred.category_name}
                          </span>
                          <span className="text-[8px] font-mono text-slate-400">
                            {pred.score.toFixed(4)}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-[1500ms] ease-out ${index === 0 ? "bg-blue-600" : "bg-slate-200 group-hover:bg-slate-300"}`}
                            style={{
                              width: `${Math.min(100, Math.max(8, pred.score * 18))}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <HistoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        history={historyData}
      />
    </div>
  );
};

export default Predictor;
