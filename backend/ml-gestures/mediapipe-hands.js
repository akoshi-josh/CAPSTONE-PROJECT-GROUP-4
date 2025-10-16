// Draw landmarks on canvas (for visual feedback)
function drawLandmarks(results) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  if (!canvas || !ctx) return;
  
  // Set canvas size based on video
  const video = document.getElementById('video');
  if (video) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  } else {
    console.warn('Video element not found; using default canvas size');
  }
  
  ctx.save();  // Save the current context state
  
  // Apply horizontal flip for mirroring
  ctx.translate(canvas.width, 0);  // Move the context to the right edge
  ctx.scale(-1, 1);  // Flip horizontally
  
  ctx.clearRect(-canvas.width, 0, canvas.width, canvas.height);  // Clear with flipped coordinates
  
  if (results.image) {
    // Draw the image with flip applied
    ctx.drawImage(results.image, -canvas.width, 0, canvas.width, canvas.height);  // Adjust for flip
  }
  
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
      drawLandmarks(ctx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  
  ctx.restore();  // Restore the context to its original state
  
  console.log('Landmarks drawn with horizontal flip applied');  // Debug log
}