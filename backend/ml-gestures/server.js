const express = require('express');
const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/predict', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => console.log(`Server running on port ${port}`));