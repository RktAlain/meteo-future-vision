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

export interface CurrentWeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    precipitation: number;
    cloud_cover: number;
    uv_index: number;
    dew_point_2m: number;
  };
}

export const fetchCurrentWeather = async (region: Region): Promise<CurrentWeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${region.latitude}&longitude=${region.longitude}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,precipitation,cloud_cover,uv_index,dew_point_2m&timezone=Africa%2FNairobi`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données météorologiques actuelles');
  }
  
  return response.json();
};

export const convertCurrentToWeatherData = (currentData: CurrentWeatherData): WeatherData => {
  const { current } = currentData;
  
  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    pressure: current.surface_pressure,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    precipitation: current.precipitation || 0,
    cloudCover: current.cloud_cover,
    uvIndex: current.uv_index || 0,
    dewPoint: current.dew_point_2m,
    date: new Date(current.time)
  };
};

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
