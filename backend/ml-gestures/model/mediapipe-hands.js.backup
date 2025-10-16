// Draw landmarks on canvas (for visual feedback)
function drawLandmarks(results) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  if (!canvas || !ctx) return;
  canvas.width = document.getElementById('video').videoWidth;
  canvas.height = document.getElementById('video').videoHeight;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (results.image) ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#00FF00', lineWidth: 5});
      drawLandmarks(ctx, landmarks, {color: '#FF0000', lineWidth: 2});
    }
  }
  ctx.restore();
}