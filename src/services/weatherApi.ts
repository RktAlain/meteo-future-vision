
import { Region } from '@/data/madagascarRegions';
import { WeatherData } from '@/types/weather';

interface CurrentWeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    precipitation: string;
    weather_code: string;
    cloud_cover: string;
    pressure_msl: string;
    surface_pressure: string;
    wind_speed_10m: string;
    wind_direction_10m: string;
    wind_gusts_10m: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  daily_units: {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    weather_code: string;
    sunrise: string;
    sunset: string;
    uv_index_max: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

interface HistoricalWeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    weather_code: string;
    wind_speed_10m_max: string;
    wind_direction_10m_dominant: string;
    pressure_msl_mean: string;
    cloud_cover_mean: string;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weather_code: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
    pressure_msl_mean: number[];
    cloud_cover_mean: number[];
  };
}

export const fetchCurrentWeather = async (region: Region) => {
  const params = new URLSearchParams({
    latitude: region.latitude.toString(),
    longitude: region.longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,sunrise,sunset,uv_index_max',
    timezone: 'Africa/Nairobi',
    forecast_days: '1'
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  
  if (!response.ok) {
    throw new Error(`Erreur API Open-Meteo: ${response.status}`);
  }

  return response.json();
};

export const fetchHistoricalWeather = async (region: Region) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 2);

  const params = new URLSearchParams({
    latitude: region.latitude.toString(),
    longitude: region.longitude.toString(),
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max,wind_direction_10m_dominant,pressure_msl_mean,cloud_cover_mean',
    timezone: 'Africa/Nairobi'
  });

  const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?${params}`);
  
  if (!response.ok) {
    throw new Error(`Erreur API Open-Meteo Archive: ${response.status}`);
  }

  return response.json();
};

export const convertCurrentToWeatherData = (apiData: any): WeatherData => {
  const current = apiData.current;
  const daily = apiData.daily;
  
  return {
    temperature: Math.round(current.temperature_2m * 10) / 10,
    temperatureMin: Math.round(daily.temperature_2m_min[0] * 10) / 10,
    temperatureMax: Math.round(daily.temperature_2m_max[0] * 10) / 10,
    humidity: Math.round(current.relative_humidity_2m),
    pressure: Math.round(current.pressure_msl || current.surface_pressure),
    windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
    windDirection: Math.round(current.wind_direction_10m),
    precipitation: Math.round((current.precipitation || 0) * 10) / 10,
    cloudCover: Math.round(current.cloud_cover),
    uvIndex: Math.round((daily.uv_index_max[0] || 5) * 10) / 10,
    dewPoint: Math.round((current.apparent_temperature || current.temperature_2m - 5) * 10) / 10,
    date: new Date()
  };
};

export const convertHistoricalToWeatherData = (
  apiData: any, 
  region: Region, 
  currentData: WeatherData | null = null
): WeatherData[] => {
  if (!apiData?.daily) return [];

  const daily = apiData.daily;
  const dates = daily.time || [];
  
  return dates.map((dateStr: string, index: number) => {
    const avgTemp = (daily.temperature_2m_max[index] + daily.temperature_2m_min[index]) / 2;
    
    return {
      temperature: Math.round(avgTemp * 10) / 10,
      temperatureMin: Math.round(daily.temperature_2m_min[index] * 10) / 10,
      temperatureMax: Math.round(daily.temperature_2m_max[index] * 10) / 10,
      humidity: Math.round(60 + Math.sin(index * 0.1) * 20),
      pressure: Math.round((daily.pressure_msl_mean?.[index] || 1013) * 10) / 10,
      windSpeed: Math.round((daily.wind_speed_10m_max?.[index] || 10) * 10) / 10,
      windDirection: Math.round(daily.wind_direction_10m_dominant?.[index] || 180),
      precipitation: Math.round((daily.precipitation_sum?.[index] || 0) * 10) / 10,
      cloudCover: Math.round(daily.cloud_cover_mean?.[index] || 30),
      uvIndex: Math.round((5 + Math.sin(index * 0.05) * 3) * 10) / 10,
      dewPoint: Math.round((avgTemp - 5) * 10) / 10,
      date: new Date(dateStr)
    };
  });
};
