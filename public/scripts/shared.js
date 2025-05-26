export function showPanel(panel) {
  // Elimina la clase 'hidden' para mostrar el panel.
  panel.classList.remove("hidden");
  // Agrega la clase 'show' para aplicar estilos de visibilidad o animación.
  panel.classList.add("show");
}

export function hidePanel(panel) {
  // Agrega la clase 'hidden' para ocultar el panel.
  panel.classList.add("hidden");
  // Elimina la clase 'show' si estaba presente.
  panel.classList.remove("show");
}

export function showScoreboard(panelMarcador, puntajes, miNick, miPuntaje) {
  // Crea una copia del array de puntajes y lo ordena de forma descendente.
  puntajes = puntajes.slice().sort((a, b) => b.score - a.score);
  let listaHtml = ""; // Variable para construir el HTML de la lista de puntajes.
  let miPosicion = -1; // Variable para almacenar la posición del jugador actual.

  // Itera sobre los puntajes para construir cada fila de la lista HTML.
  puntajes.forEach((entrada, i) => {
    // Comprueba si la entrada actual corresponde al jugador basándose en nickname y puntaje,
    // y si su posición no ha sido guardada ya.
    const esMiEntrada =
      entrada.nickname === miNick && entrada.score === miPuntaje && miPosicion === -1;
    if (esMiEntrada) miPosicion = i + 1; // Si es el jugador actual, guarda su posición.

    // Agrega la fila de puntaje al HTML. Se añade una clase 'me' si es la entrada del jugador actual.
    listaHtml += `<div class="score-row${esMiEntrada ? " me" : ""}">${i + 1}. ${
      entrada.nickname
    } - ${entrada.score}</div>`;
  });

  // Inserta el contenido HTML generado en el panel del marcador.
  panelMarcador.innerHTML = `
    <div class="scoreboard-title">High Scores</div> 
    <div class="score-list">${listaHtml}</div> 
    <div class="scoreboard-btns"> 
      <button onclick="location.reload()" class="play-again-btn">Play Again</button> 
      <button onclick="window.location.href='/'" class="play-again-btn">Return to Home</button> 
    </div>
  `;
  // Muestra el panel del marcador quitando la clase 'hidden'.
  panelMarcador.classList.remove("hidden");
  // Añade un pequeño retardo para asegurar que la clase 'show' se aplique correctamente,
  // permitiendo transiciones o animaciones CSS.
  setTimeout(() => {
    panelMarcador.classList.add("show");
  }, 10);
}

// Envía el puntaje a un endpoint específico (por ejemplo, "/data/game1").
export async function sendScore(endpoint, nick, score) {
  try {
    // Realiza una solicitud POST al endpoint especificado.
    await fetch(endpoint, {
      method: "POST", // Método HTTP POST.
      headers: { "Content-Type": "application/x-www-form-urlencoded" }, // Encabezado para indicar el tipo de contenido.
      body: `nickname=${encodeURIComponent(nick)}&score=${score}`, // Cuerpo de la solicitud con el nickname y el puntaje codificados.
    });
  } catch (e) {
    // Captura cualquier error durante la solicitud.
    // Ignora los errores intencionalmente para no bloquear la ejecución si el envío falla.
  }
}

// Obtiene los puntajes de un endpoint y ejecuta una función de callback con los datos.
export async function fetchScores(endpoint, callback, miNick, miPuntaje) {
  try {
    // Realiza una solicitud GET al endpoint especificado.
    const respuesta = await fetch(endpoint);
    // Convierte la respuesta a formato JSON.
    const datos = await respuesta.json();
    // Ejecuta la función de callback con los datos obtenidos, el nickname y el puntaje del jugador.
    callback(datos, miNick, miPuntaje);
  } catch (e) {
    // Captura cualquier error durante la obtención de los datos.
    // Ignora los errores intencionalmente.
  }
}

// Animación LED para el logo del arcade.
export function animateLogo(logo) {
  // Si el elemento del logo no existe, sale de la función.
  if (!logo) return;

  const letras = logo.querySelectorAll("span"); // Selecciona todos los elementos <span> dentro del logo.
  let paso = 0; // Contador para el paso actual de la animación.
  let intervalo; // Variable para almacenar el ID del intervalo de tiempo.
  const total = letras.length; // Número total de letras en el logo.
  const demoraEncendido = 120; // Milisegundos de retraso entre el encendido de cada letra.
  const demoraMantener = 900; // Milisegundos que el logo permanece completamente encendido.
  const demoraApagado = 400; // Milisegundos que el logo permanece apagado antes de repetir la animación.

  function ejecutarAnimacion() {
    // Apaga todas las letras al inicio de cada ciclo de animación.
    letras.forEach((letra) => letra.classList.remove("lit"));
    paso = 0; // Reinicia el contador de pasos.

    // Inicia un intervalo para encender las letras una por una.
    intervalo = setInterval(() => {
      if (paso < total) {
        // Si aún quedan letras por encender.
        letras[paso].classList.add("lit"); // Enciende la letra actual.
        paso++; // Avanza al siguiente paso.
      } else {
        // Cuando todas las letras están encendidas.
        clearInterval(intervalo); // Detiene el intervalo.
        // Establece un temporizador para mantener las letras encendidas por un tiempo.
        setTimeout(() => {
          // Apaga todas las letras de golpe.
          letras.forEach((letra) => letra.classList.remove("lit"));
          // Establece un temporizador para esperar y luego repetir toda la animación.
          setTimeout(ejecutarAnimacion, demoraApagado);
        }, demoraMantener);
      }
    }, demoraEncendido); // Intervalo de tiempo entre el encendido de cada letra.
  }
  ejecutarAnimacion(); // Inicia la animación cuando se llama a la función `animateLogo`.
}