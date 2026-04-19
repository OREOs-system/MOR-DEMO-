const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const staticDir = path.join(__dirname, '.');

app.use(express.static(staticDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
