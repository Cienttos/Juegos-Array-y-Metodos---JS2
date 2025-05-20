const express = require('express');
const path = require('path');
const bodyParser = require('express').urlencoded({ extended: true });

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/select-mode', (req, res) => {
  const data = req.body;
  console.log('🕹️ Game Mode Selected:', data);

  // Guardar los datos en archivo o memoria temporal
  // Aquí por ahora solo redireccionamos según el modo
  if (data.mode === 'vsIA') {
    // Redirigir a selección de juego para 1 jugador
    res.redirect('/pages/game1.html'); // Podés cambiarlo después
  } else if (data.mode === 'vs1') {
    res.redirect('/pages/game2.html');
  } else {
    res.redirect('/');
  }
});

app.listen(3000, () => {
  console.log('✅ Servidor en http://localhost:3000');
});
