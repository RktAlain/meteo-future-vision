
import * as tf from '@tensorflow/tfjs';
import { WeatherData } from '@/types/weather';

export interface LSTMPredictionModel {
  model: tf.Sequential | null;
  scaler: {
    min: number[];
    max: number[];
  };
  isTraining: boolean;
  isReady: boolean;
}

// Normaliser les données entre 0 et 1
const normalizeData = (data: number[][], scaler?: { min: number[]; max: number[] }) => {
  if (!data.length) return { normalizedData: [], scaler: { min: [], max: [] } };
  
  const numFeatures = data[0].length;
  const min = scaler?.min || new Array(numFeatures).fill(Infinity);
  const max = scaler?.max || new Array(numFeatures).fill(-Infinity);
  
  if (!scaler) {
    // Calculer min et max pour chaque feature
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < numFeatures; j++) {
        min[j] = Math.min(min[j], data[i][j]);
        max[j] = Math.max(max[j], data[i][j]);
      }
    }
  }
  
  // Normaliser
  const normalizedData = data.map(row => 
    row.map((value, index) => {
      const range = max[index] - min[index];
      return range === 0 ? 0 : (value - min[index]) / range;
    })
  );
  
  return { normalizedData, scaler: { min, max } };
};

// Dénormaliser les prédictions
const denormalizeData = (normalizedData: number[][], scaler: { min: number[]; max: number[] }) => {
  return normalizedData.map(row => 
    row.map((value, index) => {
      const range = scaler.max[index] - scaler.min[index];
      return value * range + scaler.min[index];
    })
  );
};

// Convertir les données météo en features numériques
const weatherToFeatures = (weather: WeatherData[]): number[][] => {
  return weather.map(w => [
    w.temperature,
    w.humidity,
    w.pressure,
    w.windSpeed,
    w.windDirection,
    w.precipitation,
    w.cloudCover,
    w.uvIndex,
    w.dewPoint
  ]);
};

// Créer des séquences pour LSTM
const createSequences = (data: number[][], sequenceLength: number = 7) => {
  const sequences = [];
  const targets = [];
  
  for (let i = 0; i < data.length - sequenceLength; i++) {
    sequences.push(data.slice(i, i + sequenceLength));
    targets.push(data[i + sequenceLength]);
  }
  
  return { sequences, targets };
};

// Créer le modèle LSTM
export const createLSTMModel = (inputShape: [number, number]): tf.Sequential => {
  const model = tf.sequential({
    layers: [
      tf.layers.lstm({
        units: 50,
        returnSequences: true,
        inputShape: inputShape,
        dropout: 0.2,
        recurrentDropout: 0.2
      }),
      tf.layers.lstm({
        units: 50,
        returnSequences: false,
        dropout: 0.2,
        recurrentDropout: 0.2
      }),
      tf.layers.dense({
        units: 25,
        activation: 'relu'
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({
        units: 9, // 9 features météorologiques
        activation: 'linear'
      })
    ]
  });

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError',
    metrics: ['mae']
  });

  return model;
};

// Entraîner le modèle LSTM
export const trainLSTMModel = async (
  historicalData: WeatherData[],
  onProgress?: (epoch: number, loss: number) => void
): Promise<LSTMPredictionModel> => {
  console.log('Début de l\'entraînement du modèle LSTM...');
  
  if (historicalData.length < 14) {
    throw new Error('Pas assez de données historiques pour entraîner le modèle LSTM (minimum 14 jours)');
  }

  // Convertir en features
  const features = weatherToFeatures(historicalData);
  
  // Normaliser les données
  const { normalizedData, scaler } = normalizeData(features);
  
  // Créer des séquences
  const sequenceLength = 7;
  const { sequences, targets } = createSequences(normalizedData, sequenceLength);
  
  if (sequences.length === 0) {
    throw new Error('Impossible de créer des séquences d\'entraînement');
  }

  // Convertir en tenseurs
  const xTrain = tf.tensor3d(sequences);
  const yTrain = tf.tensor2d(targets);
  
  // Créer le modèle
  const model = createLSTMModel([sequenceLength, features[0].length]);
  
  try {
    // Entraîner le modèle
    const history = await model.fit(xTrain, yTrain, {
      epochs: 50,
      batchSize: 8,
      validationSplit: 0.2,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (onProgress && logs) {
            onProgress(epoch, logs.loss as number);
          }
        }
      }
    });
    
    console.log('Entraînement terminé. Perte finale:', history.history.loss[history.history.loss.length - 1]);
    
    // Nettoyer les tenseurs
    xTrain.dispose();
    yTrain.dispose();
    
    return {
      model,
      scaler,
      isTraining: false,
      isReady: true
    };
  } catch (error) {
    // Nettoyer en cas d'erreur
    xTrain.dispose();
    yTrain.dispose();
    model.dispose();
    throw error;
  }
};

// Faire des prédictions avec le modèle LSTM
export const predictWithLSTM = async (
  lstmModel: LSTMPredictionModel,
  recentData: WeatherData[],
  days: number = 5
): Promise<WeatherData[]> => {
  if (!lstmModel.model || !lstmModel.isReady) {
    throw new Error('Le modèle LSTM n\'est pas prêt');
  }

  if (recentData.length < 7) {
    throw new Error('Il faut au moins 7 jours de données récentes pour faire des prédictions');
  }

  const predictions: WeatherData[] = [];
  let currentSequence = weatherToFeatures(recentData.slice(-7));
  
  // Normaliser la séquence initiale
  const { normalizedData: normalizedSequence } = normalizeData(currentSequence, lstmModel.scaler);

  for (let day = 1; day <= days; day++) {
    // Préparer la séquence pour la prédiction
    const inputSequence = tf.tensor3d([normalizedSequence]);
    
    try {
      // Faire la prédiction
      const prediction = lstmModel.model.predict(inputSequence) as tf.Tensor;
      const predictionData = await prediction.data();
      
      // Dénormaliser la prédiction
      const denormalizedPrediction = denormalizeData([Array.from(predictionData)], lstmModel.scaler)[0];
      
      // Créer l'objet WeatherData
      const predictedWeather: WeatherData = {
        temperature: Math.round(denormalizedPrediction[0] * 10) / 10,
        humidity: Math.max(0, Math.min(100, Math.round(denormalizedPrediction[1]))),
        pressure: Math.round(denormalizedPrediction[2] * 10) / 10,
        windSpeed: Math.max(0, Math.round(denormalizedPrediction[3] * 10) / 10),
        windDirection: Math.round(denormalizedPrediction[4]) % 360,
        precipitation: Math.max(0, Math.round(denormalizedPrediction[5] * 10) / 10),
        cloudCover: Math.max(0, Math.min(100, Math.round(denormalizedPrediction[6]))),
        uvIndex: Math.max(0, Math.min(12, Math.round(denormalizedPrediction[7] * 10) / 10)),
        dewPoint: Math.round(denormalizedPrediction[8] * 10) / 10,
        date: new Date(Date.now() + day * 24 * 60 * 60 * 1000)
      };
      
      predictions.push(predictedWeather);
      
      // Mettre à jour la séquence pour la prochaine prédiction
      normalizedSequence.shift();
      normalizedSequence.push(normalizeData([denormalizedPrediction], lstmModel.scaler).normalizedData[0]);
      
      // Nettoyer les tenseurs
      inputSequence.dispose();
      prediction.dispose();
    } catch (error) {
      inputSequence.dispose();
      throw error;
    }
  }

  return predictions;
};

// Évaluer la performance du modèle
export const evaluateModel = async (
  lstmModel: LSTMPredictionModel,
  testData: WeatherData[]
): Promise<{ mae: number; rmse: number }> => {
  if (!lstmModel.model || testData.length < 14) {
    return { mae: 0, rmse: 0 };
  }

  const features = weatherToFeatures(testData);
  const { normalizedData } = normalizeData(features, lstmModel.scaler);
  const { sequences, targets } = createSequences(normalizedData, 7);

  if (sequences.length === 0) {
    return { mae: 0, rmse: 0 };
  }

  const xTest = tf.tensor3d(sequences);
  const yTest = tf.tensor2d(targets);

  try {
    const evaluation = await lstmModel.model.evaluate(xTest, yTest) as tf.Scalar[];
    const loss = await evaluation[0].data();
    const mae = await evaluation[1].data();

    return {
      mae: mae[0],
      rmse: Math.sqrt(loss[0])
    };
  } finally {
    xTest.dispose();
    yTest.dispose();
  }
};
