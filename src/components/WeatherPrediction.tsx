
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherData } from '@/types/weather';
import { getWeatherCondition } from '@/utils/weatherUtils';
import { CloudSun, CloudRain, Cloud, CloudSnow, CloudLightning, Thermometer, Wind, CloudDrizzle } from 'lucide-react';

interface WeatherPredictionProps {
  currentData: WeatherData;
  predictions: WeatherData[];
}

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny':
      return <CloudSun className="h-8 w-8 text-yellow-500 animate-pulse" />;
    case 'rainy':
      return <CloudRain className="h-8 w-8 text-blue-500 animate-bounce" />;
    case 'cloudy':
      return <Cloud className="h-8 w-8 text-gray-500 animate-pulse" />;
    case 'snowy':
      return <CloudSnow className="h-8 w-8 text-blue-200 animate-bounce" />;
    case 'stormy':
      return <CloudLightning className="h-8 w-8 text-purple-500 animate-pulse" />;
    default:
      return <CloudSun className="h-8 w-8 text-yellow-500 animate-pulse" />;
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const WeatherPrediction: React.FC<WeatherPredictionProps> = ({ currentData, predictions }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Conditions actuelles */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1">
        <CardHeader className="text-center animate-fade-in">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-scale-in">
            Conditions Actuelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4 animate-scale-in">
            <div className="transform transition-transform duration-300 hover:scale-110">
              {getWeatherIcon(getWeatherCondition(currentData).type)}
            </div>
            <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {Math.round(currentData.temperature)}°C
            </p>
            {(currentData.temperatureMin !== undefined && currentData.temperatureMax !== undefined) && (
              <p className="text-sm text-muted-foreground animate-fade-in delay-300">
                Min: {Math.round(currentData.temperatureMin)}°C | Max: {Math.round(currentData.temperatureMax)}°C
              </p>
            )}
            <p className="text-muted-foreground animate-fade-in delay-500">{getWeatherCondition(currentData).description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center transform transition-transform duration-200 hover:scale-105 animate-fade-in delay-700">
              <CloudDrizzle className="h-4 w-4 mr-2 text-blue-500 animate-pulse" />
              <span>Humidité: {currentData.humidity}%</span>
            </div>
            <div className="flex items-center transform transition-transform duration-200 hover:scale-105 animate-fade-in delay-[800ms]">
              <Wind className="h-4 w-4 mr-2 text-gray-500 animate-pulse" />
              <span>Vent: {currentData.windSpeed} km/h</span>
            </div>
            <div className="transform transition-transform duration-200 hover:scale-105 animate-fade-in delay-[900ms]">
              Pression: {currentData.pressure} hPa
            </div>
            <div className="transform transition-transform duration-200 hover:scale-105 animate-fade-in delay-[1000ms]">
              UV: {currentData.uvIndex}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prédictions */}
      <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in delay-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Prédictions sur 5 jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction, index) => {
              const condition = getWeatherCondition(prediction);
              const dayLabel = index === 0 ? 'Demain' : 
                             index === 1 ? 'Après-demain' : 
                             formatDate(prediction.date!);
              
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white/50 to-gray-50/50 border border-gray-200/50 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-indigo-50/70 animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="transform transition-transform duration-300 hover:scale-110">
                      {getWeatherIcon(condition.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{dayLabel}</p>
                      <p className="text-sm text-muted-foreground">{condition.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {Math.round(prediction.temperature)}°C
                    </p>
                    {(prediction.temperatureMin !== undefined && prediction.temperatureMax !== undefined) && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {Math.round(prediction.temperatureMin)}°C - {Math.round(prediction.temperatureMax)}°C
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center transform transition-transform duration-200 hover:scale-105">
                        <CloudRain className="h-3 w-3 mr-1" />
                        {Math.round(prediction.precipitation)}mm
                      </div>
                      <div className="flex items-center transform transition-transform duration-200 hover:scale-105">
                        <Wind className="h-3 w-3 mr-1" />
                        {Math.round(prediction.windSpeed)}km/h
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
