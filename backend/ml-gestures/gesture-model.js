let model;

async function loadModel() {
  try {
    // Load from local folder (relative to index.html)
    model = await tf.loadLayersModel('./model/model.json'); // Your Teachable Machine export
    console.log('Real ASL model loaded successfully!');
  } catch (error) {
    console.warn('Failed to load real model (likely 404). Using dummy model for testing:', error);
    // Fallback: Dummy model
    model = createDummyModel();
  }
}

// Dummy model for testing (simulates predictions; replace once real model is ready)
function createDummyModel() {
  return {
    predict: function(inputTensor) {
      // Simple dummy logic: "Predict" based on landmark data (e.g., average x-position)
      const data = inputTensor.dataSync();
      const avgX = data.reduce((sum, val, i) => i % 3 === 0 ? sum + val : sum, 0) / (data.length / 3); // Avg x-coords
      
      let predictedClass;
      if (avgX > 0.6) {
        predictedClass = 0; // 'A'
      } else if (avgX > 0.4) {
        predictedClass = 1; // 'B'
      } else {
        predictedClass = 2; // 'C'
      }
      
      // Fake scores: High for predicted class, low for others (26 classes)
      const scores = new Array(26).fill(0.05);
      scores[predictedClass] = 0.90;
      return tf.tensor1d(scores);
    }
  };
}

function predictGesture(landmarks) {
  if (!model || landmarks.length === 0) return null;
  const tensor = tf.tensor2d([landmarks], [1, landmarks.length]);
  const prediction = model.predict(tensor);
  const scores = prediction.dataSync();
  const label = getLabelFromScores(scores);
  tensor.dispose();
  prediction.dispose();
  return label;
}

function getLabelFromScores(scores) {
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // Find index of max score (argmax)
  const maxIndex = scores.reduce((maxIdx, val, idx, arr) => val > arr[maxIdx] ? idx : maxIdx, 0);
  return labels[maxIndex] || 'Unknown';
}