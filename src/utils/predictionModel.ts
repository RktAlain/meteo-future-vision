import { WeatherData } from '@/types/weather';
import { trainLSTMModel, predictWithLSTM, LSTMPredictionModel } from './lstmModel';

export interface WeatherTrends {
  temperatureTrend: number;
  humidityTrend: number;
  pressureTrend: number;
  windSpeedTrend: number;
  precipitationPattern: number;
  cloudCoverPattern: number;
  uvIndexTrend: number;
}

// Modèle LSTM global
let globalLSTMModel: LSTMPredictionModel | null = null;

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

// Fonction de fallback avec le modèle linéaire original
const generateLinearPredictions = (
  currentData: WeatherData, 
  historicalData: WeatherData[], 
  trends: WeatherTrends,
  days: number = 5
): WeatherData[] => {
  const predictions: WeatherData[] = [];
  
  for (let i = 1; i <= days; i++) {
    // ... keep existing code (implementation of linear prediction model)
    const trendDamping = Math.exp(-i * 0.2);
    const seasonalVariation = Math.sin((Date.now() + i * 24 * 60 * 60 * 1000) / (365 * 24 * 60 * 60 * 1000) * 2 * Math.PI) * 2;
    
    const predictedTemp = currentData.temperature + (trends.temperatureTrend * i * trendDamping) + seasonalVariation;
    const tempHumidityCorrelation = predictedTemp < currentData.temperature ? 5 : -3;
    const predictedHumidity = Math.max(0, Math.min(100, 
      currentData.humidity + (trends.humidityTrend * i * trendDamping) + tempHumidityCorrelation
    ));
    const predictedPressure = currentData.pressure + (trends.pressureTrend * i * trendDamping * 0.5);
    const predictedWindSpeed = Math.max(0, currentData.windSpeed + (trends.windSpeedTrend * i * trendDamping));
    const humidityFactor = predictedHumidity > 80 ? 1.5 : predictedHumidity < 40 ? 0.3 : 1;
    const predictedPrecipitation = Math.max(0, trends.precipitationPattern * humidityFactor * (0.8 + Math.random() * 0.4));
    const precipitationCloudFactor = predictedPrecipitation > 5 ? 20 : predictedPrecipitation > 1 ? 10 : 0;
    const predictedCloudCover = Math.max(0, Math.min(100, 
      trends.cloudCoverPattern + precipitationCloudFactor + (predictedHumidity - 60) * 0.5
    ));
    const cloudUVReduction = predictedCloudCover / 100 * 0.7;
    const predictedUV = Math.max(0, Math.min(12, 
      currentData.uvIndex + (trends.uvIndexTrend * i * trendDamping) - (currentData.uvIndex * cloudUVReduction)
    ));
    const predictedDewPoint = predictedTemp - ((100 - predictedHumidity) / 5);
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

// Entraîner le modèle LSTM si nécessaire
export const trainModelIfNeeded = async (
  historicalData: WeatherData[],
  onProgress?: (epoch: number, loss: number) => void
): Promise<void> => {
  // Ne pas réentraîner si le modèle existe déjà et que les données n'ont pas beaucoup changé
  if (globalLSTMModel?.isReady && historicalData.length < 30) {
    return;
  }

  if (historicalData.length >= 14) {
    try {
      console.log('Entraînement du modèle LSTM en cours...');
      globalLSTMModel = await trainLSTMModel(historicalData, onProgress);
      console.log('Modèle LSTM entraîné avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'entraînement du modèle LSTM:', error);
      globalLSTMModel = null;
    }
  }
};

export const generatePredictions = async (
  currentData: WeatherData, 
  historicalData: WeatherData[], 
  trends: WeatherTrends,
  days: number = 5
): Promise<WeatherData[]> => {
  // Essayer d'utiliser le modèle LSTM si disponible
  if (globalLSTMModel?.isReady && historicalData.length >= 7) {
    try {
      console.log('Utilisation du modèle LSTM pour les prédictions');
      const allData = [...historicalData, currentData];
      return await predictWithLSTM(globalLSTMModel, allData, days);
    } catch (error) {
      console.error('Erreur avec le modèle LSTM, utilisation du modèle linéaire:', error);
    }
  }
  
  // Fallback vers le modèle linéaire
  console.log('Utilisation du modèle linéaire pour les prédictions');
  return generateLinearPredictions(currentData, historicalData, trends, days);
};

// Obtenir le statut du modèle LSTM
export const getLSTMModelStatus = (): { isReady: boolean; isTraining: boolean } => {
  return {
    isReady: globalLSTMModel?.isReady || false,
    isTraining: globalLSTMModel?.isTraining || false
  };
};
