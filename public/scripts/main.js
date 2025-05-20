document.addEventListener("DOMContentLoaded", () => {
  const modeCards = document.querySelectorAll(".mode-card");
  const screen = document.querySelector(".arcade-screen");
  const selectSound = document.getElementById("select-sound");
  const neonSound = document.getElementById("neon-sound");
  const gameSelection = document.querySelector(".game-selection");
  const modeSelection = document.querySelector(".mode-selection");
  const neonHr = document.getElementById("neon-separator");
  const backBtn = document.getElementById("backBtn");
  let zoomed = false;
  let selectedMode = null;

  // Mostrar modos de juego al cargar
  function showModes() {
    modeSelection.classList.remove("hide");
    modeSelection.classList.remove("hidden");
    neonHr.classList.add("hidden");
    gameSelection.classList.remove("show");
    setTimeout(() => {
      gameSelection.innerHTML = "";
    }, 400);
    backBtn.classList.remove("show");
    backBtn.classList.add("hidden");
    modeCards.forEach(c => c.classList.remove("selected"));
  }
  showModes();

  // Juegos disponibles
  const games = {
    pve: [
      {
        key: "rps",
        name: "Rock Paper Scissors",
        desc: "Classic hand game. Beat the computer!",
        url: "/pages/ppt.html"
      },
      {
        key: "ttt",
        name: "Tic Tac Toe",
        desc: "Get three in a row before the computer.",
        url: "/pages/tateti.html"
      },
      {
        key: "simon",
        name: "Simon Says",
        desc: "Repeat the color sequence. Memory challenge!",
        url: "/pages/sd.html"
      }
    ],
    pvp: [
      {
        key: "ttt",
        name: "Tic Tac Toe",
        desc: "Play against a friend. Three in a row wins!",
        url: "/pages/tateti.html"
      },
      {
        key: "rps",
        name: "Rock Paper Scissors",
        desc: "Challenge your friend in this classic game.",
        url: "/pages/ppt.html"
      }
    ]
  };

  // Selección de modo
  modeCards.forEach(card => {
    card.addEventListener("click", () => {
      if (card.classList.contains("selected")) return;
      modeCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedMode = card.getAttribute("data-mode");
      selectSound.currentTime = 0;
      selectSound.play();

      // Animar marco solo la primera vez
      if (!zoomed) {
        screen.classList.add("zoom-animated");
        neonSound.currentTime = 0;
        neonSound.play();
        zoomed = true;
      }

      // Ocultar selección de modo y mostrar separador y back con animación
      modeSelection.classList.add("hide");
      setTimeout(() => {
        modeSelection.classList.add("hidden");
        neonHr.classList.remove("hidden");
        backBtn.classList.add("show");
        backBtn.classList.remove("hidden");
        showGameSelection(selectedMode);
      }, 500);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") card.click();
    });
  });

  // Botón volver atrás
  backBtn.addEventListener("click", () => {
    gameSelection.classList.remove("show");
    neonHr.classList.add("hidden");
    backBtn.classList.remove("show");
    setTimeout(showModes, 400);
  });

  // Mostrar tarjetas de juegos según modo
  function showGameSelection(mode) {
    gameSelection.innerHTML = "";
    setTimeout(() => {
      gameSelection.classList.add("show");
      games[mode].forEach((game, i) => {
        const div = document.createElement("div");
        div.className = "game-card";
        div.tabIndex = 0;
        div.style.animationDelay = `${0.1 + i * 0.1}s`;
        div.innerHTML = `
          <div class="game-title">${game.name}</div>
          <div class="game-desc">${game.desc}</div>
        `;
        div.addEventListener("click", () => {
          selectSound.currentTime = 0;
          selectSound.play();
          window.location.href = game.url;
        });
        div.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") div.click();
        });
        gameSelection.appendChild(div);
      });
    }, 50);
  }
});