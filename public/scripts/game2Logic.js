// Función para verificar si hay un ganador en el tablero
export function verificarGanador(estadoTablero) {
  // Definir las combinaciones ganadoras posibles
  const combinacionesVictoria = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
    [0, 4, 8], [2, 4, 6]  // Diagonales
  ];

  // Revisar cada combinación ganadora
  for (const combinacion of combinacionesVictoria) {
    const [a, b, c] = combinacion; // Obtener los índices de la combinación

    // Verificar si las celdas en la combinación tienen el mismo valor (X u O)
    if (estadoTablero[a] && estadoTablero[a] === estadoTablero[b] && estadoTablero[a] === estadoTablero[c]) {
      return estadoTablero[a]; // Retornar el valor del ganador (X u O)
    }
  }

  // Si todas las celdas están llenas y no hay ganador, es un empate
  if (estadoTablero.every(celda => celda)) {
    return "draw"; // Retornar "draw" para indicar un empate
  }

  // Si no hay ganador ni empate, retornar null
  return null;
}

// Función para determinar el movimiento de la CPU
export function movimientoCpu(estadoTablero, jugador = "O") {
  // Primero, intentar ganar
  let movimiento = obtenerMovimientoGanador(estadoTablero, jugador);
  if (movimiento !== null) {
    return movimiento; // Retornar el movimiento ganador si existe
  }

  // Si no se puede ganar, intentar bloquear al oponente
  movimiento = obtenerMovimientoBloqueo(estadoTablero, jugador);
  if (movimiento !== null) {
    return movimiento; // Retornar el movimiento de bloqueo si existe
  }

  // Si no hay movimientos estratégicos, intentar tomar el centro
  if (!estadoTablero[4]) {
    return 4; // Retornar el centro si está disponible
  }

  // Si el centro no está disponible, intentar tomar una esquina
  movimiento = obtenerEsquinaDisponible(estadoTablero);
  if (movimiento !== null) {
    return movimiento; // Retornar una esquina disponible si existe
  }

  // Si no hay esquinas disponibles, tomar cualquier celda vacía
  return obtenerMovimientoAleatorio(estadoTablero);
}

// Función para obtener un movimiento que resulte en una victoria
function obtenerMovimientoGanador(estadoTablero, jugador) {
  for (let i = 0; i < 9; i++) {
    if (!estadoTablero[i]) { // Si la celda está vacía
      const tableroSimulado = [...estadoTablero]; // Simular el movimiento
      tableroSimulado[i] = jugador; // Colocar la marca del jugador en la celda
      if (verificarGanador(tableroSimulado) === jugador) { // Verificar si el movimiento resulta en una victoria
        return i; // Retornar el índice de la celda
      }
    }
  }
  return null; // Si no hay movimientos ganadores, retornar null
}

// Función para obtener un movimiento que bloquee al oponente
function obtenerMovimientoBloqueo(estadoTablero, jugador) {
  const oponente = jugador === "O" ? "X" : "O"; // Determinar el oponente

  for (let i = 0; i < 9; i++) {
    if (!estadoTablero[i]) { // Si la celda está vacía
      const tableroSimulado = [...estadoTablero]; // Simular el movimiento
      tableroSimulado[i] = oponente; // Colocar la marca del oponente en la celda
      if (verificarGanador(tableroSimulado) === oponente) { // Verificar si el movimiento resulta en una victoria para el oponente
        return i; // Retornar el índice de la celda para bloquear al oponente
      }
    }
  }
  return null; // Si no hay movimientos de bloqueo, retornar null
}

// Función para obtener una esquina disponible
function obtenerEsquinaDisponible(estadoTablero) {
  const esquinas = [0, 2, 6, 8]; // Índices de las esquinas
  for (const esquina of esquinas) { // Revisar cada esquina
    if (!estadoTablero[esquina]) { // Si la esquina está vacía
      return esquina; // Retornar el índice de la esquina
    }
  }
  return null; // Si no hay esquinas disponibles, retornar null
}

// Función para obtener un movimiento aleatorio en una celda vacía
function obtenerMovimientoAleatorio(estadoTablero) {
  const celdasVacias = estadoTablero
    .map((valor, indice) => (valor ? null : indice)) // Mapear cada celda a su índice si está vacía
    .filter(indice => indice !== null); // Filtrar los índices no nulos (celdas vacías)

  if (celdasVacias.length > 0) { // Si hay celdas vacías
    const indiceAleatorio = celdasVacias[Math.floor(Math.random() * celdasVacias.length)]; // Seleccionar un índice aleatorio
    return indiceAleatorio; // Retornar el índice aleatorio
  }

  return null; // Si no hay celdas vacías, retornar null
}