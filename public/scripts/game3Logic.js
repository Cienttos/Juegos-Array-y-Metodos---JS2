export function determinarGanador(eleccionP1, eleccionP2) {
  // Define la función determinarGanador que determina el ganador de una ronda de piedra, papel o tijera.
  if (eleccionP1 === eleccionP2) {
    // Comprueba si ambos jugadores eligieron la misma opción.
    return "draw"; // Retorna "draw" si es un empate.
  } else if (
    (eleccionP1 === "rock" && eleccionP2 === "scissors") ||
    (eleccionP1 === "paper" && eleccionP2 === "rock") ||
    (eleccionP1 === "scissors" && eleccionP2 === "paper")
  ) {
    // Comprueba todas las combinaciones en las que el jugador 1 gana.
    return "player1"; // Retorna "player1" si el jugador 1 gana.
  } else {
    // Si no es empate y el jugador 1 no gana, entonces el jugador 2 gana.
    return "player2"; // Retorna "player2" si el jugador 2 gana.
  }
}

export function obtenerEleccionCpu() {
  // Define la función obtenerEleccionCpu que genera una elección aleatoria para la CPU.
  const eleccionesCpu = ["rock", "paper", "scissors"]; // Define un array con las posibles elecciones de la CPU.
  return eleccionesCpu[Math.floor(Math.random() * 3)]; // Retorna una elección aleatoria del array.
}