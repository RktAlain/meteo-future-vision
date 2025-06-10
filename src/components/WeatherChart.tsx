
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { WeatherData } from '@/types/weather';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WeatherChartProps {
  historicalData: WeatherData[];
  predictions: WeatherData[];
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ historicalData, predictions }) => {
  // Prendre seulement les 7 derniers jours historiques
  const recentHistorical = historicalData.slice(-7);
  
  // Combiner les données récentes avec les prédictions
  const combinedData = [
    ...recentHistorical.map((data, index) => ({
      day: format(data.date || new Date(), 'dd/MM', { locale: fr }),
      fullDate: format(data.date || new Date(), 'dd MMM yyyy', { locale: fr }),
      temperature: Math.round(data.temperature * 10) / 10,
      humidity: data.humidity,
      precipitation: data.precipitation,
      windSpeed: data.windSpeed,
      pressure: data.pressure,
      uvIndex: data.uvIndex,
      type: 'historique'
    })),
    ...predictions.slice(0, 7).map((data, index) => ({
      day: format(data.date || new Date(), 'dd/MM', { locale: fr }),
      fullDate: format(data.date || new Date(), 'dd MMM yyyy', { locale: fr }),
      temperature: Math.round(data.temperature * 10) / 10,
      humidity: data.humidity,
      precipitation: data.precipitation,
      windSpeed: data.windSpeed,
      pressure: data.pressure,
      uvIndex: data.uvIndex,
      type: 'prédiction'
    }))
  ];

  const chartConfig = {
    temperature: {
      label: "Température (°C)",
      color: "#dc2626", // Rouge vif
    },
    humidity: {
      label: "Humidité (%)",
      color: "#2563eb", // Bleu
    },
    precipitation: {
      label: "Précipitations (mm)",
      color: "#0891b2", // Cyan
    },
    windSpeed: {
      label: "Vent (km/h)",
      color: "#16a34a", // Vert
    },
    pressure: {
      label: "Pression (hPa)",
      color: "#7c3aed", // Violet
    },
    uvIndex: {
      label: "Index UV",
      color: "#ea580c", // Orange
    },
  };

  return (
    <div className="space-y-6">
      {/* Graphique principal - Température et Humidité */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">
            Température et Humidité - 2 Semaines (7j passés + 7j prévus)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px]">
            <ComposedChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#64748b' }}
              />
              <YAxis 
                yAxisId="temp"
                orientation="left"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#64748b' }}
                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="humidity"
                orientation="right"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#64748b' }}
                label={{ value: '%', angle: 90, position: 'insideRight' }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                labelFormatter={(value, payload) => {
                  const data = payload?.[0]?.payload;
                  return data ? `${data.fullDate} (${data.type})` : value;
                }}
              />
              <Line 
                yAxisId="temp"
                type="monotone" 
                dataKey="temperature" 
                stroke="#dc2626"
                strokeWidth={3}
                dot={{ fill: '#dc2626', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#dc2626' }}
                name="Température"
              />
              <Line 
                yAxisId="humidity"
                type="monotone" 
                dataKey="humidity" 
                stroke="#2563eb"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#2563eb' }}
                name="Humidité"
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Graphique des précipitations et vent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-cyan-50/80 to-blue-50/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Précipitations (mm)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value, payload) => {
                    const data = payload?.[0]?.payload;
                    return data ? `${data.fullDate}` : value;
                  }}
                />
                <Bar 
                  dataKey="precipitation" 
                  fill="#0891b2"
                  radius={[4, 4, 0, 0]}
                  name="Précipitations"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-green-50/80 to-emerald-50/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Vitesse du Vent (km/h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value, payload) => {
                    const data = payload?.[0]?.payload;
                    return data ? `${data.fullDate}` : value;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="windSpeed" 
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#16a34a' }}
                  name="Vent"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Graphique pression et UV */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50/80 to-violet-50/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Pression Atmosphérique (hPa)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value, payload) => {
                    const data = payload?.[0]?.payload;
                    return data ? `${data.fullDate}` : value;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pressure" 
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#7c3aed' }}
                  name="Pression"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-gradient-to-br from-orange-50/80 to-amber-50/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Index UV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value, payload) => {
                    const data = payload?.[0]?.payload;
                    return data ? `${data.fullDate}` : value;
                  }}
                />
                <Bar 
                  dataKey="uvIndex" 
                  fill="#ea580c"
                  radius={[4, 4, 0, 0]}
                  name="UV Index"
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
