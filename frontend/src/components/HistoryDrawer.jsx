import React from "react";
import { X, Clock, Tag } from "lucide-react";

const HistoryDrawer = ({ isOpen, onClose, history }) => {
  return (
    <>
      {/* Overlay Backdrop - Blurs the background when drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" /> Recent Analysis
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>

          {/* History List */}
          <div className="flex-grow overflow-y-auto space-y-4 pr-2">
            {history && history.length > 0 ?
              history.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.created_at ?
                        new Date(item.created_at).toLocaleTimeString()
                      : "Recent"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed italic">
                    "{item.content}"
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                    <Tag size={12} /> Confidence Score:{" "}
                    {item.score?.toFixed(4) || "N/A"}
                  </div>
                </div>
              ))
            : <div className="text-center py-20 text-slate-300">
                <p>No history records found in database.</p>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoryDrawer;
