
import { WeatherData } from '@/types/weather';

export interface WeatherTrends {
  temperatureTrend: number;
  humidityTrend: number;
  pressureTrend: number;
  windSpeedTrend: number;
  precipitationPattern: number;
  cloudCoverPattern: number;
  uvIndexTrend: number;
}

export const analyzeTrends = (historicalData: WeatherData[], currentData: WeatherData): WeatherTrends => {
  if (historicalData.length < 2) {
    return {
      temperatureTrend: 0,
      humidityTrend: 0,
      pressureTrend: 0,
      windSpeedTrend: 0,
      precipitationPattern: currentData.precipitation,
      cloudCoverPattern: currentData.cloudCover,
      uvIndexTrend: 0
    };
  }

  // Calculer les tendances sur les données historiques
  const calculateLinearTrend = (values: number[]): number => {
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  };

  const temperatures = historicalData.map(d => d.temperature);
  const humidities = historicalData.map(d => d.humidity);
  const pressures = historicalData.map(d => d.pressure);
  const windSpeeds = historicalData.map(d => d.windSpeed);
  const precipitations = historicalData.map(d => d.precipitation);
  const cloudCovers = historicalData.map(d => d.cloudCover);
  const uvIndices = historicalData.map(d => d.uvIndex);

  return {
    temperatureTrend: calculateLinearTrend(temperatures),
    humidityTrend: calculateLinearTrend(humidities),
    pressureTrend: calculateLinearTrend(pressures),
    windSpeedTrend: calculateLinearTrend(windSpeeds),
    precipitationPattern: precipitations.reduce((sum, val) => sum + val, 0) / precipitations.length,
    cloudCoverPattern: cloudCovers.reduce((sum, val) => sum + val, 0) / cloudCovers.length,
    uvIndexTrend: calculateLinearTrend(uvIndices)
  };
};

export const generatePredictions = (
  currentData: WeatherData, 
  historicalData: WeatherData[], 
  trends: WeatherTrends,
  days: number = 5
): WeatherData[] => {
  const predictions: WeatherData[] = [];
  
  for (let i = 1; i <= days; i++) {
    // Facteur d'amortissement pour les tendances
    const trendDamping = Math.exp(-i * 0.2);
    
    // Variation saisonnière
    const seasonalVariation = Math.sin((Date.now() + i * 24 * 60 * 60 * 1000) / (365 * 24 * 60 * 60 * 1000) * 2 * Math.PI) * 2;
    
    // Prédiction de température avec tendance et variation saisonnière
    const predictedTemp = currentData.temperature + (trends.temperatureTrend * i * trendDamping) + seasonalVariation;
    
    // Corrélation température-humidité
    const tempHumidityCorrelation = predictedTemp < currentData.temperature ? 5 : -3;
    const predictedHumidity = Math.max(0, Math.min(100, 
      currentData.humidity + (trends.humidityTrend * i * trendDamping) + tempHumidityCorrelation
    ));
    
    // Prédiction de pression (plus stable)
    const predictedPressure = currentData.pressure + (trends.pressureTrend * i * trendDamping * 0.5);
    
    // Prédiction de vitesse du vent
    const predictedWindSpeed = Math.max(0, currentData.windSpeed + (trends.windSpeedTrend * i * trendDamping));
    
    // Prédiction des précipitations basée sur l'humidité
    const humidityFactor = predictedHumidity > 80 ? 1.5 : predictedHumidity < 40 ? 0.3 : 1;
    const predictedPrecipitation = Math.max(0, trends.precipitationPattern * humidityFactor * (0.8 + Math.random() * 0.4));
    
    // Prédiction de la couverture nuageuse
    const precipitationCloudFactor = predictedPrecipitation > 5 ? 20 : predictedPrecipitation > 1 ? 10 : 0;
    const predictedCloudCover = Math.max(0, Math.min(100, 
      trends.cloudCoverPattern + precipitationCloudFactor + (predictedHumidity - 60) * 0.5
    ));
    
    // Prédiction de l'index UV (réduit par les nuages)
    const cloudUVReduction = predictedCloudCover / 100 * 0.7;
    const predictedUV = Math.max(0, Math.min(12, 
      currentData.uvIndex + (trends.uvIndexTrend * i * trendDamping) - (currentData.uvIndex * cloudUVReduction)
    ));
    
    // Point de rosée
    const predictedDewPoint = predictedTemp - ((100 - predictedHumidity) / 5);
    
    // Direction du vent avec variation
    const windDirectionChange = (Math.random() - 0.5) * 30 * i;
    const predictedWindDirection = (currentData.windDirection + windDirectionChange) % 360;
    
    predictions.push({
      temperature: Math.round(predictedTemp * 10) / 10,
      humidity: Math.round(predictedHumidity),
      pressure: Math.round(predictedPressure * 10) / 10,
      windSpeed: Math.round(predictedWindSpeed * 10) / 10,
      windDirection: Math.round(predictedWindDirection),
      precipitation: Math.round(predictedPrecipitation * 10) / 10,
      cloudCover: Math.round(predictedCloudCover),
      uvIndex: Math.round(predictedUV * 10) / 10,
      dewPoint: Math.round(predictedDewPoint * 10) / 10,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
    });
  }
  
  return predictions;
};
