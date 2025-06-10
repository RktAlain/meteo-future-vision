
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
      return <CloudSun className="h-8 w-8 text-yellow-500" />;
    case 'rainy':
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    case 'cloudy':
      return <Cloud className="h-8 w-8 text-gray-500" />;
    case 'snowy':
      return <CloudSnow className="h-8 w-8 text-blue-200" />;
    case 'stormy':
      return <CloudLightning className="h-8 w-8 text-purple-500" />;
    default:
      return <CloudSun className="h-8 w-8 text-yellow-500" />;
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
    <div className="space-y-6">
      {/* Conditions actuelles */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Conditions Actuelles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            {getWeatherIcon(getWeatherCondition(currentData).type)}
            <p className="text-2xl font-bold mt-2">{Math.round(currentData.temperature)}°C</p>
            {(currentData.temperatureMin !== undefined && currentData.temperatureMax !== undefined) && (
              <p className="text-sm text-muted-foreground">
                Min: {Math.round(currentData.temperatureMin)}°C | Max: {Math.round(currentData.temperatureMax)}°C
              </p>
            )}
            <p className="text-muted-foreground">{getWeatherCondition(currentData).description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <CloudDrizzle className="h-4 w-4 mr-2 text-blue-500" />
              <span>Humidité: {currentData.humidity}%</span>
            </div>
            <div className="flex items-center">
              <Wind className="h-4 w-4 mr-2 text-gray-500" />
              <span>Vent: {currentData.windSpeed} km/h</span>
            </div>
            <div>Pression: {currentData.pressure} hPa</div>
            <div>UV: {currentData.uvIndex}</div>
          </div>
        </CardContent>
      </Card>

      {/* Prédictions */}
      <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
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
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-white/50 to-gray-50/50 border border-gray-200/50">
                  <div className="flex items-center space-x-3">
                    {getWeatherIcon(condition.type)}
                    <div>
                      <p className="font-medium">{dayLabel}</p>
                      <p className="text-sm text-muted-foreground">{condition.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold">{Math.round(prediction.temperature)}°C</p>
                    {(prediction.temperatureMin !== undefined && prediction.temperatureMax !== undefined) && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {Math.round(prediction.temperatureMin)}°C - {Math.round(prediction.temperatureMax)}°C
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center">
                        <CloudRain className="h-3 w-3 mr-1" />
                        {Math.round(prediction.precipitation)}mm
                      </div>
                      <div className="flex items-center">
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
