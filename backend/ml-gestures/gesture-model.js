let model;

// ✅ Send recognized gesture to React Native WebView
function sendGestureToReactNative(gesture) {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ gesture }));
  } else {
    console.log("Gesture detected:", gesture);
  }
}

async function loadModel() {
  console.log('loadModel called'); // Debug
  try {
    // Skip real model for now – force dummy to test
    throw new Error('Force dummy for testing'); // Comment this line later for real model
    model = await tf.loadLayersModel('./model/model.json');
    console.log('Real ASL model loaded successfully!');
  } catch (error) {
    console.warn('Using dummy model:', error.message);
    model = createDummyModel();
    console.log('Dummy model activated and ready');
  }
}

// Dummy model: Always predicts based on position, with logs
function createDummyModel() {
  return {
    predict: function (inputTensor) {
      try {
        const scores = new Array(26).fill(0.05);
        const predictedClass = Math.floor(Math.random() * 26); // random dummy output
        scores[predictedClass] = 0.9;

        const letter = String.fromCharCode(65 + predictedClass);
        console.log('Dummy model prediction sent: Letter -', letter); // Debug log

        // ✅ Send prediction to React Native
        sendGestureToReactNative(letter);

        return tf.tensor1d(scores);
      } catch (error) {
        console.error('Dummy predict error:', error);
        const scores = new Array(26).fill(0.05);
        scores[1] = 0.9; // Default 'B'
        sendGestureToReactNative('B');
        return tf.tensor1d(scores);
      }
    },
  };
}

function predictGesture(landmarks) {
  console.log('predictGesture called - landmarks length:', landmarks ? landmarks.length : 'undefined'); // Debug start
  if (!model) {
    console.error('predictGesture: No model loaded!');
    return 'Unknown'; // Force something instead of null
  }
  if (!landmarks || landmarks.length === 0) {
    console.log('predictGesture: No landmarks');
    return null;
  }

  try {
    if (landmarks.length % 3 !== 0) {
      console.warn('predictGesture: Invalid length:', landmarks.length);
      return 'Unknown'; // Force instead of null
    }

    const tensor = tf.tensor2d([landmarks], [1, landmarks.length]);
    console.log('Tensor created shape:', tensor.shape); // Debug
    const prediction = model.predict(tensor);
    const scores = prediction.dataSync();
    console.log('Scores length:', scores.length, 'Max:', Math.max(...scores)); // Debug

    const label = getLabelFromScores(scores);

    // ✅ Send recognized label to React Native WebView
    sendGestureToReactNative(label);

    tensor.dispose();
    prediction.dispose();

    console.log('predictGesture success - returning:', label); // Success
    return label;
  } catch (error) {
    console.error('predictGesture error:', error);
    sendGestureToReactNative('Unknown');
    return 'Unknown'; // Force fallback letter
  }
}

function getLabelFromScores(scores) {
  const labels = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  if (!scores || scores.length === 0) {
    console.log('getLabel: No scores, default B');
    return 'B'; // Force default instead of 'Unknown'
  }

  const maxIndex = scores.reduce((maxIdx, val, idx, arr) => val > arr[maxIdx] ? idx : maxIdx, 0);
  const label = labels[maxIndex] || 'B'; // Default 'B'
  console.log('getLabel: Returning', label, 'from index', maxIndex); // Debug
  return label;
}
