
import React from 'react';
import { CloudSun, Thermometer } from 'lucide-react';

export const WeatherHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <CloudSun className="h-12 w-12 text-blue-500 mr-3" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Prédicteur Météo AI
        </h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Entrez les paramètres météorologiques actuels pour obtenir des prédictions précises 
        pour les prochains jours. Notre algorithme analyse tous les facteurs climatiques.
      </p>
    </div>
  );
};
