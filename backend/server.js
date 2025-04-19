const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('<p>Backend is running on port 3001</p>');
});

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
