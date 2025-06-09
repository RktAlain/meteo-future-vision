
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { WeatherForm } from '@/components/WeatherForm';
import { WeatherPrediction } from '@/components/WeatherPrediction';
import { WeatherHeader } from '@/components/WeatherHeader';
import { WeatherChart } from '@/components/WeatherChart';
import { RegionSelector } from '@/components/RegionSelector';
import { WeatherVoiceNotification } from '@/components/WeatherVoiceNotification';
import { WeatherData } from '@/types/weather';
import { 
  fetchHistoricalWeather, 
  convertHistoricalToWeatherData,
  fetchCurrentWeather,
  convertCurrentToWeatherData
} from '@/services/weatherApi';
import { analyzeTrends, generatePredictions } from '@/utils/predictionModel';
import { madagascarRegions, Region } from '@/data/madagascarRegions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Database, AlertCircle, CloudSun, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [predictions, setPredictions] = useState<WeatherData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(madagascarRegions[1]);
  const navigate = useNavigate();

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

  const currentData = currentWeatherData 
    ? convertCurrentToWeatherData(currentWeatherData)
    : null;

  const historicalData = historicalWeatherData 
    ? convertHistoricalToWeatherData(historicalWeatherData, currentData)
    : [];

  const handleWeatherSubmit = (data: WeatherData) => {
    setWeatherData(data);
    
    if (historicalData.length > 0) {
      const trends = analyzeTrends(historicalData, data);
      const generatedPredictions = generatePredictions(data, historicalData, trends);
      setPredictions(generatedPredictions);
      
      console.log('Tendances analysées:', trends);
      console.log('Prédictions générées:', generatedPredictions);
    }
  };

  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
    setWeatherData(null);
    setPredictions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <WeatherHeader />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/model')}
              className="flex items-center gap-2"
            >
              <Brain className="h-4 w-4" />
              Modèle IA
            </Button>
            <WeatherVoiceNotification 
              currentData={currentData}
              predictions={predictions}
              selectedRegion={selectedRegion?.name}
            />
          </div>
        </div>
        
        {/* Indicateurs de données */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
