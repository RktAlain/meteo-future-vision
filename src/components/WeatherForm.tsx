import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WeatherData } from '@/types/weather';
import { CloudRain, Thermometer, Wind, CloudDrizzle, RefreshCw } from 'lucide-react';

const weatherSchema = z.object({
  temperature: z.number().min(-50).max(60),
  humidity: z.number().min(0).max(100),
  pressure: z.number().min(950).max(1050),
  windSpeed: z.number().min(0).max(200),
  windDirection: z.number().min(0).max(360),
  precipitation: z.number().min(0).max(100),
  cloudCover: z.number().min(0).max(100),
  uvIndex: z.number().min(0).max(12),
  dewPoint: z.number().min(-50).max(40),
});

interface WeatherFormProps {
  onSubmit: (data: WeatherData) => void;
  currentWeatherData?: WeatherData | null;
  isLoadingCurrent?: boolean;
}

export const WeatherForm: React.FC<WeatherFormProps> = ({ onSubmit, currentWeatherData, isLoadingCurrent }) => {
  const form = useForm<WeatherData>({
    resolver: zodResolver(weatherSchema),
    defaultValues: {
      temperature: 20,
      humidity: 60,
      pressure: 1013,
      windSpeed: 10,
      windDirection: 180,
      precipitation: 0,
      cloudCover: 30,
      uvIndex: 5,
      dewPoint: 12,
    },
  });

  // Mettre à jour le formulaire avec les données actuelles
  useEffect(() => {
    if (currentWeatherData) {
      form.reset({
        temperature: Math.round(currentWeatherData.temperature * 10) / 10,
        humidity: Math.round(currentWeatherData.humidity),
        pressure: Math.round(currentWeatherData.pressure),
        windSpeed: Math.round(currentWeatherData.windSpeed * 10) / 10,
        windDirection: Math.round(currentWeatherData.windDirection),
        precipitation: Math.round(currentWeatherData.precipitation * 10) / 10,
        cloudCover: Math.round(currentWeatherData.cloudCover),
        uvIndex: Math.round(currentWeatherData.uvIndex * 10) / 10,
        dewPoint: Math.round(currentWeatherData.dewPoint * 10) / 10,
      });
    }
  }, [currentWeatherData, form]);

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center justify-between text-xl font-semibold">
          <div className="flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-blue-500" />
            Paramètres Météorologiques
          </div>
          {isLoadingCurrent && (
            <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
          )}
        </CardTitle>
        {currentWeatherData && (
          <p className="text-sm text-green-600 font-medium">
            ✓ Données actuelles chargées automatiquement
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Thermometer className="h-4 w-4 mr-1 text-red-500" />
                      Température (°C)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-white/50 border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="humidity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <CloudDrizzle className="h-4 w-4 mr-1 text-blue-500" />
                      Humidité (%)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-white/50 border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pression atmosphérique (hPa)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-white/50 border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="windSpeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Wind className="h-4 w-4 mr-1 text-gray-500" />
                      Vitesse du vent (km/h)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-white/50 border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="windDirection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Direction du vent (°)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-white/50 border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precipitation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <CloudRain className="h-4 w-4 mr-1 text-blue-600" />
                      Précipitations (mm)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-white/50 border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cloudCover"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nébulosité (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-white/50 border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uvIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indice UV</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-white/50 border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dewPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Point de rosée (°C)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-white/50 border-gray-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 transition-all duration-200"
            >
              Générer les Prédictions
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
