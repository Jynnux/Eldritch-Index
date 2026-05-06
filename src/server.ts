import express from 'express';

const app = express();

app.post('/api/login', (req, res) => {
  res.json({ message: 'logged in' });
});

app.listen(3000);
