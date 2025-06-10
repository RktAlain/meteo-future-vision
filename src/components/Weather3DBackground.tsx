
import React from 'react';

export const Weather3DBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Nuages flottants */}
      <div className="absolute top-20 left-10 w-16 h-8 bg-white/20 rounded-full animate-float delay-0"></div>
      <div className="absolute top-32 right-20 w-20 h-10 bg-white/15 rounded-full animate-float delay-1000"></div>
      <div className="absolute top-40 left-1/4 w-12 h-6 bg-white/25 rounded-full animate-float delay-2000"></div>
      <div className="absolute top-60 right-1/3 w-18 h-9 bg-white/20 rounded-full animate-float delay-3000"></div>
      
      {/* Particules flottantes */}
      <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-blue-300/30 rounded-full animate-ping delay-500"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-indigo-300/40 rounded-full animate-ping delay-1500"></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-300/20 rounded-full animate-ping delay-2500"></div>
      
      {/* Gradient animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 animate-pulse"></div>
    </div>
  );
};
