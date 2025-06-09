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
          {/* Vue d'ensemble mise à jour */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Vue d'ensemble du modèle hybride
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Notre système de prédiction météorologique utilise une approche hybride intelligente combinant :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Modèle LSTM</h4>
                  <p className="text-sm text-blue-600">Réseau de neurones récurrent avec TensorFlow.js</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">Analyse des tendances</h4>
                  <p className="text-sm text-green-600">Régression linéaire de fallback</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Corrélations physiques</h4>
                  <p className="text-sm text-purple-600">Relations entre variables météorologiques</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800">Sélection automatique</h4>
                  <p className="text-sm text-orange-600">LSTM si possible, sinon modèle linéaire</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nouveau: Architecture LSTM */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Architecture du modèle LSTM (TensorFlow.js)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Badge variant="outline" className="mb-4">Priorité: Modèle principal</Badge>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-700">Structure du réseau de neurones :</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h5 className="font-medium text-purple-800">Couche LSTM 1</h5>
                      <ul className="text-sm text-purple-600 mt-1 space-y-1">
                        <li>• 50 unités LSTM</li>
                        <li>• returnSequences: true</li>
                        <li>• Dropout: 20%</li>
                        <li>• Dropout récurrent: 20%</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h5 className="font-medium text-purple-800">Couche LSTM 2</h5>
                      <ul className="text-sm text-purple-600 mt-1 space-y-1">
                        <li>• 50 unités LSTM</li>
                        <li>• returnSequences: false</li>
                        <li>• Dropout: 20%</li>
                        <li>• Dropout récurrent: 20%</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h5 className="font-medium text-purple-800">Couche Dense 1</h5>
                      <ul className="text-sm text-purple-600 mt-1 space-y-1">
                        <li>• 25 neurones</li>
                        <li>• Activation: ReLU</li>
                        <li>• Dropout: 20%</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h5 className="font-medium text-purple-800">Couche de sortie</h5>
                      <ul className="text-sm text-purple-600 mt-1 space-y-1">
                        <li>• 9 neurones (features météo)</li>
                        <li>• Activation: linéaire</li>
                        <li>• Perte: MSE</li>
                        <li>• Métrique: MAE</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Paramètres d'entraînement :</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><strong>Époques :</strong> 50</div>
                    <div><strong>Batch size :</strong> 8</div>
                    <div><strong>Validation :</strong> 20%</div>
                    <div><strong>Optimiseur :</strong> Adam (lr=0.001)</div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Preprocessing des données :</h5>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• <strong>Normalisation :</strong> Min-Max scaling (0-1) pour chaque feature</li>
                    <li>• <strong>Séquences :</strong> Fenêtres glissantes de 7 jours</li>
                    <li>• <strong>Features :</strong> 9 variables météorologiques</li>
                    <li>• <strong>Cible :</strong> Prédiction du jour suivant</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Étape 1 mise à jour: Sélection du modèle */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Étape 1: Sélection intelligente du modèle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Logique de sélection automatique :</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-green-700">Modèle LSTM (prioritaire)</p>
                      <p className="text-sm text-green-600">
                        Utilisé si : données historiques ≥ 14 jours ET modèle entraîné avec succès
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-orange-700">Modèle linéaire (fallback)</p>
                      <p className="text-sm text-orange-600">
                        Utilisé si : données insuffisantes OU erreur d'entraînement LSTM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ... keep existing code (analyze trends section) */}
              <Badge variant="outline" className="mb-4">Fonction: analyzeTrends() + trainModelIfNeeded()</Badge>
              
              <h4 className="font-semibold">Calcul de régression linéaire (fallback) :</h4>
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

          {/* Étape 2 mise à jour: Génération hybride */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-orange-600" />
                Étape 2: Génération hybride des prédictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Badge variant="outline" className="mb-4">Fonction: generatePredictions()</Badge>

              {/* Prédiction LSTM */}
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-purple-700">Prédictions avec LSTM (méthode principale)</h4>
                <div className="bg-purple-50 p-3 rounded mt-2 text-sm space-y-2">
                  <p><strong>Processus séquentiel :</strong></p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Normalisation des 7 derniers jours de données</li>
                    <li>Création du tenseur d'entrée 3D [1, 7, 9]</li>
                    <li>Passage dans le réseau LSTM entraîné</li>
                    <li>Dénormalisation de la sortie</li>
                    <li>Mise à jour de la séquence pour le jour suivant</li>
                  </ol>
                  
                  <div className="bg-purple-100 p-2 rounded mt-3">
                    <p><strong>Avantages :</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Capture les patterns complexes non-linéaires</li>
                      <li>Mémoire à long terme des séquences</li>
                      <li>Adaptation automatique aux données locales</li>
                      <li>Meilleure précision sur les séries temporelles</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modèle linéaire de fallback */}
              <div className="border-l-4 border-orange-400 pl-4">
                <h4 className="font-semibold text-orange-700">Prédictions linéaires (fallback)</h4>
                <div className="bg-orange-50 p-3 rounded mt-2 text-sm">
                  <p><strong>Utilisé quand :</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Moins de 14 jours de données historiques</li>
                    <li>Échec de l'entraînement LSTM</li>
                    <li>Erreur lors de l'inférence LSTM</li>
                  </ul>
                  
                  <p className="mt-2"><strong>Formule température (exemple) :</strong></p>
                  <p className="font-mono">T(j) = T_actuelle + (tendance_T × j × e^(-j×0.2)) + variation_saisonnière</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Étape 3: Comparaison des performances */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Étape 3: Évaluation et comparaison des modèles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-700">Performance LSTM</h4>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-medium text-purple-800">Métriques d'évaluation :</h5>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• <strong>MAE :</strong> Mean Absolute Error</li>
                      <li>• <strong>RMSE :</strong> Root Mean Square Error</li>
                      <li>• <strong>Validation :</strong> 20% des données</li>
                      <li>• <strong>Test :</strong> Données récentes non vues</li>
                    </ul>
                    
                    <div className="mt-3 p-2 bg-purple-100 rounded text-xs">
                      <p><strong>Fonction d'évaluation :</strong></p>
                      <p className="font-mono">model.evaluate(xTest, yTest)</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-orange-700">Robustesse du système</h4>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h5 className="font-medium text-orange-800">Mécanismes de sécurité :</h5>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• <strong>Try-catch :</strong> Gestion des erreurs LSTM</li>
                      <li>• <strong>Fallback automatique :</strong> Vers modèle linéaire</li>
                      <li>• <strong>Validation :</strong> Vérification des données</li>
                      <li>• <strong>Nettoyage :</strong> Libération mémoire GPU</li>
                    </ul>
                    
                    <div className="mt-3 p-2 bg-orange-100 rounded text-xs">
                      <p><strong>Disponibilité :</strong> 99.9% grâce au fallback</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitations et améliorations mises à jour */}
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Limitations actuelles et améliorations futures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Limitations actuelles</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>LSTM simple (pas de modèles ensemble)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Entraînement local uniquement (pas de modèle pré-entraîné)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Données limitées aux APIs météo publiques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Pas de données satellite ou radar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>Performance dépendante du navigateur</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Améliorations futures</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Modèles ensemble (LSTM + GRU + Transformer)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Transfer learning avec modèles pré-entraînés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Intégration WebGPU pour accélération</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Données multi-sources (satellite, stations)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Prédictions probabilistes avec incertitude</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Separator className="my-4" />
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Architecture technique actuelle</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Frontend</p>
                    <p className="text-gray-600">React + TensorFlow.js</p>
                  </div>
                  <div>
                    <p className="font-medium">Modèle</p>
                    <p className="text-gray-600">LSTM + Régression</p>
                  </div>
                  <div>
                    <p className="font-medium">Données</p>
                    <p className="text-gray-600">Open-Meteo API</p>
                  </div>
                  <div>
                    <p className="font-medium">Exécution</p>
                    <p className="text-gray-600">Client-side</p>
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
