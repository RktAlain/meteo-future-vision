
import React, { useState } from 'react';
import { WeatherForm } from '@/components/WeatherForm';
import { WeatherPrediction } from '@/components/WeatherPrediction';
import { WeatherHeader } from '@/components/WeatherHeader';
import { WeatherData } from '@/types/weather';

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [predictions, setPredictions] = useState<WeatherData[]>([]);

  const handleWeatherSubmit = (data: WeatherData) => {
    setWeatherData(data);
    // Générer les prédictions pour les 5 prochains jours
    const generatedPredictions = generatePredictions(data);
    setPredictions(generatedPredictions);
  };

  const generatePredictions = (baseData: WeatherData): WeatherData[] => {
    const predictions: WeatherData[] = [];
    
    for (let i = 1; i <= 5; i++) {
      const prediction: WeatherData = {
        temperature: baseData.temperature + (Math.random() - 0.5) * 6, // Variation de ±3°C
        humidity: Math.max(0, Math.min(100, baseData.humidity + (Math.random() - 0.5) * 20)),
        pressure: baseData.pressure + (Math.random() - 0.5) * 20, // Variation de ±10 hPa
        windSpeed: Math.max(0, baseData.windSpeed + (Math.random() - 0.5) * 10),
        windDirection: (baseData.windDirection + (Math.random() - 0.5) * 60) % 360,
        precipitation: Math.max(0, baseData.precipitation + (Math.random() - 0.5) * 5),
        cloudCover: Math.max(0, Math.min(100, baseData.cloudCover + (Math.random() - 0.5) * 30)),
        uvIndex: Math.max(0, Math.min(12, baseData.uvIndex + (Math.random() - 0.5) * 2)),
        dewPoint: baseData.dewPoint + (Math.random() - 0.5) * 4,
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
      };
      predictions.push(prediction);
    }
    
    return predictions;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <WeatherHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="space-y-6">
            <WeatherForm onSubmit={handleWeatherSubmit} />
          </div>
          
          <div className="space-y-6">
            {weatherData && predictions.length > 0 && (
              <WeatherPrediction 
                currentData={weatherData} 
                predictions={predictions} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
