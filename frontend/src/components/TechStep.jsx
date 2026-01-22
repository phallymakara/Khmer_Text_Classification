import React from "react";

const TechStep = ({ label, sub }) => (
  <div className="text-center">
    <div className="text-lg font-black text-slate-800 tracking-tight">
      {label}
    </div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
      {sub}
    </div>
  </div>
);

export default TechStep;
