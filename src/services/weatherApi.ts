
import { WeatherData } from '@/types/weather';
import { Region } from '@/data/madagascarRegions';

export interface HistoricalWeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
  };
}

export const fetchHistoricalWeather = async (region: Region): Promise<HistoricalWeatherData> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${region.latitude}&longitude=${region.longitude}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Africa%2FNairobi`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données météorologiques');
  }
  
  return response.json();
};

export const convertHistoricalToWeatherData = (historicalData: HistoricalWeatherData): WeatherData[] => {
  const { daily } = historicalData;
  
  return daily.time.map((date, index) => ({
    temperature: (daily.temperature_2m_max[index] + daily.temperature_2m_min[index]) / 2,
    humidity: 60, // Valeur par défaut
    pressure: 1013, // Valeur par défaut
    windSpeed: 10, // Valeur par défaut
    windDirection: 180, // Valeur par défaut
    precipitation: daily.precipitation_sum[index] || 0,
    cloudCover: daily.precipitation_sum[index] > 0 ? 80 : 30,
    uvIndex: 5, // Valeur par défaut
    dewPoint: daily.temperature_2m_min[index] - 2,
    date: new Date(date)
  }));
};
