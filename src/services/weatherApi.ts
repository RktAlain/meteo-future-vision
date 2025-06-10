
import { WeatherData } from '@/types/weather';
import { Region } from '@/data/madagascarRegions';

export interface HistoricalWeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    relative_humidity_2m: number[];
    surface_pressure: number[];
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
  startDate.setFullYear(endDate.getFullYear() - 3); // 3 années de données
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  // Récupérer plus de paramètres météorologiques pour une meilleure prédiction
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${region.latitude}&longitude=${region.longitude}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m,surface_pressure,wind_speed_10m_max,wind_direction_10m_dominant,cloud_cover_mean,uv_index_max&timezone=Africa%2FNairobi`;
  
  console.log(`Récupération de 3 années de données historiques (${formatDate(startDate)} à ${formatDate(endDate)})`);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des données météorologiques historiques');
  }
  
  return response.json();
};

export const convertHistoricalToWeatherData = (historicalData: HistoricalWeatherData, currentData?: WeatherData): WeatherData[] => {
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
    
    // Utiliser les données historiques avec toutes les variables disponibles
    const tempMax = daily.temperature_2m_max[index];
    const tempMin = daily.temperature_2m_min[index];
    const temperature = tempMax && tempMin ? (tempMax + tempMin) / 2 : (currentData?.temperature || 20);
    
    // Calculer le point de rosée approximatif
    const humidity = daily.relative_humidity_2m?.[index] || 60;
    const dewPoint = temperature - ((100 - humidity) / 5);
    
    return {
      temperature: temperature,
      humidity: humidity,
      pressure: daily.surface_pressure?.[index] || 1013,
      windSpeed: daily.wind_speed_10m_max?.[index] || 10,
      windDirection: daily.wind_direction_10m_dominant?.[index] || 180,
      precipitation: daily.precipitation_sum[index] || 0,
      cloudCover: daily.cloud_cover_mean?.[index] || (daily.precipitation_sum[index] > 0 ? 80 : 30),
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
