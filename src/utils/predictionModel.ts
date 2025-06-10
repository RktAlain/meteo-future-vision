import { WeatherData } from '@/types/weather';

export interface WeatherTrends {
  temperatureTrend: number;
  humidityTrend: number;
  pressureTrend: number;
  windSpeedTrend: number;
  precipitationPattern: number;
  cloudCoverPattern: number;
  uvIndexTrend: number;
  seasonalTemperatureAmplitude: number;
  seasonalPhase: number;
  dailyVariations: {
    tempStdDev: number;
    humidityStdDev: number;
    windStdDev: number;
    precipitationProb: number;
  };
}

export const analyzeTrends = (historicalData: WeatherData[], currentData: WeatherData): WeatherTrends => {
  if (historicalData.length < 30) {
    return {
      temperatureTrend: 0,
      humidityTrend: 0,
      pressureTrend: 0,
      windSpeedTrend: 0,
      precipitationPattern: currentData.precipitation,
      cloudCoverPattern: currentData.cloudCover,
      uvIndexTrend: 0,
      seasonalTemperatureAmplitude: 5,
      seasonalPhase: 0,
      dailyVariations: {
        tempStdDev: 3,
        humidityStdDev: 15,
        windStdDev: 5,
        precipitationProb: 0.3
      }
    };
  }

  console.log(`Analyse des tendances sur ${historicalData.length} jours de données historiques`);

  // Calculer les variations et écarts types
  const temperatures = historicalData.map(d => d.temperature);
  const humidities = historicalData.map(d => d.humidity);
  const windSpeeds = historicalData.map(d => d.windSpeed);
  const precipitations = historicalData.map(d => d.precipitation);

  const calculateStdDev = (values: number[]): number => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  const calculateLinearTrend = (values: number[]): number => {
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  };

  // Analyser les patterns saisonniers
  const analyzeSeasonalPattern = (values: number[], dates: Date[]): { amplitude: number, phase: number } => {
    if (values.length < 365) return { amplitude: 5, phase: 0 };
    
    let sumSin = 0, sumCos = 0, sumSinTemp = 0, sumCosTemp = 0;
    
    for (let i = 0; i < values.length; i++) {
      const dayOfYear = getDayOfYear(dates[i]);
      const angle = (2 * Math.PI * dayOfYear) / 365.25;
      
      sumSin += Math.sin(angle);
      sumCos += Math.cos(angle);
      sumSinTemp += Math.sin(angle) * values[i];
      sumCosTemp += Math.cos(angle) * values[i];
    }
    
    const amplitude = Math.sqrt(
      Math.pow(sumSinTemp / values.length, 2) + 
      Math.pow(sumCosTemp / values.length, 2)
    );
    
    const phase = Math.atan2(sumSinTemp, sumCosTemp);
    
    return { amplitude, phase };
  };

  const dates = historicalData.map(d => d.date || new Date());
  const seasonalTemp = analyzeSeasonalPattern(temperatures, dates);

  // Calculer la probabilité de précipitations
  const daysWithRain = precipitations.filter(p => p > 0).length;
  const precipitationProb = daysWithRain / precipitations.length;

  return {
    temperatureTrend: calculateLinearTrend(temperatures),
    humidityTrend: calculateLinearTrend(humidities),
    pressureTrend: calculateLinearTrend(historicalData.map(d => d.pressure)),
    windSpeedTrend: calculateLinearTrend(windSpeeds),
    precipitationPattern: precipitations.reduce((sum, p) => sum + p, 0) / precipitations.length,
    cloudCoverPattern: historicalData.map(d => d.cloudCover).reduce((sum, c) => sum + c, 0) / historicalData.length,
    uvIndexTrend: calculateLinearTrend(historicalData.map(d => d.uvIndex)),
    seasonalTemperatureAmplitude: seasonalTemp.amplitude,
    seasonalPhase: seasonalTemp.phase,
    dailyVariations: {
      tempStdDev: calculateStdDev(temperatures),
      humidityStdDev: calculateStdDev(humidities),
      windStdDev: calculateStdDev(windSpeeds),
      precipitationProb: precipitationProb
    }
  };
};

export const generatePredictions = (
  currentData: WeatherData, 
  historicalData: WeatherData[], 
  trends: WeatherTrends,
  days: number = 7
): WeatherData[] => {
  const predictions: WeatherData[] = [];
  
  console.log(`Génération de ${days} jours de prédictions avec variations réalistes et min/max`);
  
  const recentData = historicalData.slice(-30);
  
  for (let i = 1; i <= days; i++) {
    const futureDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
    const dayOfYear = getDayOfYear(futureDate);
    
    const trendDamping = Math.exp(-i * 0.05);
    
    const seasonalAngle = (2 * Math.PI * dayOfYear) / 365.25;
    const seasonalVariation = trends.seasonalTemperatureAmplitude * Math.sin(seasonalAngle + trends.seasonalPhase);
    
    const tempVariation = (Math.random() - 0.5) * trends.dailyVariations.tempStdDev * 0.8;
    const humidityVariation = (Math.random() - 0.5) * trends.dailyVariations.humidityStdDev * 0.6;
    const windVariation = (Math.random() - 0.5) * trends.dailyVariations.windStdDev * 0.7;
    
    const recentTempAvg = recentData.length > 0 ? 
      recentData.reduce((sum, d) => sum + d.temperature, 0) / recentData.length : 
      currentData.temperature;
    
    const predictedTemp = recentTempAvg + 
      (trends.temperatureTrend * i * trendDamping) + 
      seasonalVariation * 0.3 +
      tempVariation +
      (Math.sin(i * 0.5) * 2);
    
    // Calculer les températures min/max
    const dailyTempRange = 8 + Math.random() * 6; // Variation journalière de 8-14°C
    const predictedTempMin = predictedTemp - dailyTempRange * 0.4;
    const predictedTempMax = predictedTemp + dailyTempRange * 0.6;
    
    const tempChange = predictedTemp - currentData.temperature;
    const predictedHumidity = Math.max(10, Math.min(95, 
      currentData.humidity - (tempChange * 1.5) + humidityVariation + (trends.humidityTrend * i * trendDamping)
    ));
    
    const pressureVariation = (Math.random() - 0.5) * 8;
    const predictedPressure = currentData.pressure + 
      (trends.pressureTrend * i * trendDamping) + 
      pressureVariation +
      (5 * Math.sin(seasonalAngle));
    
    const predictedWindSpeed = Math.max(0, 
      currentData.windSpeed + (trends.windSpeedTrend * i * trendDamping) + windVariation
    );
    
    const rainProbability = Math.random();
    const humidityFactor = predictedHumidity > 80 ? 3 : predictedHumidity > 60 ? 1.5 : 0.5;
    const predictedPrecipitation = rainProbability < (trends.dailyVariations.precipitationProb * humidityFactor) ? 
      Math.random() * trends.precipitationPattern * 2 : 0;
    
    const precipitationCloudFactor = predictedPrecipitation > 0 ? 40 + Math.random() * 30 : 0;
    const humidityCloudFactor = (predictedHumidity - 50) * 0.6;
    const predictedCloudCover = Math.max(0, Math.min(100, 
      trends.cloudCoverPattern + precipitationCloudFactor + humidityCloudFactor + (Math.random() - 0.5) * 20
    ));
    
    const cloudUVReduction = (predictedCloudCover / 100) * 0.7;
    const seasonalUVFactor = 0.7 + 0.3 * Math.sin(seasonalAngle);
    const predictedUV = Math.max(0, Math.min(12, 
      (8 * seasonalUVFactor * (1 - cloudUVReduction)) + (Math.random() - 0.5) * 2
    ));
    
    const predictedDewPoint = predictedTemp - ((100 - predictedHumidity) / 5);
    
    const windDirectionChange = (Math.random() - 0.5) * 45 * i * 0.3;
    const predictedWindDirection = (currentData.windDirection + windDirectionChange + 360) % 360;
    
    predictions.push({
      temperature: Math.round(predictedTemp * 10) / 10,
      temperatureMin: Math.round(predictedTempMin * 10) / 10,
      temperatureMax: Math.round(predictedTempMax * 10) / 10,
      humidity: Math.round(predictedHumidity),
      pressure: Math.round(predictedPressure * 10) / 10,
      windSpeed: Math.round(predictedWindSpeed * 10) / 10,
      windDirection: Math.round(predictedWindDirection),
      precipitation: Math.round(predictedPrecipitation * 10) / 10,
      cloudCover: Math.round(predictedCloudCover),
      uvIndex: Math.round(predictedUV * 10) / 10,
      dewPoint: Math.round(predictedDewPoint * 10) / 10,
      date: futureDate
    });
  }
  
  return predictions;
};

const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
