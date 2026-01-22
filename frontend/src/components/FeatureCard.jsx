import React from "react";

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group">
    <div className="mb-6 p-4 bg-slate-50 w-fit rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default FeatureCard;
