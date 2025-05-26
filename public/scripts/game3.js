import {
  showPanel, // Importa la función para mostrar un panel.
  hidePanel, // Importa la función para ocultar un panel.
  showScoreboard, // Importa la función para mostrar el tablero de puntajes.
  sendScore, // Importa la función para enviar un puntaje al servidor.
  fetchScores, // Importa la función para obtener puntajes del servidor.
  animateLogo, // Importa la función para animar el logo.
} from "./shared.js"; // Importa funciones desde el módulo 'shared.js'.

document.addEventListener("DOMContentLoaded", () => {
  // Asegura que el DOM (Document Object Model) esté completamente cargado antes de ejecutar el script.
  const contenidoPrincipal = document.getElementById("main-content"); // Obtiene una referencia al área de contenido principal en el HTML.

  // Panel 1: Formulario de Nickname
  const formularioNickname = document.createElement("form"); // Crea un nuevo elemento HTML <form> para la entrada del nickname.
  formularioNickname.id = "nickname-form"; // Establece el ID para el formulario de nickname.
  formularioNickname.className = "nickname-form show"; // Asigna clases CSS para estilizar y mostrar inicialmente el formulario.
  formularioNickname.autocomplete = "off"; // Deshabilita el autocompletado para el formulario.
  formularioNickname.innerHTML = `
    <div class="form-title">Enter your nickname</div>
    <div class="inputs-row"> 
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

  // Panel 3: Tablero de puntajes (siempre se renderiza)
  const tablaPuntajes = document.createElement("div"); // Crea un nuevo elemento HTML <div> para el tablero de puntajes.
  tablaPuntajes.id = "scoreboard"; // Establece el ID para el panel del tablero de puntajes.
  tablaPuntajes.className = "scoreboard hidden"; // Asigna clases CSS para estilizar y ocultar inicialmente el tablero de puntajes.

  contenidoPrincipal.appendChild(formularioNickname); // Añade el formulario de nickname al contenido principal.
  contenidoPrincipal.appendChild(tablaPuntajes); // Añade el panel del tablero de puntajes al contenido principal.

  const entrada1 = formularioNickname.querySelector("#nickname-input-1"); // Obtiene una referencia a la entrada del nickname del Jugador 1.
  const etiqueta2 = formularioNickname.querySelector("#label-player2"); // Obtiene una referencia a la etiqueta del Jugador 2.
  const grupoEntrada2 = formularioNickname.querySelector("#input-group-2"); // Obtiene una referencia al grupo de entrada para el Jugador 2.
  const entrada2 = formularioNickname.querySelector("#nickname-input-2"); // Obtiene una referencia a la entrada del nickname del Jugador 2.
  const botonInicio = formularioNickname.querySelector("#start-btn"); // Obtiene una referencia al botón de inicio del juego.

  const parametros = new URLSearchParams(window.location.search); // Crea un objeto URLSearchParams para analizar los parámetros de consulta de la URL.
  const modoJuego = parametros.get("mode") || "pve"; // Obtiene el parámetro de consulta 'mode', por defecto "pve" (Jugador contra Entorno/CPU) si no se encuentra.

  // Mostrar/ocultar segunda entrada y etiqueta según el modo
  if (modoJuego === "pvp") {
    // Comprueba si el modo de juego es "pvp" (Jugador contra Jugador).
    etiqueta2.textContent = "Player 2"; // Establece la etiqueta para el Jugador 2.
    grupoEntrada2.style.display = ""; // Asegura que el grupo de entrada del Jugador 2 sea visible.
    entrada2.required = true; // Hace que el campo de entrada del Jugador 2 sea obligatorio.
  } else {
    // Si el modo de juego no es "pvp" (es decir, "pve").
    etiqueta2.textContent = "Player 2"; // Establece la etiqueta para el Jugador 2 (incluso si está oculto).
    grupoEntrada2.style.display = "none"; // Oculta el grupo de entrada del Jugador 2.
    entrada2.required = false; // Hace que el campo de entrada del Jugador 2 no sea obligatorio.
  }

  let nombresJugadores = ["Player 1", "Player 2"]; // Array para almacenar los nombres de los jugadores.
  let puntajesJuego = [0, 0]; // Array para almacenar los puntajes del Jugador 1 y Jugador 2.
  let eleccionesJugadores = [null, null]; // Array para almacenar las elecciones (piedra, papel, tijera) de cada jugador.
  let turnoActual = 0; // Variable para llevar la cuenta del turno actual (0: Jugador 1, 1: Jugador 2).

  // Panel 2: Juego (solo se renderiza después de establecer los nombres)
  let juegoPiedraPapelTijera = null; // Variable para mantener la referencia al panel del juego, inicialmente nula.
  let tituloPpt, estadoPpt, resultadoPpt, puntajeP1Elemento, puntajeP2Elemento, botonSiguienteRonda, botonTerminarJuego, cartasPpt; // Declara variables para los elementos del juego.

  function renderizarPanelJuego() {
    // Define una función para renderizar el panel del juego dinámicamente.
    // Estructura simplificada del panel del juego
    juegoPiedraPapelTijera = document.createElement("div"); // Crea un nuevo elemento HTML <div> para el juego de Piedra, Papel o Tijera.
    juegoPiedraPapelTijera.id = "rps-game"; // Establece el ID para el panel del juego de Piedra, Papel o Tijera.
    juegoPiedraPapelTijera.className = "rps-panel hidden"; // Asigna clases CSS para estilizar y ocultar inicialmente el panel del juego.
    juegoPiedraPapelTijera.innerHTML = `
      <div class="rps-scores"><span id="score-p1">0</span> - <span id="score-p2">0</span></div>
      <div class="rps-cards" id="rps-cards">
        <button class="rps-card" data-choice="rock">Rock</button> 
        <button class="rps-card" data-choice="paper">Paper</button> 
        <button class="rps-card" data-choice="scissors">Scissors</button> 
      </div>
      <div class="rps-status-group"> 
        <div class="rps-status" id="rps-status">Turn</div> 
        <div class="rps-result" id="rps-result"></div> 
      </div>

      <div class="game-action-btns" style="display: none;"> 
        <button id="next-round-btn" class="play-again-btn">Next Round</button> 
        <button id="end-game-btn" class="play-again-btn">End Game</button> 
      </div>
    `;
    contenidoPrincipal.insertBefore(juegoPiedraPapelTijera, tablaPuntajes); // Inserta el panel del juego antes del tablero de puntajes en el DOM.

    estadoPpt = juegoPiedraPapelTijera.querySelector("#rps-status"); // Obtiene una referencia a la visualización del estado del juego.
    resultadoPpt = juegoPiedraPapelTijera.querySelector("#rps-result"); // Obtiene una referencia a la visualización del resultado de la ronda.
    puntajeP1Elemento = juegoPiedraPapelTijera.querySelector("#score-p1"); // Obtiene una referencia a la visualización del puntaje del Jugador 1.
    puntajeP2Elemento = juegoPiedraPapelTijera.querySelector("#score-p2"); // Obtiene una referencia a la visualización del puntaje del Jugador 2.
    botonSiguienteRonda = juegoPiedraPapelTijera.querySelector("#next-round-btn"); // Obtiene una referencia al botón "Next Round".
    botonTerminarJuego = juegoPiedraPapelTijera.querySelector("#end-game-btn"); // Obtiene una referencia al botón "End Game".
    cartasPpt = Array.from(juegoPiedraPapelTijera.querySelectorAll(".rps-card")); // Obtiene una colección de todos los botones de elección de Piedra, Papel o Tijera y los convierte en un array.

    cartasPpt.forEach((boton) => {
      // Itera sobre cada botón de elección de Piedra, Papel o Tijera.
      boton.addEventListener("click", () => {
        // Agrega un listener de evento de clic a cada botón.
        if (modoJuego === "pve" && eleccionesJugadores[0] === null) {
          // Si está en modo PVE y el Jugador 1 aún no ha hecho una elección.
          manejarEleccion(boton.dataset.choice); // Maneja la elección del jugador.
        } else if (modoJuego === "pvp" && eleccionesJugadores[turnoActual] === null) {
          // Si está en modo PVP y el jugador actual aún no ha hecho una elección.
          manejarEleccion(boton.dataset.choice); // Maneja la elección del jugador actual.
        }
      });
    });

    botonSiguienteRonda.addEventListener("click", () => {
      // Agrega un listener de evento de clic al botón "Next Round".
      reiniciarRonda(); // Reinicia la ronda para un nuevo juego.
      cartasPpt.forEach((boton) => (boton.disabled = false)); // Habilita todos los botones de elección de Piedra, Papel o Tijera.
    });

    botonTerminarJuego.addEventListener("click", () => {
      // Agrega un listener de evento de clic al botón "End Game".
      hidePanel(juegoPiedraPapelTijera); // Oculta el panel del juego de Piedra, Papel o Tijera.
      let indiceGanador =
        // Determina el índice del ganador general basándose en los puntajes acumulados.
        puntajesJuego[0] > puntajesJuego[1] ? 0 : puntajesJuego[1] > puntajesJuego[0] ? 1 : -1; // -1 si es un empate.
      if (indiceGanador >= 0) {
        // Si hay un ganador (no es un empate).
        sendScore("/data/game3", nombresJugadores[indiceGanador], puntajesJuego[indiceGanador]).then(
          // Envía el puntaje del ganador al servidor para el juego 3.
          () => {
            // Después de enviar el puntaje.
            fetchScores(
              // Obtiene los puntajes actualizados para el juego 3.
              "/data/game3", // Endpoint para los puntajes del juego 3.
              (datos) =>
                showScoreboard(
                  // Función de callback para mostrar el tablero de puntajes.
                  tablaPuntajes, // El elemento del panel del tablero de puntajes.
                  datos, // Los datos de puntaje obtenidos.
                  nombresJugadores[indiceGanador], // El nombre del ganador.
                  puntajesJuego[indiceGanador] // El puntaje del ganador.
                ),
              nombresJugadores[indiceGanador], // Pasa el nombre del ganador a fetchScores.
              puntajesJuego[indiceGanador] // Pasa el puntaje del ganador a fetchScores.
            );
          }
        );
      } else {
        // Si es un empate.
        showScoreboard(tablaPuntajes, [], "", 0); // Muestra un tablero de puntajes vacío.
      }
      showPanel(tablaPuntajes); // Muestra el panel del tablero de puntajes.
      hidePanel(juegoPiedraPapelTijera); // Oculta el panel del juego de Piedra, Papel o Tijera.
      hidePanel(formularioNickname); // Oculta el formulario de nickname.
    });
  }

  function reiniciarRonda() {
    // Define una función para reiniciar la ronda para un nuevo juego.
    eleccionesJugadores = [null, null]; // Reinicia las elecciones de los jugadores a nulo.
    turnoActual = 0; // Establece el turno de nuevo al Jugador 1.

    // Restaura las cartas originales
    const contenedorCartas = juegoPiedraPapelTijera.querySelector("#rps-cards"); // Obtiene una referencia al contenedor de las cartas de Piedra, Papel o Tijera.
    contenedorCartas.innerHTML = `
      <button class="rps-card" data-choice="rock">Rock</button> 
      <button class="rps-card" data-choice="paper">Paper</button> 
      <button class="rps-card" data-choice="scissors">Scissors</button> 
    `; // Vuelve a renderizar los botones de elección originales.

    // Vuelve a asignar los listeners de eventos
    cartasPpt = Array.from(contenedorCartas.querySelectorAll(".rps-card")); // Vuelve a obtener las referencias a los nuevos botones.
    cartasPpt.forEach((boton) => {
      // Itera sobre cada nuevo botón de elección de Piedra, Papel o Tijera.
      boton.addEventListener("click", () => {
        // Agrega un listener de evento de clic.
        if (modoJuego === "pve" && eleccionesJugadores[0] === null) {
          // Si está en modo PVE y el Jugador 1 aún no ha hecho una elección.
          manejarEleccion(boton.dataset.choice); // Maneja la elección del jugador.
        } else if (modoJuego === "pvp" && eleccionesJugadores[turnoActual] === null) {
          // Si está en modo PVP y el jugador actual aún no ha hecho una elección.
          manejarEleccion(boton.dataset.choice); // Maneja la elección del jugador actual.
        }
      });
    });

    // Solo muestra "Turn" y el nombre del jugador
    if (modoJuego === "pvp") {
      // Si está en modo PVP.
      estadoPpt.textContent = "Turn"; // Establece el texto de estado en "Turn".
      resultadoPpt.textContent = nombresJugadores[turnoActual]; // Muestra el nombre del jugador actual.
    } else {
      // Si está en modo PVE.
      estadoPpt.textContent = "Turn"; // Establece el texto de estado en "Turn".
      resultadoPpt.textContent = nombresJugadores[0]; // Muestra el nombre del Jugador 1 (el jugador humano).
    }

    // Oculta los botones durante el juego
    const botonesAccion = juegoPiedraPapelTijera.querySelector(".game-action-btns"); // Obtiene una referencia al contenedor de los botones de acción.
    botonesAccion.style.display = "none"; // Oculta los botones de acción.
  }

  function manejarEleccion(eleccion) {
    // Define una función para manejar la elección de un jugador.
    if (modoJuego === "pve") {
      // Si está en modo PVE.
      eleccionesJugadores[0] = eleccion; // Almacena la elección del Jugador 1.
      // CPU aleatoria
      const eleccionesCpu = ["rock", "paper", "scissors"]; // Define las posibles elecciones para la CPU.
      eleccionesJugadores[1] = eleccionesCpu[Math.floor(Math.random() * 3)]; // La CPU hace una elección aleatoria.
      setTimeout(() => {
        // Establece un timeout para mostrar el resultado después de un breve retraso.
        mostrarResultado(); // Llama a la función para mostrar el resultado de la ronda.
      }, 800); // Retraso de 800ms.
    } else {
      // Si está en modo PVP.
      eleccionesJugadores[turnoActual] = eleccion; // Almacena la elección del jugador actual.
      if (turnoActual === 0) {
        // Si fue el turno del Jugador 1.
        turnoActual = 1; // Cambia al turno del Jugador 2.
        estadoPpt.textContent = "Turn"; // Actualiza el texto de estado a "Turn".
        resultadoPpt.textContent = nombresJugadores[1]; // Muestra el nombre del Jugador 2.
      } else {
        // Si fue el turno del Jugador 2.
        mostrarResultado(); // Llama a la función para mostrar el resultado de la ronda.
      }
    }
  }

  function mostrarResultado() {
    // Define una función para mostrar el resultado de la ronda.
    const [eleccionP1, eleccionP2] = eleccionesJugadores; // Desestructura las elecciones del Jugador 1 y Jugador 2.

    // Muestra las cartas de resultado
    const contenedorCartas = juegoPiedraPapelTijera.querySelector("#rps-cards"); // Obtiene una referencia al contenedor de las cartas de Piedra, Papel o Tijera.
    contenedorCartas.innerHTML = `
      <div class="rps-card result-card">${capitalizar(eleccionP1)}</div> 
      <div class="rps-card vs-card">Vs</div>
      <div class="rps-card result-card">${capitalizar(eleccionP2)}</div> 
    `; // Renderiza las cartas de resultado.

    // Determina el resultado
    let ganadorRonda = ""; // Variable para almacenar el nombre del ganador de la ronda.
    if (eleccionP1 === eleccionP2) {
      // Si ambos jugadores eligieron lo mismo.
      estadoPpt.textContent = "Draw"; // Establece el texto de estado en "Draw".
      resultadoPpt.textContent = "Nobody wins!"; // Muestra "Nobody wins!".
    } else if (
      // Comprueba las condiciones de victoria del Jugador 1.
      (eleccionP1 === "rock" && eleccionP2 === "scissors") || // Piedra vence a Tijera.
      (eleccionP1 === "paper" && eleccionP2 === "rock") || // Papel vence a Piedra.
      (eleccionP1 === "scissors" && eleccionP2 === "paper") // Tijera vence a Papel.
    ) {
      puntajesJuego[0]++; // Incrementa el puntaje del Jugador 1.
      ganadorRonda = nombresJugadores[0]; // Establece el ganador como el nombre del Jugador 1.
      estadoPpt.textContent = "Winner"; // Establece el texto de estado en "Winner".
      resultadoPpt.textContent = ganadorRonda; // Muestra el nombre del ganador.
    } else {
      // Si el Jugador 2 (o CPU) gana.
      puntajesJuego[1]++; // Incrementa el puntaje del Jugador 2 (o CPU).
      ganadorRonda = nombresJugadores[1]; // Establece el ganador como el nombre del Jugador 2 (o CPU).
      estadoPpt.textContent = "Winner"; // Establece el texto de estado en "Winner".
      resultadoPpt.textContent = ganadorRonda; // Muestra el nombre del ganador.
    }

    // Actualiza el tablero de puntajes
    puntajeP1Elemento.textContent = puntajesJuego[0]; // Actualiza la visualización del puntaje del Jugador 1.
    puntajeP2Elemento.textContent = puntajesJuego[1]; // Actualiza la visualización del puntaje del Jugador 2 (o CPU).

    // Muestra los botones al final
    const botonesAccion = juegoPiedraPapelTijera.querySelector(".game-action-btns"); // Obtiene una referencia al contenedor de los botones de acción.
    botonesAccion.style.display = "flex"; // Muestra los botones de acción (Next Round, End Game).
  }

  function capitalizar(cadena) {
    // Define una función de utilidad para capitalizar la primera letra de una cadena.
    return cadena.charAt(0).toUpperCase() + cadena.slice(1); // Devuelve la cadena capitalizada.
  }

  botonInicio.addEventListener("click", (evento) => {
    // Agrega un listener de evento de clic al botón "Start Game".
    evento.preventDefault(); // Previene el comportamiento predeterminado de envío del formulario (recarga de la página).
    if (!entrada1.value.trim() || (modoJuego === "pvp" && !entrada2.value.trim())) {
      // Comprueba si las entradas de nickname están vacías, especialmente para el modo PVP.
      formularioNickname.classList.add("shake"); // Agrega una clase "shake" para retroalimentación visual en caso de entrada inválida.
      setTimeout(() => formularioNickname.classList.remove("shake"), 400); // Elimina la clase "shake" después de un breve retraso.
      return; // Sale de la función.
    }
    nombresJugadores[0] = entrada1.value.trim(); // Establece el nombre del Jugador 1 desde la entrada.
    nombresJugadores[1] = modoJuego === "pvp" ? entrada2.value.trim() : "CPU"; // Establece el nombre del Jugador 2 desde la entrada o "CPU".
    puntajesJuego = [0, 0]; // Reinicia los puntajes para un nuevo juego.
    // Renderiza el panel del juego solo después de que se establecen los nombres
    if (!juegoPiedraPapelTijera) renderizarPanelJuego(); // Si el panel del juego no ha sido renderizado, llama a la función para renderizarlo.
    puntajeP1Elemento.textContent = "0"; // Actualiza la visualización del puntaje del Jugador 1 a 0.
    puntajeP2Elemento.textContent = "0"; // Actualiza la visualización del puntaje del Jugador 2 a 0.
    hidePanel(formularioNickname); // Oculta el formulario de nickname.
    hidePanel(tablaPuntajes); // Oculta el tablero de puntajes.
    showPanel(juegoPiedraPapelTijera); // Muestra el panel del juego de Piedra, Papel o Tijera.
    reiniciarRonda(); // Reinicia e inicia una nueva ronda del juego.
  });

  // Inicial: solo el formulario de nickname visible
  showPanel(formularioNickname); // Muestra el formulario de nickname inicialmente.
  hidePanel(tablaPuntajes); // Oculta el tablero de puntajes inicialmente.

  animateLogo(document.getElementById("arcadeLogo")); // Llama a la función para animar el logo de arcade.
}); // Fin del listener de evento DOMContentLoaded.