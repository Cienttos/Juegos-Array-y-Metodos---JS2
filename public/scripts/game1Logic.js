const CARACTERES = ["Ж", "Я", "Ф", "Ю", "Б", "Э"]; // Define un array de caracteres que se utilizarán en la secuencia del juego.

export function iniciarSimon() {
  // Define la función iniciarSimon que inicializa el estado del juego.
  return {
    // Retorna un objeto con las propiedades iniciales del juego.
    secuencia: [], // Inicializa la secuencia del juego como un array vacío.
    secuenciaUsuario: [], // Inicializa la secuencia del usuario como un array vacío.
    puntaje: 0, // Inicializa el puntaje del jugador en 0.
    aceptandoEntrada: false, // Inicializa la variable que indica si se acepta la entrada del usuario en falso.
  };
}

export function siguienteRonda(secuencia) {
  // Define la función siguienteRonda que agrega un nuevo carácter a la secuencia del juego.
  const nuevoCaracter =
    CARACTERES[Math.floor(Math.random() * CARACTERES.length)]; // Selecciona un carácter aleatorio del array CARACTERES.
  secuencia.push(nuevoCaracter); // Agrega el nuevo carácter a la secuencia del juego.
  return secuencia; // Retorna la secuencia actualizada.
}

export function verificarEntradaUsuario(secuenciaUsuario, secuencia) {
  // Define la función verificarEntradaUsuario que verifica si la entrada del usuario coincide con la secuencia del juego.
  const idx = secuenciaUsuario.length - 1; // Obtiene el índice del último carácter ingresado por el usuario.
  if (secuenciaUsuario[idx] !== secuencia[idx]) {
    // Compara el último carácter ingresado por el usuario con el carácter correspondiente en la secuencia del juego.
    return false; // Indica que el juego debe terminar si los caracteres no coinciden.
  }
  if (secuenciaUsuario.length === secuencia.length) {
    // Verifica si el usuario ha ingresado todos los caracteres de la secuencia.
    return true; // Indica que la ronda se ha completado si el usuario ha ingresado todos los caracteres correctamente.
  }
  return null; // Indica que el juego debe continuar si el usuario aún no ha ingresado todos los caracteres.
}