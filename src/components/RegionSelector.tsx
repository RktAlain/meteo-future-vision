
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { madagascarRegions, Region } from '@/data/madagascarRegions';

interface RegionSelectorProps {
  selectedRegion: Region | null;
  onRegionChange: (region: Region) => void;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({ selectedRegion, onRegionChange }) => {
  return (
    <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold">
          <MapPin className="h-5 w-5 mr-2 text-green-600" />
          Sélection de la Région
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedRegion?.code || ""} 
          onValueChange={(value) => {
            const region = madagascarRegions.find(r => r.code === value);
            if (region) onRegionChange(region);
          }}
        >
          <SelectTrigger className="w-full bg-white/50 border-gray-200">
            <SelectValue placeholder="Choisissez une région de Madagascar" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-lg">
            {madagascarRegions.map((region) => (
              <SelectItem key={region.code} value={region.code}>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span>{region.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedRegion && (
          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200/50">
            <div className="text-sm space-y-1">
              <p className="font-medium text-green-800">{selectedRegion.name}</p>
              <p className="text-gray-600">
                Latitude: {selectedRegion.latitude}° | Longitude: {selectedRegion.longitude}°
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
