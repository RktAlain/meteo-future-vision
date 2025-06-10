
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Database, TrendingUp, CloudRain, Thermometer, Wind, Sun } from 'lucide-react';

const ModelExplanation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            Fonctionnement du Modèle de Prédiction Météorologique
          </h1>
        </div>

        <div className="space-y-6">
          {/* Vue d'ensemble */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Brain className="h-6 w-6 mr-2 text-purple-600" />
                Vue d'ensemble du Modèle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Notre modèle de prédiction météorologique utilise une approche hybride combinant :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>Données historiques :</strong> 2 années complètes de données météorologiques via l'API Open-Meteo Archive</li>
                <li><strong>Données en temps réel :</strong> Conditions météorologiques actuelles avec températures min/max du jour</li>
                <li><strong>Analyse des tendances :</strong> Détection de patterns saisonniers et variations climatiques</li>
                <li><strong>Prédictions dynamiques :</strong> Génération de prévisions sur 7 jours avec intervalles de température</li>
                <li><strong>Édition manuelle :</strong> Possibilité de modifier les données d'entrée pour des scénarios personnalisés</li>
              </ul>
            </CardContent>
          </Card>

          {/* Sources de données */}
          <Card className="backdrop-blur-sm bg-gradient-to-r from-green-50/80 to-blue-50/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Database className="h-6 w-6 mr-2 text-green-600" />
                Sources de Données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">API Open-Meteo Archive</h3>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-gray-600">
                    <li>Données historiques sur 2 ans (2023-2024)</li>
                    <li>Températures min/max quotidiennes</li>
                    <li>Précipitations, pression, vent</li>
                    <li>Couverture nuageuse et conditions météo</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">API Open-Meteo Current</h3>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-gray-600">
                    <li>Température actuelle et apparente</li>
                    <li>Min/Max du jour en cours</li>
                    <li>Humidité, pression, vent en temps réel</li>
                    <li>Index UV et conditions actuelles</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Algorithme de prédiction */}
          <Card className="backdrop-blur-sm bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <TrendingUp className="h-6 w-6 mr-2 text-purple-600" />
                Algorithme de Prédiction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">1. Analyse des Tendances</h4>
                  <p className="text-sm text-gray-600">
                    Calcul des tendances linéaires sur les paramètres météorologiques
                    et détection des patterns saisonniers.
                  </p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">2. Variations Réalistes</h4>
                  <p className="text-sm text-gray-600">
                    Application d'écarts-types historiques et de corrélations
                    entre les paramètres météorologiques.
                  </p>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">3. Prédictions Dynamiques</h4>
                  <p className="text-sm text-gray-600">
                    Génération de prévisions avec amortissement des tendances
                    et variations cycliques.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paramètres prédits */}
          <Card className="backdrop-blur-sm bg-gradient-to-r from-orange-50/80 to-red-50/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Thermometer className="h-6 w-6 mr-2 text-orange-600" />
                Paramètres Prédits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <Thermometer className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <h4 className="font-semibold">Température</h4>
                  <p className="text-sm text-gray-600">Moyenne, Min, Max quotidiens</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <CloudRain className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h4 className="font-semibold">Précipitations</h4>
                  <p className="text-sm text-gray-600">Quantité et probabilité</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <Wind className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                  <h4 className="font-semibold">Vent</h4>
                  <p className="text-sm text-gray-600">Vitesse et direction</p>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <Sun className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <h4 className="font-semibold">Autres</h4>
                  <p className="text-sm text-gray-600">UV, humidité, pression</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fonctionnalités */}
          <Card className="backdrop-blur-sm bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Fonctionnalités Avancées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">📊 Visualisation Interactive</h3>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-gray-600">
                    <li>Graphiques temporels sur 2 semaines</li>
                    <li>Comparaison données historiques/prédictions</li>
                    <li>Tableaux détaillés avec pagination</li>
                    <li>Affichage des intervalles de température</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">⚙️ Contrôle Utilisateur</h3>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-gray-600">
                    <li>Sélection de toutes les régions de Madagascar</li>
                    <li>Édition manuelle des paramètres d'entrée</li>
                    <li>Basculement entre données API et manuelles</li>
                    <li>Notifications vocales des prédictions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Précision du modèle */}
          <Card className="backdrop-blur-sm bg-gradient-to-r from-yellow-50/80 to-orange-50/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">Précision et Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <h4 className="font-semibold text-yellow-800">📋 Points Importants</h4>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-sm text-yellow-700">
                  <li>Les prédictions sont plus précises à court terme (1-3 jours)</li>
                  <li>Le modèle s'adapte aux conditions climatiques locales de Madagascar</li>
                  <li>Les données historiques permettent une meilleure compréhension des patterns saisonniers</li>
                  <li>L'édition manuelle permet de tester des scénarios hypothétiques</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModelExplanation;
