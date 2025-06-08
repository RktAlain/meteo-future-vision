
import { WeatherData, WeatherCondition } from '@/types/weather';

export const getWeatherCondition = (data: WeatherData): WeatherCondition => {
  // Logique de détermination des conditions météo basée sur les paramètres
  
  if (data.precipitation > 10) {
    if (data.temperature < 0) {
      return {
        type: 'snowy',
        description: 'Neige',
        icon: 'cloud-snow'
      };
    } else if (data.windSpeed > 30 && data.cloudCover > 80) {
      return {
        type: 'stormy',
        description: 'Orageux',
        icon: 'cloud-lightning'
      };
    } else {
      return {
        type: 'rainy',
        description: 'Pluvieux',
        icon: 'cloud-rain'
      };
    }
  }
  
  if (data.cloudCover > 70) {
    return {
      type: 'cloudy',
      description: 'Nuageux',
      icon: 'cloudy'
    };
  }
  
  if (data.cloudCover < 30 && data.uvIndex > 3) {
    return {
      type: 'sunny',
      description: 'Ensoleillé',
      icon: 'cloud-sun'
    };
  }
  
  return {
    type: 'cloudy',
    description: 'Partiellement nuageux',
    icon: 'cloud-sun'
  };
};

export const getWindDirection = (degrees: number): string => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'
  ];
  
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getUVDescription = (uvIndex: number): string => {
  if (uvIndex <= 2) return 'Faible';
  if (uvIndex <= 5) return 'Modéré';
  if (uvIndex <= 7) return 'Élevé';
  if (uvIndex <= 10) return 'Très élevé';
  return 'Extrême';
};
