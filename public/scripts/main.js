document.addEventListener("DOMContentLoaded", () => {
  // Asegura que el DOM (Document Object Model) esté completamente cargado antes de ejecutar el script.
  const tarjetasModo = document.querySelectorAll(".mode-card"); // Selecciona todos los elementos con la clase "mode-card".
  const seleccionJuego = document.querySelector(".game-selection"); // Selecciona el elemento con la clase "game-selection".
  const seleccionModo = document.querySelector(".mode-selection"); // Selecciona el elemento con la clase "mode-selection".
  const separadorNeon = document.getElementById("neon-separator"); // Obtiene el elemento con el ID "neon-separator".
  const botonVolver = document.getElementById("backBtn"); // Obtiene el elemento con el ID "backBtn".

  function mostrarModos() {
    // Define una función para mostrar el panel de selección de modo.
    seleccionModo.classList.remove("hidden"); // Elimina la clase "hidden" de la selección de modo, haciéndola visible.
    separadorNeon.classList.add("hidden"); // Agrega la clase "hidden" al separador de neón, ocultándolo.
    seleccionJuego.classList.remove("show"); // Elimina la clase "show" de la selección de juego, ocultándola.
    seleccionJuego.innerHTML = ""; // Borra el contenido HTML interno del área de selección de juego.
    botonVolver.classList.add("hidden"); // Agrega la clase "hidden" al botón de volver, ocultándolo.
    botonVolver.classList.remove("show"); // Elimina la clase "show" del botón de volver si estaba allí.
    tarjetasModo.forEach((tarjeta) => tarjeta.classList.remove("hidden")); // Itera sobre cada tarjeta de modo y elimina la clase "hidden".
  }
  mostrarModos(); // Llama a la función para mostrar la selección de modo cuando se carga la página.

  tarjetasModo.forEach((tarjeta) => {
    // Itera sobre cada tarjeta de modo.
    tarjeta.addEventListener("click", () => {
      // Agrega un listener de evento de clic a cada tarjeta de modo.
      const modoSeleccionado = tarjeta.getAttribute("data-mode"); // Obtiene el valor del atributo "data-mode" de la tarjeta clicada.
      tarjetasModo.forEach((t) => t.classList.add("hidden")); // Oculta todas las tarjetas de modo.
      seleccionModo.classList.add("hidden"); // Oculta el panel de selección de modo.
      separadorNeon.classList.remove("hidden"); // Muestra el separador de neón.
      botonVolver.classList.remove("hidden"); // Muestra el botón de volver.
      botonVolver.classList.add("show"); // Agrega la clase "show" al botón de volver para estilizar/animar.
      mostrarSeleccionJuego(modoSeleccionado); // Llama a la función para mostrar la selección de juego basada en el modo elegido.
    });
    tarjeta.addEventListener("keydown", (evento) => {
      // Agrega un listener de evento de teclado a cada tarjeta de modo.
      if (evento.key === "Enter" || evento.key === " ") tarjeta.click(); // Si se presiona 'Enter' o 'Espacio', simula un clic en la tarjeta.
    });
  });

  botonVolver.addEventListener("click", () => {
    // Agrega un listener de evento de clic al botón de volver.
    seleccionModo.classList.remove("hidden"); // Muestra el panel de selección de modo.
    tarjetasModo.forEach((tarjeta) => tarjeta.classList.remove("hidden")); // Muestra todas las tarjetas de modo.
    mostrarModos(); // Llama a la función para reiniciar y mostrar la selección de modo.
  });

  function mostrarSeleccionJuego(modo) {
    // Define una función para mostrar la selección de juego basada en el modo elegido.
    seleccionJuego.innerHTML = ""; // Borra cualquier contenido existente en el área de selección de juego.
    seleccionJuego.classList.add("show"); // Agrega la clase "show" a la selección de juego para estilizar/animar.
    const juegos = {
      // Define un objeto que contiene datos de juegos para diferentes modos.
      pve: [
        // Juegos disponibles en el modo Jugador contra Entorno.
        {
          key: "game1", // Clave única para el juego.
          name: "Simon Says", // Nombre para mostrar del juego.
          desc: "Repeat the color sequence. Memory challenge!", // Breve descripción del juego.
          url: "/pages/game1.html", // URL a la página HTML del juego.
        },
        {
          key: "game2", // Clave única para el juego.
          name: "Tic Tac Toe", // Nombre para mostrar del juego.
          desc: "Get three in a row before the computer.", // Breve descripción del juego.
          url: "/pages/game2.html?mode=pve", // URL a la página HTML del juego con el parámetro de modo PVE.
        },
        {
          key: "game3", // Clave única para el juego.
          name: "Rock Paper Scissors", // Nombre para mostrar del juego.
          desc: "Classic hand game. Beat the computer!", // Breve descripción del juego.
          url: "/pages/game3.html?mode=pve", // URL a la página HTML del juego con el parámetro de modo PVE.
        },
      ],
      pvp: [
        // Juegos disponibles en el modo Jugador contra Jugador.
        {
          key: "game2", // Clave única para el juego.
          name: "Tic Tac Toe", // Nombre para mostrar del juego.
          desc: "Play against a friend. Three in a row wins!", // Breve descripción del juego.
          url: "/pages/game2.html?mode=pvp", // URL a la página HTML del juego con el parámetro de modo PVP.
        },
        {
          key: "game3", // Clave única para el juego.
          name: "Rock Paper Scissors", // Nombre para mostrar del juego.
          desc: "Challenge your friend in this classic game.", // Breve descripción del juego.
          url: "/pages/game3.html?mode=pvp", // URL a la página HTML del juego con el parámetro de modo PVP.
        },
      ],
    };
    juegos[modo].forEach((juego, i) => {
      // Itera sobre el array de juegos correspondiente al modo seleccionado.
      const div = document.createElement("div"); // Crea un nuevo elemento HTML <div> para cada tarjeta de juego.
      div.className = "game-card"; // Asigna la clase "game-card" al div.
      div.tabIndex = 0; // Hace que el div sea enfocable para la navegación con teclado.
      div.style.animationDelay = `${0.1 + i * 0.1}s`; // Establece un retraso de animación escalonado para cada tarjeta.
      div.innerHTML = `
        <div class="game-title">${juego.name}</div> 
        <div class="game-desc">${juego.desc}</div> 
      `;
      div.addEventListener("click", () => {
        // Agrega un listener de evento de clic a cada tarjeta de juego.
        window.location.href = juego.url; // Navega a la URL del juego cuando se hace clic.
      });
      div.addEventListener("keydown", (evento) => {
        // Agrega un listener de evento de teclado a cada tarjeta de juego.
        if (evento.key === "Enter" || evento.key === " ") div.click(); // Si se presiona 'Enter' o 'Espacio', simula un clic.
      });
      seleccionJuego.appendChild(div); // Agrega la tarjeta de juego creada al área de selección de juego.
    });
  }

  // Animación del letrero LED para el logo
  const logo = document.getElementById("arcadeLogo"); // Obtiene el elemento con el ID "arcadeLogo".
  if (logo) {
    // Comprueba si el elemento del logo existe.
    const letras = logo.querySelectorAll("span"); // Selecciona todos los elementos <span> dentro del logo.
    let paso = 0; // Inicializa un contador de pasos para la animación.
    let intervalo; // Variable para almacenar el ID del intervalo.
    const totalLetras = letras.length; // Número total de letras/spans en el logo.
    const demoraEncendido = 120; // Milisegundos de retraso entre el encendido de cada letra.
    const demoraMantener = 900; // Milisegundos que todo el logo permanece encendido.
    const demoraApagado = 400; // Milisegundos que todo el logo permanece apagado antes de repetir.

    function animarLogo() {
      // Define la función para animar el logo.
      // Apagar todas
      letras.forEach((letra) => letra.classList.remove("lit")); // Elimina la clase "lit" de todas las letras, apagándolas.
      paso = 0; // Reinicia el contador de pasos.

      // Encender una por una
      intervalo = setInterval(() => {
        // Establece un intervalo para encender las letras secuencialmente.
        if (paso < totalLetras) {
          // Si no se han encendido todas las letras aún.
          letras[paso].classList.add("lit"); // Agrega la clase "lit" a la letra actual.
          paso++; // Incrementa el contador de pasos.
        } else {
          // Si se han encendido todas las letras.
          clearInterval(intervalo); // Borra el intervalo.
          // Mantener encendido
          setTimeout(() => {
            // Establece un timeout para mantener el logo encendido durante una duración.
            // Apagar todas a la vez
            letras.forEach((letra) => letra.classList.remove("lit")); // Apaga todas las letras simultáneamente.
            // Esperar y repetir
            setTimeout(animarLogo, demoraApagado); // Establece un timeout para repetir la animación después de un retraso.
          }, demoraMantener); // La duración en que el logo permanece completamente encendido.
        }
      }, demoraEncendido); // El retraso entre el encendido de cada letra.
    }
    animarLogo(); // Llama a la función para iniciar la animación del logo.
  }
});