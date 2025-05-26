import {
  showPanel,
  hidePanel,
  showScoreboard,
  sendScore,
  fetchScores,
  animateLogo,
} from "./shared.js";
import { verificarGanador, movimientoCpu } from "./game2Logic.js";

document.addEventListener("DOMContentLoaded", () => {
  // Asegura que el DOM esté completamente cargado antes de ejecutar el script.
  const contenidoPrincipal = document.getElementById("main-content"); // Obtiene una referencia al área de contenido principal en el HTML.

  // Panel 1: Formulario de Nickname
  const formularioNickname = document.createElement("form"); // Crea un nuevo elemento HTML <form> para la entrada del nickname.
  formularioNickname.id = "nickname-form"; // Establece el ID para el formulario de nickname.
  formularioNickname.className = "nickname-form show"; // Asigna clases CSS para estilizar y mostrar inicialmente el formulario.
  formularioNickname.autocomplete = "off"; // Deshabilita el autocompletado para el formulario.
  formularioNickname.innerHTML = `
    <div class="form-title">Enter your nickname</div>
    <div class="inputs-row" id="inputs-row"> 
      <div class="input-group" id="input-group-1"> 
        <label for="nickname-input-1" id="label-player1">Player 1</label> 
        <input type="text" id="nickname-input-1" maxlength="12" autocomplete="off" /> 
      </div>
      <div class="input-group" id="input-group-2"> 
        <label for="nickname-input-2" id="label-player2">Player 2</label> 
        <input type="text" id="nickname-input-2" maxlength="12" autocomplete="off" /> 
      </div>
    </div>
    <button id="start-btn" type="submit">Start Game</button> 
  `;

  // Panel 2: Juego
  const juegoTateti = document.createElement("div"); // Crea un nuevo elemento HTML <div> para el juego de Tic Tac Toe.
  juegoTateti.id = "tictac-game"; // Establece el ID para el panel del juego de Tic Tac Toe.
  juegoTateti.className = "tictac-panel hidden"; // Asigna clases CSS para estilizar y ocultar inicialmente el panel del juego.
  juegoTateti.innerHTML = `
    <div class="tictac-board" id="tictac-board">
      <button class="tictac-cell" data-cell="0"></button> 
      <button class="tictac-cell" data-cell="1"></button> 
      <button class="tictac-cell" data-cell="2"></button> 
      <button class="tictac-cell" data-cell="3"></button> 
      <button class="tictac-cell" data-cell="4"></button> 
      <button class="tictac-cell" data-cell="5"></button> 
      <button class="tictac-cell" data-cell="6"></button> 
      <button class="tictac-cell" data-cell="7"></button>
      <button class="tictac-cell" data-cell="8"></button> 
    </div>
    <div class="tictac-info"> 
      <div id="tictac-status"></div> 
      <div class="tictac-scores"> 
        <span id="score-p1">0</span> - <span id="score-p2">0</span> 
      </div>
      <div class="game-action-btns"> 
        <button id="next-round-btn" class="play-again-btn" style="display: none">Next Round</button> 
        <button id="end-game-btn" class="play-again-btn">End Game</button> 
      </div>
    </div>
  `;

  // Panel 3: Scoreboard
  const tablaPuntajes = document.createElement("div"); // Crea un nuevo elemento HTML <div> para el tablero de puntajes.
  tablaPuntajes.id = "scoreboard"; // Establece el ID para el panel del tablero de puntajes.
  tablaPuntajes.className = "scoreboard hidden"; // Asigna clases CSS para estilizar y ocultar inicialmente el tablero de puntajes.

  // Añadir paneles al DOM
  contenidoPrincipal.appendChild(formularioNickname); // Añade el formulario de nickname al contenido principal.
  contenidoPrincipal.appendChild(juegoTateti); // Añade el panel del juego de Tic Tac Toe al contenido principal.
  contenidoPrincipal.appendChild(tablaPuntajes); // Añade el panel del tablero de puntajes al contenido principal.

  // Referencias de elementos
  const entrada1 = formularioNickname.querySelector("#nickname-input-1"); // Obtiene una referencia a la entrada del nickname del Jugador 1.
  const entrada2 = formularioNickname.querySelector("#nickname-input-2"); // Obtiene una referencia a la entrada del nickname del Jugador 2.
  const etiqueta1 = formularioNickname.querySelector("#label-player1"); // Obtiene una referencia a la etiqueta del Jugador 1.
  const etiqueta2 = formularioNickname.querySelector("#label-player2"); // Obtiene una referencia a la etiqueta del Jugador 2.
  const grupoEntrada2 = formularioNickname.querySelector("#input-group-2"); // Obtiene una referencia al grupo de entrada para el Jugador 2.
  const botonInicio = formularioNickname.querySelector("#start-btn"); // Obtiene una referencia al botón de inicio del juego.
  const tableroTateti = juegoTateti.querySelector("#tictac-board"); // Obtiene una referencia al tablero de juego de Tic Tac Toe.
  const estadoTateti = juegoTateti.querySelector("#tictac-status"); // Obtiene una referencia a la visualización del estado del juego.
  const puntajeP1 = juegoTateti.querySelector("#score-p1"); // Obtiene una referencia a la visualización del puntaje del Jugador 1.
  const puntajeP2 = juegoTateti.querySelector("#score-p2"); // Obtiene una referencia a la visualización del puntaje del Jugador 2.
  const botonSiguienteRonda = juegoTateti.querySelector("#next-round-btn"); // Obtiene una referencia al botón "Next Round".
  const botonFinJuego = juegoTateti.querySelector("#end-game-btn"); // Obtiene una referencia al botón "End Game".

  const parametros = new URLSearchParams(window.location.search); // Crea un objeto URLSearchParams para analizar los parámetros de consulta de la URL.
  const modoJuego = parametros.get("mode") || "pve"; // Obtiene el parámetro de consulta 'mode', por defecto "pve" (Jugador contra Entorno/CPU) si no se encuentra.

  // Mostrar/ocultar segundo input y etiqueta según el modo
  if (modoJuego === "pvp") {
    // Comprueba si el modo de juego es "pvp" (Jugador contra Jugador).
    etiqueta1.textContent = "Player 1"; // Establece la etiqueta para el Jugador 1.
    etiqueta2.textContent = "Player 2"; // Establece la etiqueta para el Jugador 2.
    etiqueta2.style.display = ""; // Asegura que la etiqueta del Jugador 2 sea visible.
    entrada2.style.display = ""; // Asegura que el campo de entrada del Jugador 2 sea visible.
    grupoEntrada2.style.display = ""; // Asegura que el grupo de entrada del Jugador 2 sea visible.
    entrada2.required = true; // Hace que el campo de entrada del Jugador 2 sea obligatorio.
  } else {
    // Si el modo de juego no es "pvp" (es decir, "pve").
    etiqueta2.style.display = "none"; // Oculta la etiqueta del Jugador 2.
    entrada2.style.display = "none"; // Oculta el campo de entrada del Jugador 2.
    grupoEntrada2.style.display = "none"; // Oculta el grupo de entrada del Jugador 2.
    entrada2.required = false; // Hace que el campo de entrada del Jugador 2 no sea obligatorio.
  }

  function mostrarFormularioNickname() {
    // Define una función para mostrar el panel del formulario de nickname.
    showPanel(formularioNickname); // Llama a la función importada para mostrar el formulario de nickname.
    hidePanel(juegoTateti); // Llama a la función importada para ocultar el panel del juego de Tic Tac Toe.
    hidePanel(tablaPuntajes); // Llama a la función importada para ocultar el panel del tablero de puntajes.
  }
  mostrarFormularioNickname(); // Llama a la función para mostrar el formulario de nickname cuando se carga el script.

  let nombresJugadores = ["Player 1", "Player 2"]; // Array para almacenar los nombres de los jugadores.
  let puntajesJuego = [0, 0]; // Array para almacenar los puntajes del Jugador 1 y Jugador 2.
  let estadoTablero = Array(9).fill(""); // Array que representa el tablero de Tic Tac Toe, inicializado con cadenas vacías.
  let turnoActual = 0; // Variable para llevar la cuenta del turno actual (0 para Jugador 1, 1 para Jugador 2/CPU).
  let juegoEnCurso = false; // Bandera booleana que indica si el juego está actualmente activo.

  function reiniciarTablero() {
    // Define una función para reiniciar el tablero de juego para una nueva ronda.
    estadoTablero = Array(9).fill(""); // Reinicia el array del tablero a todas las cadenas vacías.
    Array.from(tableroTateti.children).forEach((celda) => {
      // Itera sobre cada celda (botón) en el tablero de juego.
      celda.textContent = ""; // Borra el contenido de texto de la celda (X u O).
      celda.disabled = false; // Habilita el botón de la celda.
    });
    estadoTateti.textContent = `Turn: ${nombresJugadores[turnoActual]}`; // Actualiza la visualización del estado del juego para mostrar de quién es el turno.
    botonSiguienteRonda.style.display = "none"; // Oculta el botón "Next Round".
    juegoEnCurso = true; // Establece la bandera 'juegoEnCurso' en true, indicando que el juego está activo.
    if (modoJuego === "pve" && turnoActual === 1) {
      // Si está en modo PVE y es el turno de la CPU.
      estadoTateti.textContent = `Turn: ${nombresJugadores[1]}`; // Actualiza el estado para mostrar que es el turno de la CPU.
      setTimeout(realizarMovimientoCpu, 600); // Llama a la función para el movimiento de la CPU después de un breve retraso.
    }
  }

  function realizarMovimientoCpu() {
    // Nueva función para encapsular la lógica del movimiento de la CPU
    if (!juegoEnCurso) return;
    const indice = movimientoCpu(estadoTablero); // Llama a la función importada
    if (indice !== null) {
      setTimeout(() => manejarClickCelda(indice, true), 400);
    }
  }

  function verificarGanador() {
    // Define una función para verificar si hay un ganador o un empate.
    const combinacionesVictoria = [
      // Define todas las combinaciones ganadoras posibles en el tablero de Tic Tac Toe.
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of combinacionesVictoria) {
      // Itera a través de cada combinación ganadora.
      if (
        estadoTablero[a] &&
        estadoTablero[a] === estadoTablero[b] &&
        estadoTablero[a] === estadoTablero[c]
      ) {
        // Comprueba si las tres celdas en una combinación no están vacías y tienen la misma marca.
        return estadoTablero[a]; // Devuelve la marca del jugador ganador ("X" u "O").
      }
    }
    if (estadoTablero.every((celda) => celda)) return "draw"; // Comprueba si todas las celdas están llenas (indicando un empate).
    return null; // Devuelve null si aún no hay ganador y no hay empate.
  }

  function manejarClickCelda(indice, esCpu = false) {
    // Define la función para manejar un clic en una celda de Tic Tac Toe.
    if (!juegoEnCurso || estadoTablero[indice]) return; // Si el juego no está activo o la celda ya está ocupada, sale.
    if (modoJuego === "pve" && turnoActual === 1 && !esCpu) return; // En modo PVE, si es el turno de la CPU y el movimiento no es de la CPU, sale.
    estadoTablero[indice] = turnoActual === 0 ? "X" : "O"; // Asigna "X" u "O" a la celda clicada según el turno actual.
    tableroTateti.children[indice].textContent = estadoTablero[indice]; // Actualiza el contenido de texto de la celda clicada en el tablero.
    tableroTateti.children[indice].disabled = true; // Deshabilita el botón de la celda clicada.
    const resultadoGanador = verificarGanador(); // Comprueba si hay un ganador después del movimiento.
    if (resultadoGanador) {
      // Si hay un ganador o un empate.
      juegoEnCurso = false; // Establece la bandera 'juegoEnCurso' en false, terminando el juego actual.
      if (resultadoGanador === "draw") {
        // Si es un empate.
        estadoTateti.textContent = "Draw!"; // Actualiza el mensaje de estado a "Draw!".
      } else {
        // Si hay un ganador.
        const indiceGanador = resultadoGanador === "X" ? 0 : 1; // Determina el índice del jugador ganador.
        puntajesJuego[indiceGanador]++; // Incrementa el puntaje del ganador.
        estadoTateti.textContent = `Winner: ${nombresJugadores[indiceGanador]}`; // Actualiza el mensaje de estado para mostrar al ganador.
      }
      puntajeP1.textContent = puntajesJuego[0]; // Actualiza la visualización del puntaje del Jugador 1.
      puntajeP2.textContent = puntajesJuego[1]; // Actualiza la visualización del puntaje del Jugador 2.
      botonSiguienteRonda.style.display = ""; // Muestra el botón "Next Round".
    } else {
      // Si aún no hay ganador.
      turnoActual = 1 - turnoActual; // Cambia el turno al otro jugador.
      estadoTateti.textContent = `Turn: ${nombresJugadores[turnoActual]}${
        // Actualiza el mensaje de estado para mostrar de quién es el turno.
        modoJuego === "pve" && turnoActual === 1 ? "" : "" // No hay texto extra para el turno de la CPU.
      }`;
      if (modoJuego === "pve" && turnoActual === 1) realizarMovimientoCpu(); // Modificado para usar la nueva función
    }
  }

  Array.from(tableroTateti.children).forEach((celda, indice) => {
    // Itera sobre cada celda (botón) en el tablero de Tic Tac Toe.
    celda.addEventListener("click", () => manejarClickCelda(indice)); // Agrega un listener de evento de clic a cada celda para manejar los movimientos.
  });

  formularioNickname.addEventListener("submit", (evento) => {
    // Agrega un listener de evento de envío al formulario de nickname.
    evento.preventDefault(); // Previene el comportamiento predeterminado de envío del formulario (recarga de la página).
    if (
      // Comprueba si las entradas de nickname están vacías.
      entrada1.value.trim() === "" || // Comprueba si el nickname del Jugador 1 está vacío.
      (modoJuego === "pvp" && entrada2.value.trim() === "") // En modo PVP, comprueba si el nickname del Jugador 2 está vacío.
    ) {
      formularioNickname.classList.add("shake"); // Agrega una clase "shake" para retroalimentación visual en caso de entrada inválida.
      setTimeout(() => formularioNickname.classList.remove("shake"), 400); // Elimina la clase "shake" después de un breve retraso.
      return; // Sale de la función.
    }
    nombresJugadores[0] = entrada1.value.trim() || "Player 1"; // Establece el nombre del Jugador 1, por defecto "Player 1" si la entrada está vacía.
    nombresJugadores[1] =
      modoJuego === "pvp" ? entrada2.value.trim() || "Player 2" : "CPU"; // Establece el nombre del Jugador 2 (o "CPU" en modo PVE).
    puntajesJuego = [0, 0]; // Reinicia los puntajes para un nuevo juego.
    puntajeP1.textContent = puntajesJuego[0]; // Actualiza la visualización del puntaje del Jugador 1.
    puntajeP2.textContent = puntajesJuego[1]; // Actualiza la visualización del puntaje del Jugador 2.
    turnoActual = 0; // Establece el turno al Jugador 1 (índice 0).
    hidePanel(formularioNickname); // Oculta el formulario de nickname.
    showPanel(juegoTateti); // Muestra el panel del juego de Tic Tac Toe.
    hidePanel(tablaPuntajes); // Oculta el tablero de puntajes.
    reiniciarTablero(); // Reinicia el tablero de juego e inicia la primera ronda.
  });

  entrada1.addEventListener("keydown", (evento) => {
    // Agrega un listener de evento de teclado a la entrada del nickname del Jugador 1.
    if (evento.key === "Enter") botonInicio.click(); // Si se presiona 'Enter', simula un clic en el botón de inicio.
  });

  entrada2.addEventListener("keydown", (evento) => {
    // Agrega un listener de evento de teclado a la entrada del nickname del Jugador 2.
    if (evento.key === "Enter") botonInicio.click(); // Si se presiona 'Enter', simula un clic en el botón de inicio.
  });

  botonSiguienteRonda.addEventListener("click", () => {
    // Agrega un listener de evento de clic al botón "Next Round".
    turnoActual = 0; // Reinicia el turno al Jugador 1.
    reiniciarTablero(); // Reinicia el tablero de juego para una nueva ronda.
  });

  botonFinJuego.addEventListener("click", () => {
    // Agrega un listener de evento de clic al botón "End Game".
    hidePanel(juegoTateti); // Oculta el panel del juego de Tic Tac Toe.
    let ganadorFinal =
      // Determina el ganador final basándose en los puntajes acumulados.
      puntajesJuego[0] > puntajesJuego[1] // Si el puntaje del Jugador 1 es mayor.
        ? nombresJugadores[0] // El Jugador 1 es el ganador.
        : puntajesJuego[1] > puntajesJuego[0] // Sino, si el puntaje del Jugador 2 es mayor.
        ? nombresJugadores[1] // El Jugador 2 es el ganador.
        : "Draw"; // De lo contrario, es un empate.
    let puntajeGanador = Math.max(puntajesJuego[0], puntajesJuego[1]); // Obtiene el puntaje más alto.
    if (ganadorFinal !== "Draw" && puntajeGanador > 0) {
      // Si hay un ganador claro y un puntaje positivo.
      sendScore("/data/game2", ganadorFinal, puntajeGanador).then(() => {
        // Envía el puntaje del ganador al servidor para el juego 2.
        fetchScores(
          // Después de enviar, obtiene los puntajes actualizados para el juego 2.
          "/data/game2", // Endpoint para los puntajes del juego 2.
          (datos) =>
            showScoreboard(tablaPuntajes, datos, ganadorFinal, puntajeGanador), // Callback para mostrar el tablero de puntajes.
          ganadorFinal, // Nombre del ganador.
          puntajeGanador // Puntaje del ganador.
        );
      });
    } else {
      // Si es un empate o nadie anotó.
      showScoreboard(tablaPuntajes, [], "", 0); // Muestra un tablero de puntajes vacío.
    }
  });

  animateLogo(document.getElementById("arcadeLogo")); // Llama a la función para animar el logo de arcade.
}); // Fin del listener de evento DOMContentLoaded.
