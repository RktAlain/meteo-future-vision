
import { WeatherData, WeatherCondition } from '@/types/weather';

export const getWeatherCondition = (data: WeatherData): WeatherCondition => {
  // Conditions extrêmes en priorité
  if (data.windSpeed > 118) { // Ouragan
    return {
      type: 'stormy',
      description: 'Ouragan',
      icon: 'cloud-lightning'
    };
  }
  
  if (data.windSpeed > 88) { // Vents cycloniques
    return {
      type: 'stormy',
      description: 'Cyclone',
      icon: 'cloud-lightning'
    };
  }

  if (data.precipitation > 50) { // Pluies torrentielles
    return {
      type: 'stormy',
      description: 'Pluies torrentielles',
      icon: 'cloud-lightning'
    };
  }

  if (data.temperature < 0 && data.precipitation > 5) {
    return {
      type: 'snowy',
      description: 'Neigeux',
      icon: 'cloud-snow'
    };
  }

  if (data.precipitation > 10) {
    if (data.windSpeed > 30 && data.cloudCover > 80) {
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

  if (data.precipitation > 2) {
    return {
      type: 'rainy',
      description: 'Bruine',
      icon: 'cloud-rain'
    };
  }

  // Brouillard
  if (data.humidity > 95 && data.cloudCover > 90 && data.windSpeed < 10) {
    return {
      type: 'cloudy',
      description: 'Brouillard',
      icon: 'cloudy'
    };
  }

  if (data.cloudCover > 80) {
    return {
      type: 'cloudy',
      description: 'Couvert',
      icon: 'cloudy'
    };
  }

  if (data.cloudCover > 50) {
    return {
      type: 'cloudy',
      description: 'Nuageux',
      icon: 'cloudy'
    };
  }

  if (data.cloudCover < 20 && data.uvIndex > 3) {
    if (data.temperature > 30) {
      return {
        type: 'sunny',
        description: 'Ensoleillé et chaud',
        icon: 'cloud-sun'
      };
    }
    return {
      type: 'sunny',
      description: 'Ensoleillé',
      icon: 'cloud-sun'
    };
  }

  if (data.cloudCover < 50) {
    return {
      type: 'sunny',
      description: 'Clair',
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
