
export interface WeatherData {
  temperature: number; // °C
  humidity: number; // %
  pressure: number; // hPa
  windSpeed: number; // km/h
  windDirection: number; // degrés (0-360)
  precipitation: number; // mm
  cloudCover: number; // %
  uvIndex: number; // 0-12
  dewPoint: number; // °C
  date?: Date;
}

export interface WeatherCondition {
  type: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  description: string;
  icon: string;
}
