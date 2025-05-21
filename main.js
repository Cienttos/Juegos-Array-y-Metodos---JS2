const express = require('express');
const path = require('path');
const bodyParser = require('express').urlencoded({ extended: true });

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser);

const scoresGame1 = [];
const scoresGame2 = [];
const scoresGame3 = [];

app.get('/data/:game', (req, res) => {
  const { game } = req.params;
  if (game === 'game1') return res.json(scoresGame1);
  if (game === 'game2') return res.json(scoresGame2);
  if (game === 'game3') return res.json(scoresGame3);
  res.status(404).json({ error: 'Juego no encontrado' });
});

app.post('/data/:game', (req, res) => {
  const { game } = req.params;
  const { nickname, score } = req.body;
  if (!nickname || !score) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  const entry = { nickname, score: Number(score) };
  if (game === 'game1') scoresGame1.push(entry);
  else if (game === 'game2') scoresGame2.push(entry);
  else if (game === 'game3') scoresGame3.push(entry);
  else return res.status(404).json({ error: 'Juego no encontrado' });
  res.json({ success: true });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('✅ Servidor en http://localhost:3000');
});