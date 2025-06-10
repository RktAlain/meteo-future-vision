
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
      seasonalPhase: 0
    };
  }

  console.log(`Analyse des tendances sur ${historicalData.length} jours de données historiques`);

  // Calculer les tendances à long terme (régression linéaire)
  const calculateLinearTrend = (values: number[]): number => {
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  };

  // Analyser les variations saisonnières
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

  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // Extraire les données pour l'analyse
  const temperatures = historicalData.map(d => d.temperature);
  const humidities = historicalData.map(d => d.humidity);
  const pressures = historicalData.map(d => d.pressure);
  const windSpeeds = historicalData.map(d => d.windSpeed);
  const precipitations = historicalData.map(d => d.precipitation);
  const cloudCovers = historicalData.map(d => d.cloudCover);
  const uvIndices = historicalData.map(d => d.uvIndex);
  const dates = historicalData.map(d => d.date || new Date());

  // Analyser les patterns saisonniers
  const seasonalTemp = analyzeSeasonalPattern(temperatures, dates);

  // Calculer les moyennes par mois pour les précipitations et nébulosité
  const monthlyPrecip = Array(12).fill(0);
  const monthlyCloud = Array(12).fill(0);
  const monthlyCounts = Array(12).fill(0);

  historicalData.forEach(d => {
    const month = (d.date || new Date()).getMonth();
    monthlyPrecip[month] += d.precipitation;
    monthlyCloud[month] += d.cloudCover;
    monthlyCounts[month]++;
  });

  const avgMonthlyPrecip = monthlyPrecip.map((sum, i) => 
    monthlyCounts[i] > 0 ? sum / monthlyCounts[i] : 0
  );
  const avgMonthlyCloud = monthlyCloud.map((sum, i) => 
    monthlyCounts[i] > 0 ? sum / monthlyCounts[i] : 0
  );

  const currentMonth = new Date().getMonth();

  return {
    temperatureTrend: calculateLinearTrend(temperatures),
    humidityTrend: calculateLinearTrend(humidities),
    pressureTrend: calculateLinearTrend(pressures),
    windSpeedTrend: calculateLinearTrend(windSpeeds),
    precipitationPattern: avgMonthlyPrecip[currentMonth],
    cloudCoverPattern: avgMonthlyCloud[currentMonth],
    uvIndexTrend: calculateLinearTrend(uvIndices),
    seasonalTemperatureAmplitude: seasonalTemp.amplitude,
    seasonalPhase: seasonalTemp.phase
  };
};

export const generatePredictions = (
  currentData: WeatherData, 
  historicalData: WeatherData[], 
  trends: WeatherTrends,
  days: number = 5
): WeatherData[] => {
  const predictions: WeatherData[] = [];
  
  console.log(`Génération de ${days} jours de prédictions basées sur ${historicalData.length} jours de données`);
  
  for (let i = 1; i <= days; i++) {
    const futureDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
    const dayOfYear = getDayOfYear(futureDate);
    
    // Facteur d'amortissement pour les tendances à long terme
    const trendDamping = Math.exp(-i * 0.1);
    
    // Variation saisonnière basée sur les données historiques
    const seasonalAngle = (2 * Math.PI * dayOfYear) / 365.25;
    const seasonalVariation = trends.seasonalTemperatureAmplitude * 
      Math.sin(seasonalAngle + trends.seasonalPhase);
    
    // Prédiction de température avec tendance, variation saisonnière et persistance
    const persistenceFactor = Math.exp(-i * 0.3); // La persistance diminue avec le temps
    const predictedTemp = currentData.temperature + 
      (trends.temperatureTrend * i * trendDamping) + 
      seasonalVariation * (1 - persistenceFactor) +
      (currentData.temperature - getHistoricalAverage(historicalData, 'temperature', dayOfYear)) * persistenceFactor;
    
    // Corrélation température-humidité basée sur les données historiques
    const tempChange = predictedTemp - currentData.temperature;
    const humidityChange = -tempChange * 2; // Relation inverse température-humidité
    const predictedHumidity = Math.max(0, Math.min(100, 
      currentData.humidity + (trends.humidityTrend * i * trendDamping) + humidityChange
    ));
    
    // Prédiction de pression (plus stable, influence saisonnière)
    const pressureSeasonalVariation = 5 * Math.sin(seasonalAngle);
    const predictedPressure = currentData.pressure + 
      (trends.pressureTrend * i * trendDamping) + 
      pressureSeasonalVariation;
    
    // Prédiction de vitesse du vent
    const predictedWindSpeed = Math.max(0, 
      currentData.windSpeed + (trends.windSpeedTrend * i * trendDamping)
    );
    
    // Prédiction des précipitations basée sur les patterns saisonniers et l'humidité
    const humidityFactor = predictedHumidity > 80 ? 2 : predictedHumidity < 40 ? 0.2 : 1;
    const seasonalPrecipFactor = getSeasonalFactor(dayOfYear, 'precipitation');
    const predictedPrecipitation = Math.max(0, 
      trends.precipitationPattern * humidityFactor * seasonalPrecipFactor * (0.7 + Math.random() * 0.6)
    );
    
    // Prédiction de la couverture nuageuse
    const precipitationCloudFactor = predictedPrecipitation > 5 ? 30 : predictedPrecipitation > 1 ? 15 : 0;
    const predictedCloudCover = Math.max(0, Math.min(100, 
      trends.cloudCoverPattern + precipitationCloudFactor + (predictedHumidity - 60) * 0.4
    ));
    
    // Prédiction de l'index UV (influence des nuages et saison)
    const cloudUVReduction = predictedCloudCover / 100 * 0.8;
    const seasonalUVFactor = getSeasonalFactor(dayOfYear, 'uv');
    const predictedUV = Math.max(0, Math.min(12, 
      (currentData.uvIndex + (trends.uvIndexTrend * i * trendDamping)) * 
      seasonalUVFactor * (1 - cloudUVReduction)
    ));
    
    // Point de rosée
    const predictedDewPoint = predictedTemp - ((100 - predictedHumidity) / 5);
    
    // Direction du vent avec variation basée sur les patterns historiques
    const windDirectionChange = getWindDirectionChange(historicalData, i);
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
      date: futureDate
    });
  }
  
  return predictions;
};

// Fonctions utilitaires pour les calculs saisonniers
const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const getHistoricalAverage = (historicalData: WeatherData[], field: keyof WeatherData, dayOfYear: number): number => {
  const relevantData = historicalData.filter(d => {
    const dateDayOfYear = getDayOfYear(d.date || new Date());
    return Math.abs(dateDayOfYear - dayOfYear) <= 15; // ±15 jours autour de la date
  });
  
  if (relevantData.length === 0) return 0;
  
  const sum = relevantData.reduce((acc, d) => acc + (d[field] as number), 0);
  return sum / relevantData.length;
};

const getSeasonalFactor = (dayOfYear: number, type: 'precipitation' | 'uv'): number => {
  // Facteurs saisonniers pour Madagascar (hémisphère sud)
  const angle = (2 * Math.PI * dayOfYear) / 365.25;
  
  if (type === 'precipitation') {
    // Saison des pluies de novembre à avril
    return 0.8 + 0.4 * Math.sin(angle - Math.PI/2);
  } else { // UV
    // Maximum en été (décembre-février)
    return 0.7 + 0.3 * Math.sin(angle - Math.PI/2);
  }
};

const getWindDirectionChange = (historicalData: WeatherData[], dayOffset: number): number => {
  if (historicalData.length < 100) return (Math.random() - 0.5) * 20 * dayOffset;
  
  // Analyser les variations typiques de direction du vent
  const recentData = historicalData.slice(-100);
  const windDirections = recentData.map(d => d.windDirection);
  
  // Calculer la variation moyenne
  let totalChange = 0;
  for (let i = 1; i < windDirections.length; i++) {
    let change = windDirections[i] - windDirections[i-1];
    if (change > 180) change -= 360;
    if (change < -180) change += 360;
    totalChange += change;
  }
  
  const avgChange = totalChange / (windDirections.length - 1);
  return avgChange * dayOffset + (Math.random() - 0.5) * 15 * dayOffset;
};
