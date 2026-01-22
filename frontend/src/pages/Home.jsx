import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  ArrowRight,
  Github,
  Cpu,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

// Importing your clean components
import FeatureCard from "../components/FeatureCard";
import TechStep from "../components/TechStep";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="font-khmer selection:bg-blue-100">
      {/* 1. HERO SECTION */}
      {/* Balanced padding to account for the fixed Navbar in App.jsx */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Cpu size={14} /> AI Engine v1.0
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
          Classify Khmer <br />
          <span className="text-blue-600">With Confidence.</span>
        </h1>

        <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto">
          A high-performance machine learning pipeline designed to categorize
          Khmer news and documents into six distinct sectors with high
          precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate("/test")}
            className="group bg-slate-900 hover:bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 shadow-xl shadow-slate-200">
            Start Testing
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold px-6 py-4 transition-colors">
            <Github size={20} />
            View Documentation
          </a>
        </div>
      </section>

      {/* 2. CORE FEATURES SECTION */}
      <section className="py-20 bg-white border-y border-slate-100 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<BarChart3 className="text-blue-600" />}
              title="Multi-Class Analysis"
              desc="Detects Economic, Entertainment, Politic, Life, Sport, and Technology categories instantly."
            />
            <FeatureCard
              icon={<Zap className="text-blue-600" />}
              title="Optimized Pipeline"
              desc="Uses SVD Dimensionality Reduction and Linear SVC for fast, server-side inference."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-blue-600" />}
              title="Automated Logging"
              desc="Every prediction is stored in a PostgreSQL audit trail for quality monitoring and retraining."
            />
          </div>
        </div>
      </section>

      {/* 3. TECHNICAL SPECIFICATIONS (The Engineering Process) */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-12 text-center">
            The Engineering Process
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 px-12 bg-white rounded-[40px] border border-slate-100 shadow-sm">
            <TechStep label="TF-IDF" sub="Vectorization" />
            <div className="hidden md:block h-px w-12 bg-slate-100" />

            <TechStep label="Chi-Square" sub="Selection" />
            <div className="hidden md:block h-px w-12 bg-slate-100" />

            <TechStep label="SVD" sub="Reduction" />
            <div className="hidden md:block h-px w-12 bg-slate-100" />

            <TechStep label="Linear SVC" sub="Inference" />
          </div>
        </div>
      </section>

      {/* 4. FOOTER (Explicitly included only here) */}
      <Footer />
    </div>
  );
};

export default Home;
