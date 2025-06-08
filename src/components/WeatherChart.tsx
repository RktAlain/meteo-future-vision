
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { WeatherData } from '@/types/weather';

interface WeatherChartProps {
  historicalData: WeatherData[];
  predictions: WeatherData[];
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ historicalData, predictions }) => {
  const combinedData = [
    ...historicalData.map((data, index) => ({
      day: `J-${historicalData.length - index}`,
      temperature: Math.round(data.temperature),
      precipitation: data.precipitation,
      type: 'historique'
    })),
    ...predictions.map((data, index) => ({
      day: index === 0 ? 'Demain' : `J+${index + 1}`,
      temperature: Math.round(data.temperature),
      precipitation: data.precipitation,
      type: 'prédiction'
    }))
  ];

  const chartConfig = {
    temperature: {
      label: "Température (°C)",
      color: "hsl(var(--primary))",
    },
    precipitation: {
      label: "Précipitations (mm)",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <div className="space-y-6">
      {/* Graphique des températures */}
      <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Évolution des Températures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="var(--color-temperature)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-temperature)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Graphique des précipitations */}
      <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Précipitations Historiques et Prévues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <BarChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="precipitation" 
                fill="var(--color-precipitation)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
