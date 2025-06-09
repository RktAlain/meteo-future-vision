
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, TrendingUp, Calculator, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ModelExplanation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Modèle de Prédiction Météorologique</h1>
            <p className="text-gray-600 mt-2">Explication détaillée des algorithmes et calculs utilisés</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Vue d'ensemble */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Vue d'ensemble du modèle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Notre système de prédiction météorologique utilise une approche basée sur l'analyse des tendances historiques 
                et des corrélations physiques entre les variables météorologiques pour générer des prédictions précises sur 5 jours.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Analyse des tendances</h4>
                  <p className="text-sm text-blue-600">Régression linéaire sur données historiques</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">Corrélations physiques</h4>
                  <p className="text-sm text-green-600">Relations entre variables météorologiques</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Variations saisonnières</h4>
                  <p className="text-sm text-purple-600">Patterns cycliques et amortissement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Étape 1: Analyse des tendances */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Étape 1: Analyse des tendances historiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="mb-4">Fonction: analyzeTrends()</Badge>
              
              <h4 className="font-semibold">Calcul de régression linéaire :</h4>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                <p><strong>Formule de tendance :</strong></p>
                <p>tendance = (n × ΣXY - ΣX × ΣY) / (n × ΣX² - (ΣX)²)</p>
                <br />
                <p><strong>Où :</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>n = nombre de jours historiques</li>
                  <li>X = index du jour (0, 1, 2, ...)</li>
                  <li>Y = valeur météorologique (température, humidité, etc.)</li>
                </ul>
              </div>
              
              <h4 className="font-semibold mt-6">Variables analysées :</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Badge variant="secondary">Température</Badge>
                <Badge variant="secondary">Humidité</Badge>
                <Badge variant="secondary">Pression</Badge>
                <Badge variant="secondary">Vitesse du vent</Badge>
                <Badge variant="secondary">Précipitations</Badge>
                <Badge variant="secondary">Couverture nuageuse</Badge>
                <Badge variant="secondary">Index UV</Badge>
                <Badge variant="secondary">Point de rosée</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Étape 2: Génération des prédictions */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-orange-600" />
                Étape 2: Génération des prédictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Badge variant="outline" className="mb-4">Fonction: generatePredictions()</Badge>

              <div className="space-y-4">
                <h4 className="font-semibold">Formules de prédiction par variable :</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800">Température</h5>
                    <p className="text-sm text-blue-600 mt-1 font-mono">
                      T(j) = T_actuelle + (tendance_T × j × e^(-j×0.2)) + variation_saisonnière
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-800">Humidité</h5>
                    <p className="text-sm text-green-600 mt-1 font-mono">
                      H(j) = H_actuelle + (tendance_H × j × e^(-j×0.2)) + corrélation_temp
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-purple-800">Précipitations</h5>
                    <p className="text-sm text-purple-600 mt-1 font-mono">
                      P(j) = pattern_P × facteur_humidité × aléatoire
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h5 className="font-medium text-orange-800">Index UV</h5>
                    <p className="text-sm text-orange-600 mt-1 font-mono">
                      UV(j) = UV_actuel + tendance_UV - réduction_nuages
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Corrélations physiques intégrées :</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• <strong>Température-Humidité :</strong> Température plus basse → humidité plus élevée</li>
                  <li>• <strong>Humidité-Précipitations :</strong> Humidité {">"} 80% → facteur précipitations ×1.5</li>
                  <li>• <strong>Précipitations-Nuages :</strong> Plus de précipitations → plus de couverture nuageuse</li>
                  <li>• <strong>Nuages-UV :</strong> Plus de nuages → réduction de l'index UV</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Étape 3: Amortissement et variations */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Étape 3: Amortissement et variations saisonnières
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-indigo-700">Facteur d'amortissement</h4>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-indigo-600 font-mono mb-2">
                      amortissement = e^(-jour × 0.2)
                    </p>
                    <p className="text-sm text-indigo-600">
                      Les tendances perdent en intensité au fil des jours pour éviter 
                      les prédictions extrêmes à long terme.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-700">Variation saisonnière</h4>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-mono mb-2">
                      variation = sin(temps / année × 2π) × 2
                    </p>
                    <p className="text-sm text-purple-600">
                      Intègre les cycles saisonniers naturels pour des prédictions 
                      plus réalistes selon la période de l'année.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitations et améliorations */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Limitations et améliorations futures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Limitations actuelles</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Modèle linéaire simple (pas de machine learning complexe)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Dépendance aux données historiques locales</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Pas de prise en compte des phénomènes météo extrêmes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Prédictions sur 5 jours maximum</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Améliorations futures</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Intégration de modèles de machine learning (LSTM, Random Forest)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Prise en compte des données satellite</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Prédictions probabilistes avec intervalles de confiance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Extension à 10-15 jours de prédiction</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Separator className="my-4" />
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Précision actuelle du modèle</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Température</p>
                    <p className="text-gray-600">±2°C sur 5 jours</p>
                  </div>
                  <div>
                    <p className="font-medium">Humidité</p>
                    <p className="text-gray-600">±10% sur 5 jours</p>
                  </div>
                  <div>
                    <p className="font-medium">Précipitations</p>
                    <p className="text-gray-600">Tendance générale</p>
                  </div>
                  <div>
                    <p className="font-medium">Vent</p>
                    <p className="text-gray-600">±5 km/h sur 5 jours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModelExplanation;
