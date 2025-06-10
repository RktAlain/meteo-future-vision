
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WeatherData } from '@/types/weather';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Database } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface HistoricalDataTableProps {
  historicalData: WeatherData[];
  regionName?: string;
}

export const HistoricalDataTable: React.FC<HistoricalDataTableProps> = ({ 
  historicalData, 
  regionName 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const sortedData = [...historicalData].sort((a, b) => 
    new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isExpanded) {
    return (
      <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
        <CardContent className="py-4">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(true)}
            className="w-full flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            <span>Afficher les {historicalData.length} jours de données historiques</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Données Historiques - {regionName} ({historicalData.length} jours)
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Temp (°C)</TableHead>
                <TableHead className="font-semibold">Humidité (%)</TableHead>
                <TableHead className="font-semibold">Pression (hPa)</TableHead>
                <TableHead className="font-semibold">Vent (km/h)</TableHead>
                <TableHead className="font-semibold">Précip (mm)</TableHead>
                <TableHead className="font-semibold">Nuages (%)</TableHead>
                <TableHead className="font-semibold">UV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((data, index) => (
                <TableRow key={index} className="hover:bg-blue-50/50">
                  <TableCell className="font-medium">
                    {data.date ? format(data.date, 'dd MMM yyyy', { locale: fr }) : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${
                      data.temperature > 25 ? 'text-red-600' : 
                      data.temperature < 15 ? 'text-blue-600' : 
                      'text-green-600'
                    }`}>
                      {data.temperature.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>{data.humidity}%</TableCell>
                  <TableCell>{data.pressure.toFixed(1)}</TableCell>
                  <TableCell>{data.windSpeed.toFixed(1)}</TableCell>
                  <TableCell>
                    <span className={`${data.precipitation > 5 ? 'text-blue-600 font-medium' : ''}`}>
                      {data.precipitation.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>{data.cloudCover}%</TableCell>
                  <TableCell>
                    <span className={`${data.uvIndex > 8 ? 'text-orange-600 font-medium' : ''}`}>
                      {data.uvIndex.toFixed(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
