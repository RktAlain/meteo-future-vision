
import React from 'react';
import { CloudSun } from 'lucide-react';

export const WeatherHeader = () => {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="flex items-center justify-center mb-4">
        <div className="transform transition-all duration-500 hover:scale-110 hover:rotate-12 animate-scale-in">
          <CloudSun className="h-12 w-12 text-blue-500 mr-3 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-scale-in delay-300">
          Prédicteur Météo AI
        </h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in delay-500 transform transition-all duration-300 hover:text-blue-600">
        Entrez les paramètres météorologiques actuels pour obtenir des prédictions précises 
        pour les prochains jours. Notre algorithme analyse tous les facteurs climatiques.
      </p>
    </div>
  );
};
