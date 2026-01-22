import React from "react";
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message = "AI is analyzing your text..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring */}
        <div className="absolute w-16 h-16 bg-blue-100 rounded-full animate-ping opacity-20" />

        {/* Main spinning icon */}
        <Loader2
          className="w-10 h-10 text-blue-600 animate-spin"
          strokeWidth={1.5}
        />
      </div>

      <div className="text-center">
        <p className="text-slate-800 font-bold text-sm tracking-wide">
          {message}
        </p>
        <p className="text-slate-400 text-xs mt-1">
          Processing Khmer linguistic patterns...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
