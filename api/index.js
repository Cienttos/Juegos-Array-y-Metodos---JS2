const express = require('express');
const path = require('path');
const cors = require('cors'); // 👈 Importa cors
const bodyParser = require('express').urlencoded({ extended: true });

const app = express();

// 👇 Habilita CORS para todos los orígenes
app.use(cors());

// Ajusta la ruta para apuntar a la carpeta 'public' que está un nivel arriba
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser);
app.use(express.json()); // Asegúrate de tener esto para JSON bodies

// Arrays para almacenar los puntajes de cada juego
const puntajesJuego1 = [];
const puntajesJuego2 = [];
const puntajesJuego3 = [];

// Ruta para obtener los puntajes de un juego específico
app.get('/data/:game', (req, res) => {
  const { game } = req.params;
  if (game === 'game1') return res.json(puntajesJuego1);
  if (game === 'game2') return res.json(puntajesJuego2);
  if (game === 'game3') return res.json(puntajesJuego3);
  res.status(404).json({ error: 'Juego no encontrado' });
});

// Ruta para enviar (POST) un nuevo puntaje a un juego específico
app.post('/data/:game', (req, res) => {
  const { game } = req.params;
  const { nickname, score } = req.body;
  if (!nickname || !score) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  const entrada = { nickname, score: Number(score) };
  if (game === 'game1') puntajesJuego1.push(entrada);
  else if (game === 'game2') puntajesJuego2.push(entrada);
  else if (game === 'game3') puntajesJuego3.push(entrada);
  else return res.status(404).json({ error: 'Juego no encontrado' });
  res.json({ success: true });
});

// Ruta para servir el index.html si es necesario
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Exporta la app para Vercel
module.exports = app;

// Solo necesario si ejecutás localmente
app.listen(3000, () => {
  console.log('✅ Servidor en http://localhost:3000');
});
