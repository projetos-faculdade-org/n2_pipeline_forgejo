const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/echo', (req, res) => {
  res.json({ received: req.body });
});

app.listen(port, () => {
  console.log(`mini-api listening on port ${port}`);
});
