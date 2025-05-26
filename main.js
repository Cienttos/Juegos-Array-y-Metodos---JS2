const express = require('express');
const path = require('path');
const bodyParser = require('express').urlencoded({ extended: true });

const app = express();
// Since Vercel handles static files from 'public' directly,
// you might not strictly need this `express.static` for hosted deployments
// if your public folder is configured correctly in vercel.json or by default.
// However, it's good to keep for local development.
app.use(express.static(path.join(__dirname, '../public'))); // Adjust path for public folder

app.use(bodyParser);
app.use(express.json()); // Add this for parsing JSON bodies if you intend to send JSON

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

// The root route for your serverless function might need to be `/api`
// if your rewrites are set up that way, or just `/` if you want it to handle all unhandled paths.
// For static file serving, remove this if you're relying on Vercel's static file serving.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});


// Export the app for Vercel
module.exports = app;

// Remove the app.listen part for Vercel deployment as Vercel handles the server.
// Keep it for local development if you have a separate file for running the server locally.
// app.listen(3000, () => {
//   console.log('✅ Servidor en http://localhost:3000');
// });