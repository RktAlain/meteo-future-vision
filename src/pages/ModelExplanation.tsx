
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, TrendingUp, Calculator, Brain, BarChart3 } from 'lucide-react';
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
                <Brain className="h-5 w-5 text-blue-600" />
                Vue d'ensemble du modèle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Notre modèle de prédiction météorologique utilise une approche hybride combinant :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Analyse des tendances</h4>
                  <p className="text-sm text-blue-600">Régression linéaire sur les données historiques</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">Corrélations physiques</h4>
                  <p className="text-sm text-green-600">Relations entre température, humidité, pression</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Variations saisonnières</h4>
                  <p className="text-sm text-purple-600">Cycles naturels et patterns climatiques</p>
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

              {/* Température */}
              <div className="border-l-4 border-red-400 pl-4">
                <h4 className="font-semibold text-red-700">Prédiction de température</h4>
                <div className="bg-red-50 p-3 rounded mt-2 text-sm">
                  <p><strong>Formule :</strong></p>
                  <p>T(j) = T_actuelle + (tendance_T × j × amortissement) + variation_saisonnière</p>
                  <br />
                  <p><strong>Où :</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>j = nombre de jours dans le futur</li>
                    <li>amortissement = e^(-j × 0.2) (les tendances s'atténuent)</li>
                    <li>variation_saisonnière = sin(temps_année × 2π) × 2°C</li>
                  </ul>
                </div>
              </div>

              {/* Humidité */}
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-blue-700">Prédiction d'humidité</h4>
                <div className="bg-blue-50 p-3 rounded mt-2 text-sm">
                  <p><strong>Formule :</strong></p>
                  <p>H(j) = H_actuelle + (tendance_H × j × amortissement) + corrélation_température</p>
                  <br />
                  <p><strong>Corrélation température-humidité :</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Si T diminue → Humidité +5%</li>
                    <li>Si T augmente → Humidité -3%</li>
                  </ul>
                </div>
              </div>

              {/* Pression */}
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-green-700">Prédiction de pression</h4>
                <div className="bg-green-50 p-3 rounded mt-2 text-sm">
                  <p><strong>Formule :</strong></p>
                  <p>P(j) = P_actuelle + (tendance_P × j × amortissement × 0.5)</p>
                  <p><em>Note: Facteur 0.5 car la pression change plus lentement</em></p>
                </div>
              </div>

              {/* Précipitations */}
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-purple-700">Prédiction des précipitations</h4>
                <div className="bg-purple-50 p-3 rounded mt-2 text-sm">
                  <p><strong>Formule :</strong></p>
                  <p>Prec(j) = pattern_historique × facteur_humidité × variabilité</p>
                  <br />
                  <p><strong>Facteur humidité :</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Si H > 80% → facteur = 1.5</li>
                    <li>Si H < 40% → facteur = 0.3</li>
                    <li>Sinon → facteur = 1.0</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Étape 3: Corrélations et validations */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Étape 3: Corrélations physiques et validations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold">Relations inter-variables :</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <h5 className="font-medium text-indigo-800">Couverture nuageuse</h5>
                  <p className="text-sm text-indigo-600">
                    Nuages(j) = pattern_historique + impact_précipitations + effet_humidité
                  </p>
                  <ul className="text-xs mt-2 space-y-1">
                    <li>• Précipitations > 5mm → +20% nuages</li>
                    <li>• Précipitations > 1mm → +10% nuages</li>
                    <li>• Humidité influence: (H-60) × 0.5</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800">Index UV</h5>
                  <p className="text-sm text-yellow-600">
                    UV(j) = UV_base + tendance - réduction_nuages
                  </p>
                  <ul className="text-xs mt-2 space-y-1">
                    <li>• Réduction nuages = UV_base × (couverture/100) × 0.7</li>
                    <li>• Plafond maximum: 12</li>
                    <li>• Plancher minimum: 0</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-cyan-50 rounded-lg">
                  <h5 className="font-medium text-cyan-800">Point de rosée</h5>
                  <p className="text-sm text-cyan-600">
                    Rosée(j) = Température(j) - ((100 - Humidité(j)) / 5)
                  </p>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h5 className="font-medium text-red-800">Direction du vent</h5>
                  <p className="text-sm text-red-600">
                    Dir(j) = Dir_actuelle + variation_naturelle
                  </p>
                  <p className="text-xs mt-1">Variation: ±30° × j (modulo 360°)</p>
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
                      <span>Modèle linéaire simple (pas de ML avancé)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Pas de prise en compte des systèmes météorologiques complexes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Amortissement fixe des tendances</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Variabilité aléatoire limitée</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Améliorations possibles</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Intégration de réseaux de neurones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Analyse de patterns météorologiques complexes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Données satellite et radar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Modèles ensemble et validation croisée</span>
                    </li>
                  </ul>
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
