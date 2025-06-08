import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WeatherForm } from '@/components/WeatherForm';
import { WeatherPrediction } from '@/components/WeatherPrediction';
import { WeatherHeader } from '@/components/WeatherHeader';
import { WeatherChart } from '@/components/WeatherChart';
import { RegionSelector } from '@/components/RegionSelector';
import { WeatherData } from '@/types/weather';
import { 
  fetchHistoricalWeather, 
  convertHistoricalToWeatherData,
  fetchCurrentWeather,
  convertCurrentToWeatherData
} from '@/services/weatherApi';
import { madagascarRegions, Region } from '@/data/madagascarRegions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Database, AlertCircle, CloudSun } from 'lucide-react';

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [predictions, setPredictions] = useState<WeatherData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(madagascarRegions[1]); // Fianarantsoa par défaut

  // Récupérer les données historiques
  const { data: historicalWeatherData, isLoading: isLoadingHistorical, error: historicalError } = useQuery({
    queryKey: ['historicalWeather', selectedRegion?.code],
    queryFn: () => selectedRegion ? fetchHistoricalWeather(selectedRegion) : Promise.resolve(null),
    enabled: !!selectedRegion,
  });

  // Récupérer les données actuelles
  const { data: currentWeatherData, isLoading: isLoadingCurrent, error: currentError } = useQuery({
    queryKey: ['currentWeather', selectedRegion?.code],
    queryFn: () => selectedRegion ? fetchCurrentWeather(selectedRegion) : Promise.resolve(null),
    enabled: !!selectedRegion,
  });

  const historicalData = historicalWeatherData 
    ? convertHistoricalToWeatherData(historicalWeatherData)
    : [];

  const currentData = currentWeatherData 
    ? convertCurrentToWeatherData(currentWeatherData)
    : null;

  const handleWeatherSubmit = (data: WeatherData) => {
    setWeatherData(data);
    // Améliorer les prédictions avec les données historiques
    const generatedPredictions = generateAdvancedPredictions(data, historicalData);
    setPredictions(generatedPredictions);
  };

  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
    // Réinitialiser les prédictions quand on change de région
    setWeatherData(null);
    setPredictions([]);
  };

  const generateAdvancedPredictions = (baseData: WeatherData, historical: WeatherData[]): WeatherData[] => {
    const predictions: WeatherData[] = [];
    
    // Calculer les tendances basées sur les données historiques
    const tempTrend = historical.length > 1 
      ? (historical[historical.length - 1].temperature - historical[0].temperature) / historical.length
      : 0;
    
    const precipTrend = historical.length > 1
      ? historical.reduce((sum, data) => sum + data.precipitation, 0) / historical.length
      : 0;
    
    for (let i = 1; i <= 5; i++) {
      const prediction: WeatherData = {
        temperature: baseData.temperature + (tempTrend * i) + (Math.random() - 0.5) * 4,
        humidity: Math.max(0, Math.min(100, baseData.humidity + (Math.random() - 0.5) * 15)),
        pressure: baseData.pressure + (Math.random() - 0.5) * 15,
        windSpeed: Math.max(0, baseData.windSpeed + (Math.random() - 0.5) * 8),
        windDirection: (baseData.windDirection + (Math.random() - 0.5) * 45) % 360,
        precipitation: Math.max(0, precipTrend * 0.8 + (Math.random() - 0.5) * 3),
        cloudCover: Math.max(0, Math.min(100, baseData.cloudCover + (Math.random() - 0.5) * 25)),
        uvIndex: Math.max(0, Math.min(12, baseData.uvIndex + (Math.random() - 0.5) * 1.5)),
        dewPoint: baseData.dewPoint + (Math.random() - 0.5) * 3,
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
        
        {/* Indicateur de données */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Données historiques */}
          <Card className="backdrop-blur-sm bg-gradient-to-r from-green-500/10 to-blue-500/10 border-0 shadow-lg">
            <CardContent className="py-4">
              <div className="flex items-center justify-center space-x-4">
                <Database className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">
                  {isLoadingHistorical && "Chargement des données historiques..."}
                  {historicalError && (
                    <span className="flex items-center text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Erreur historique
                    </span>
                  )}
                  {historicalData.length > 0 && selectedRegion && 
                    `${historicalData.length} jours historiques - ${selectedRegion.name}`
                  }
                </span>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Données actuelles */}
          <Card className="backdrop-blur-sm bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-0 shadow-lg">
            <CardContent className="py-4">
              <div className="flex items-center justify-center space-x-4">
                <CloudSun className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">
                  {isLoadingCurrent && "Chargement des données actuelles..."}
                  {currentError && (
                    <span className="flex items-center text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Erreur données actuelles
                    </span>
                  )}
                  {currentData && selectedRegion && 
                    `Données en temps réel - ${selectedRegion.name}`
                  }
                </span>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Sélecteur de région et formulaire */}
          <div className="xl:col-span-1 space-y-6">
            <RegionSelector 
              selectedRegion={selectedRegion}
              onRegionChange={handleRegionChange}
            />
            <WeatherForm 
              onSubmit={handleWeatherSubmit} 
              currentWeatherData={currentData}
              isLoadingCurrent={isLoadingCurrent}
            />
          </div>
          
          {/* Graphiques et prédictions */}
          <div className="xl:col-span-2 space-y-6">
            {historicalData.length > 0 && predictions.length > 0 && (
              <WeatherChart 
                historicalData={historicalData} 
                predictions={predictions} 
              />
            )}
            
            {weatherData && predictions.length > 0 && selectedRegion && (
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
