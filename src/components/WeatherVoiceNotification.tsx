
import React, { useEffect, useState } from 'react';
import { WeatherData } from '@/types/weather';
import { getWeatherCondition } from '@/utils/weatherUtils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface WeatherVoiceNotificationProps {
  currentData?: WeatherData | null;
  predictions?: WeatherData[];
  selectedRegion?: string;
}

export const WeatherVoiceNotification: React.FC<WeatherVoiceNotificationProps> = ({ 
  currentData, 
  predictions, 
  selectedRegion 
}) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const { toast } = useToast();

  const getDetailedWeatherDescription = (data: WeatherData): string => {
    const condition = getWeatherCondition(data);
    let description = `Il fait actuellement ${Math.round(data.temperature)} degrés. `;
    
    // Conditions spécifiques
    if (data.temperature > 35) {
      description += "Il fait très chaud. ";
    } else if (data.temperature > 25) {
      description += "Il fait chaud. ";
    } else if (data.temperature < 5) {
      description += "Il fait très froid. ";
    } else if (data.temperature < 15) {
      description += "Il fait froid. ";
    }

    // Conditions de vent
    if (data.windSpeed > 80) {
      description += "Attention, vents d'ouragan! ";
    } else if (data.windSpeed > 60) {
      description += "Vents très forts, cycloniques. ";
    } else if (data.windSpeed > 40) {
      description += "Vents forts. ";
    } else if (data.windSpeed > 20) {
      description += "Vent modéré. ";
    }

    // Humidité
    if (data.humidity > 85) {
      description += "Très humide. ";
    } else if (data.humidity < 30) {
      description += "Air très sec. ";
    } else if (data.humidity < 50) {
      description += "Air sec. ";
    }

    // Précipitations
    if (data.precipitation > 50) {
      description += "Pluies torrentielles. ";
    } else if (data.precipitation > 10) {
      description += "Il pleut beaucoup. ";
    } else if (data.precipitation > 2) {
      description += "Il pleut légèrement. ";
    }

    // Pression
    if (data.pressure < 980) {
      description += "Pression très basse, tempête possible. ";
    } else if (data.pressure > 1030) {
      description += "Haute pression, temps stable. ";
    }

    // Couverture nuageuse
    if (data.cloudCover < 20) {
      description += "Ciel dégagé et ensoleillé. ";
    } else if (data.cloudCover < 50) {
      description += "Partiellement nuageux. ";
    } else if (data.cloudCover < 80) {
      description += "Très nuageux. ";
    } else {
      description += "Ciel couvert. ";
    }

    return description;
  };

  const speakWeatherUpdate = async (message: string) => {
    if ('speechSynthesis' in window && isVoiceEnabled) {
      // Arrêter toute synthèse en cours
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (currentData && isVoiceEnabled) {
      const message = `Météo actuelle pour ${selectedRegion || 'la région sélectionnée'}. ${getDetailedWeatherDescription(currentData)}`;
      speakWeatherUpdate(message);
      
      toast({
        title: "🔊 Annonce météo",
        description: "Conditions actuelles annoncées vocalement",
      });
    }
  }, [currentData, isVoiceEnabled, selectedRegion]);

  useEffect(() => {
    if (predictions && predictions.length > 0 && isVoiceEnabled) {
      const tomorrow = predictions[0];
      const tomorrowCondition = getWeatherCondition(tomorrow);
      
      const message = `Prévisions pour demain: ${Math.round(tomorrow.temperature)} degrés, ${tomorrowCondition.description.toLowerCase()}. ${
        tomorrow.precipitation > 5 ? `Précipitations attendues: ${Math.round(tomorrow.precipitation)} millimètres. ` : ''
      }${
        tomorrow.windSpeed > 30 ? `Vent fort attendu: ${Math.round(tomorrow.windSpeed)} kilomètres par heure. ` : ''
      }`;
      
      setTimeout(() => {
        speakWeatherUpdate(message);
        toast({
          title: "🔊 Prévisions demain",
          description: "Prévisions météorologiques annoncées",
        });
      }, 3000);
    }
  }, [predictions, isVoiceEnabled]);

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    
    if (!isVoiceEnabled) {
      toast({
        title: "🔊 Notifications vocales activées",
        description: "Les conditions météo seront annoncées vocalement",
      });
    } else {
      window.speechSynthesis.cancel();
      toast({
        title: "🔇 Notifications vocales désactivées",
        description: "Les annonces vocales sont maintenant coupées",
      });
    }
  };

  return (
    <Button
      onClick={toggleVoice}
      variant={isVoiceEnabled ? "default" : "outline"}
      size="sm"
      className="flex items-center gap-2"
    >
      {isVoiceEnabled ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
      {isVoiceEnabled ? "Vocal ON" : "Vocal OFF"}
    </Button>
  );
};
