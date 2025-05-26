import {
  showPanel, // Importa la función para mostrar un panel.
  hidePanel, // Importa la función para ocultar un panel.
  showScoreboard, // Importa la función para mostrar el marcador de puntajes.
  sendScore, // Importa la función para enviar un puntaje al servidor.
  fetchScores, // Importa la función para obtener puntajes del servidor.
  animateLogo, // Importa la función para animar el logo.
} from "./shared.js"; // Importa funciones desde el archivo 'shared.js'.

document.addEventListener("DOMContentLoaded", () => {
  // Espera a que el DOM esté completamente cargado antes de ejecutar el script.
  const mainContent = document.getElementById("main-content"); // Obtiene la referencia al elemento principal del contenido.

  // Panel 1: Nickname
  const formularioNickname = document.createElement("div"); // Crea un nuevo elemento div para el formulario de nickname.
  formularioNickname.id = "nickname-form"; // Asigna el ID "nickname-form" al div.
  formularioNickname.className = "nickname-form show"; // Asigna las clases CSS para el formulario de nickname y lo hace visible.
  formularioNickname.innerHTML = `
    <label for="nickname-input">Enter your nickname</label> 
    <input type="text" id="nickname-input" maxlength="12" autocomplete="off" /> 
    <button id="start-btn">Start Game</button> 
  `;

  // Panel 2: Juego Simon
  const juegoSimon = document.createElement("div"); // Crea un nuevo elemento div para el juego Simon.
  juegoSimon.id = "simon-game"; // Asigna el ID "simon-game" al div.
  juegoSimon.className = "simon-panel hidden"; // Asigna las clases CSS y lo oculta inicialmente.
  juegoSimon.innerHTML = `
    <div class="game-panel"> 
      <div class="code-display" id="codeDisplay"> 
        <span id="typedCode" class="typed-code"></span> 
        <span id="codeCursor" class="code-cursor">|</span> 
      </div>
      <div class="simon-buttons"> 
        <button class="simon-btn" data-char="Ж"><span>Ж</span></button> 
        <button class="simon-btn" data-char="Я"><span>Я</span></button>
        <button class="simon-btn" data-char="Ф"><span>Ф</span></button>
        <button class="simon-btn" data-char="Ю"><span>Ю</span></button>
        <button class="simon-btn" data-char="Б"><span>Б</span></button> 
        <button class="simon-btn" data-char="Э"><span>Э</span></button> 
      </div>
      <div class="score-block"> 
        <div class="score-label">Score</div> 
        <div class="score-value" id="score">0</div> 
      </div>
    </div>
  `;

  // Panel 3: Scoreboard
  const tablaPuntajes = document.createElement("div"); // Crea un nuevo elemento div para el marcador de puntajes.
  tablaPuntajes.id = "scoreboard"; // Asigna el ID "scoreboard" al div.
  tablaPuntajes.className = "scoreboard hidden"; // Asigna las clases CSS y lo oculta inicialmente.

  // Agregar los paneles al DOM
  mainContent.appendChild(formularioNickname); // Agrega el formulario de nickname al contenido principal.
  mainContent.appendChild(juegoSimon); // Agrega el panel del juego Simon al contenido principal.
  mainContent.appendChild(tablaPuntajes); // Agrega el panel del marcador de puntajes al contenido principal.

  // Referencias a elementos
  const nicknameInput = document.getElementById("nickname-input"); // Obtiene la referencia al input del nickname.
  const startBtn = document.getElementById("start-btn"); // Obtiene la referencia al botón de inicio.
  const codeDisplay = document.getElementById("typedCode"); // Obtiene la referencia al span donde se muestra el código escrito.
  const codeCursor = document.getElementById("codeCursor"); // Obtiene la referencia al cursor del código.
  const simonBtns = Array.from(document.querySelectorAll(".simon-btn")); // Obtiene una colección de todos los botones de Simon y la convierte a un array.
  const scoreSpan = document.getElementById("score"); // Obtiene la referencia al span donde se muestra el puntaje.

  const CARACTERES = ["Ж", "Я", "Ф", "Ю", "Б", "Э"]; // Define los caracteres posibles para la secuencia del juego.
  let secuencia = []; // Array que almacenará la secuencia de caracteres del juego.
  let secuenciaUsuario = []; // Array que almacenará la secuencia de caracteres ingresada por el usuario.
  let puntaje = 0; // Variable para almacenar el puntaje actual del jugador.
  let nickname = ""; // Variable para almacenar el nickname del jugador.
  let aceptandoEntrada = false; // Booleano que indica si el juego está esperando la entrada del usuario.

  // Mostrar nickname form al inicio
  function mostrarPanelNickname() {
    // Define la función para mostrar el panel de nickname.
    showPanel(formularioNickname); // Muestra el panel del formulario de nickname.
    hidePanel(juegoSimon); // Oculta el panel del juego Simon.
    hidePanel(tablaPuntajes); // Oculta el panel del marcador de puntajes.
  }
  mostrarPanelNickname(); // Llama a la función para mostrar el panel de nickname al cargar la página.

  // Iniciar juego tras nickname
  startBtn.addEventListener("click", () => {
    // Agrega un event listener al botón de inicio para el evento 'click'.
    nickname = nicknameInput.value.trim(); // Obtiene el valor del input del nickname y elimina espacios en blanco al inicio y al final.
    if (!nickname) {
      // Si el nickname está vacío.
      nicknameInput.focus(); // Enfoca el input del nickname.
      return; // Sale de la función.
    }
    puntaje = 0; // Reinicia el puntaje a 0.
    scoreSpan.textContent = puntaje; // Actualiza el texto del span del puntaje.
    hidePanel(formularioNickname); // Oculta el panel del formulario de nickname.
    showPanel(juegoSimon); // Muestra el panel del juego Simon.
    hidePanel(tablaPuntajes); // Oculta el panel del marcador de puntajes.
    iniciarSimon(); // Llama a la función para iniciar el juego Simon.
  });

  nicknameInput.addEventListener("keydown", (e) => {
    // Agrega un event listener al input del nickname para el evento 'keydown'.
    if (e.key === "Enter") startBtn.click(); // Si la tecla presionada es "Enter", simula un clic en el botón de inicio.
  });

  // Simon Dice lógica
  function iniciarSimon() {
    // Define la función para iniciar el juego Simon.
    secuencia = []; // Reinicia la secuencia del juego.
    secuenciaUsuario = []; // Reinicia la secuencia del usuario.
    puntaje = 0; // Reinicia el puntaje.
    scoreSpan.textContent = puntaje; // Actualiza el texto del span del puntaje.
    limpiarCodigo(); // Limpia el código mostrado en pantalla.
    siguienteRonda(); // Inicia la siguiente ronda del juego.
  }

  function siguienteRonda() {
    // Define la función para avanzar a la siguiente ronda.
    secuenciaUsuario = []; // Reinicia la secuencia del usuario para la nueva ronda.
    secuencia.push(CARACTERES[Math.floor(Math.random() * CARACTERES.length)]); // Agrega un nuevo carácter aleatorio a la secuencia del juego.
    setTimeout(() => mostrarSecuencia(0), 600); // Llama a 'mostrarSecuencia' después de un breve retraso para mostrar la secuencia.
  }

  function mostrarSecuencia(indice) {
    // Define la función para mostrar la secuencia de Simon al usuario.
    simonBtns.forEach((btn) => {
      // Itera sobre todos los botones de Simon.
      btn.classList.remove("enabled", "active"); // Remueve las clases 'enabled' y 'active' de los botones.
    });
    codeCursor.style.visibility = "hidden"; // Oculta el cursor mientras se muestra la secuencia.
    if (indice >= secuencia.length) {
      // Si se han mostrado todos los caracteres de la secuencia.
      aceptandoEntrada = true; // Habilita la aceptación de entrada del usuario.
      simonBtns.forEach((btn) => btn.classList.add("enabled")); // Añade la clase 'enabled' a todos los botones para que sean interactivos.
      codeCursor.style.visibility = "visible"; // Hace visible el cursor.
      limpiarCodigo(); // Limpia el código mostrado.
      return; // Sale de la función.
    }
    const caracter = secuencia[indice]; // Obtiene el carácter actual de la secuencia.
    const btn = simonBtns.find((b) => b.dataset.char === caracter); // Encuentra el botón Simon que corresponde al carácter.
    btn.classList.add("active"); // Añade la clase 'active' al botón para resaltarlo.
    setTimeout(() => {
      // Establece un temporizador para desresaltar el botón.
      btn.classList.remove("active"); // Remueve la clase 'active' del botón.
      setTimeout(() => mostrarSecuencia(indice + 1), 350); // Llama recursivamente a 'mostrarSecuencia' para el siguiente carácter después de un breve retraso.
    }, 700); // El botón permanece activo por 700ms.
  }

  simonBtns.forEach((btn) => {
    // Itera sobre cada botón de Simon.
    btn.addEventListener("click", () => {
      // Agrega un event listener para el evento 'click' a cada botón.
      if (!aceptandoEntrada || !btn.classList.contains("enabled")) return; // Si no se está aceptando entrada o el botón no está habilitado, sale de la función.
      const caracter = btn.dataset.char; // Obtiene el carácter asociado al botón.
      btn.classList.add("active"); // Añade la clase 'active' al botón para resaltarlo.
      setTimeout(() => btn.classList.remove("active"), 180); // Remueve la clase 'active' después de un breve tiempo.
      secuenciaUsuario.push(caracter); // Agrega el carácter a la secuencia ingresada por el usuario.
      escribirCaracter(caracter); // Muestra el carácter en el display del código.
      verificarEntradaUsuario(); // Verifica si la entrada del usuario es correcta.
    });
  });

  function escribirCaracter(char) {
    // Define la función para mostrar un carácter en el display de código.
    codeDisplay.textContent += char; // Agrega el carácter al contenido de texto del display.
    codeDisplay.classList.remove("typed-code"); // Remueve la clase 'typed-code' para reiniciar la animación.
    void codeDisplay.offsetWidth; // Fuerza un reflow para que la animación se reinicie.
    codeDisplay.classList.add("typed-code"); // Vuelve a añadir la clase 'typed-code' para aplicar la animación.
  }

  function limpiarCodigo() {
    // Define la función para limpiar el display de código.
    codeDisplay.textContent = ""; // Establece el contenido de texto del display como vacío.
  }

  function verificarEntradaUsuario() {
    // Define la función para verificar la entrada del usuario.
    const idx = secuenciaUsuario.length - 1; // Obtiene el índice del último carácter ingresado por el usuario.
    if (secuenciaUsuario[idx] !== secuencia[idx]) {
      // Si el último carácter ingresado no coincide con el de la secuencia del juego.
      terminarJuego(); // Llama a la función para terminar el juego.
      return; // Sale de la función.
    }
    if (secuenciaUsuario.length === secuencia.length) {
      // Si la longitud de la secuencia del usuario coincide con la del juego (ronda completada).
      puntaje++; // Incrementa el puntaje.
      scoreSpan.textContent = puntaje; // Actualiza el texto del span del puntaje.
      aceptandoEntrada = false; // Deshabilita la aceptación de entrada del usuario.
      setTimeout(() => {
        // Establece un temporizador para limpiar el código e iniciar la siguiente ronda.
        limpiarCodigo(); // Limpia el código mostrado.
        siguienteRonda(); // Llama a la función para iniciar la siguiente ronda.
      }, 700); // Espera 700ms antes de proceder.
    }
  }

  function terminarJuego() {
    // Define la función para terminar el juego.
    hidePanel(juegoSimon); // Oculta el panel del juego Simon.
    sendScore("/data/game1", nickname, puntaje).then(() => {
      // Envía el puntaje del jugador al servidor.
      fetchScores(
        // Después de enviar el puntaje, obtiene los puntajes actualizados.
        "/data/game1", // Endpoint para obtener los puntajes del juego 1.
        (data) => showScoreboard(tablaPuntajes, data, nickname, puntaje), // Callback para mostrar el marcador de puntajes con los datos obtenidos.
        nickname, // Pasa el nickname del jugador.
        puntaje // Pasa el puntaje del jugador.
      );
    });
  }

  animateLogo(document.getElementById("arcadeLogo")); // Llama a la función para animar el logo del arcade.
}); // Cierre del event listener "DOMContentLoaded".