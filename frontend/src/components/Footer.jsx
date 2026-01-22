import React from "react";
import { Activity, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 px-6 border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Branding Part */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1 rounded text-white">
            <Activity size={16} />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">
            ITC Data Science
          </span>
        </div>

        {/* Middle Text */}
        <div className="text-slate-400 text-sm text-center">
          © 2026 Khmer Text Classifier. Developed for Data Science & Engineering
          Research.
        </div>

        {/* Status/Links Part */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-slate-400 hover:text-slate-900 transition-colors">
            <Github size={20} />
          </a>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              System Live
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
