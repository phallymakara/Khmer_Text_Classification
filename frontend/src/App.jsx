import React, { useState } from "react";
import { classifyText } from "./services/api";
import { Search, Loader2, BarChart3, Globe } from "lucide-react";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const data = await classifyText(text);
      setResult(data);
    } catch (error) {
      console.error("Inference Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-khmer text-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Khmer Intelligence
          </h1>
          <p className="text-slate-500">
            Advanced Text Classification & Analysis
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
              <textarea
                className="w-full h-64 p-4 text-lg border-none focus:ring-0 resize-none placeholder:text-slate-300"
                placeholder="Paste Khmer news or text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex justify-end pt-4 border-t border-slate-50">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50">
                  {loading ?
                    <Loader2 className="animate-spin" />
                  : <Search size={18} />}
                  Analyze Content
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ?
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                  <BarChart3 size={20} />
                  <span className="font-semibold uppercase tracking-wider text-sm">
                    Classification
                  </span>
                </div>

                <h2 className="text-4xl font-bold text-slate-800 mb-1">
                  {result.primary_category}
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  Primary Category Identified
                </p>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Top 3 Predictions
                  </p>
                  {result.top_predictions.map((pred, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">
                          {pred.category_name}
                        </span>
                        <span className="text-slate-400">
                          {Math.max(0, (pred.score * 10).toFixed(1))}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(100, Math.max(5, pred.score * 10))}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            : <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <Globe size={48} className="mb-4 opacity-20" />
                <p>Waiting for analysis...</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
