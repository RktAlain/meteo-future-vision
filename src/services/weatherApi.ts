
import { WeatherData } from '@/types/weather';
import { Region } from '@/data/madagascarRegions';

export interface HistoricalWeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
    cloud_cover_mean: number[];
    uv_index_max: number[];
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
  startDate.setFullYear(endDate.getFullYear() - 2); // 2 années de données
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  // Utiliser seulement les paramètres valides pour l'API Archive
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${region.latitude}&longitude=${region.longitude}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant,cloud_cover_mean,uv_index_max&timezone=Africa%2FNairobi`;
  
  console.log(`Récupération de 2 années de données historiques (${formatDate(startDate)} à ${formatDate(endDate)}) pour ${region.name}`);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des données météorologiques historiques: ${response.status}`);
  }
  
  return response.json();
};

export const convertHistoricalToWeatherData = (historicalData: HistoricalWeatherData, region: Region, currentData?: WeatherData): WeatherData[] => {
  const { daily } = historicalData;
  const today = new Date().toISOString().split('T')[0];
  
  return daily.time.map((date, index) => {
    const isToday = date === today;
    
    // Si c'est aujourd'hui et qu'on a des données actuelles, les utiliser
    if (isToday && currentData && (daily.temperature_2m_max[index] === null || daily.temperature_2m_min[index] === null)) {
      return {
        temperature: currentData.temperature,
        humidity: currentData.humidity,
        pressure: currentData.pressure,
        windSpeed: currentData.windSpeed,
        windDirection: currentData.windDirection,
        precipitation: currentData.precipitation,
        cloudCover: currentData.cloudCover,
        uvIndex: currentData.uvIndex,
        dewPoint: currentData.dewPoint,
        date: new Date(date)
      };
    }
    
    // Utiliser les données historiques
    const tempMax = daily.temperature_2m_max[index];
    const tempMin = daily.temperature_2m_min[index];
    const temperature = tempMax && tempMin ? (tempMax + tempMin) / 2 : (currentData?.temperature || 20);
    
    // Calculer l'humidité approximative basée sur la température et les précipitations
    const precipitation = daily.precipitation_sum[index] || 0;
    const estimatedHumidity = precipitation > 0 ? 
      Math.min(95, 60 + precipitation * 2) : 
      Math.max(30, 70 - Math.abs(temperature - 20) * 2);
    
    // Calculer la pression approximative (varies with altitude and season)
    const dayOfYear = getDayOfYear(new Date(date));
    const seasonalPressureVariation = 5 * Math.sin((dayOfYear / 365.25) * 2 * Math.PI);
    const estimatedPressure = 1013 - (region.latitude < -20 ? 10 : 5) + seasonalPressureVariation;
    
    // Calculer le point de rosée approximatif
    const dewPoint = temperature - ((100 - estimatedHumidity) / 5);
    
    return {
      temperature: temperature,
      humidity: estimatedHumidity,
      pressure: estimatedPressure,
      windSpeed: daily.wind_speed_10m_max?.[index] || 10,
      windDirection: daily.wind_direction_10m_dominant?.[index] || 180,
      precipitation: precipitation,
      cloudCover: daily.cloud_cover_mean?.[index] || (precipitation > 0 ? 80 : 30),
      uvIndex: daily.uv_index_max?.[index] || 5,
      dewPoint: dewPoint,
      date: new Date(date)
    };
  }).filter(data => {
    // Filtrer les données invalides
    return data.temperature !== null && data.temperature !== undefined && 
           !isNaN(data.temperature) && data.temperature > -50 && data.temperature < 60;
  });
};

const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
