const express = require('express');
const path = require('path');
const bodyParser = require('express').urlencoded({ extended: true });

const app = express();
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
  // Verifica si se proporcionaron el nickname y el puntaje
  if (!nickname || !score) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  // Crea una entrada de puntaje con el nickname y el puntaje convertido a número
  const entrada = { nickname, score: Number(score) };
  // Agrega la entrada al array de puntajes correspondiente al juego
  if (game === 'game1') puntajesJuego1.push(entrada);
  else if (game === 'game2') puntajesJuego2.push(entrada);
  else if (game === 'game3') puntajesJuego3.push(entrada);
  else return res.status(404).json({ error: 'Juego no encontrado' }); // Si el juego no se encuentra
  res.json({ success: true }); // Responde con éxito
});

// Ajusta la ruta para el index.html si es necesario
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// ¡CRUCIAL! Exporta la aplicación para Vercel
module.exports = app;

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('✅ Servidor en http://localhost:3000');
});