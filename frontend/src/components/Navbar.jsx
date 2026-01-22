import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo & Project Name */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white group-hover:bg-slate-900 transition-colors">
            <Activity size={20} />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">
            KhmerClassifier
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/" ?
                "text-blue-600"
              : "text-slate-500 hover:text-slate-900"
            }`}>
            Home
          </Link>

          {/* Action Button: The main entry point to your tool */}
          <Link
            to="/test"
            className="hidden md:block bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
            Launch Predictor
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
