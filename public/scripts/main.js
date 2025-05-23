document.addEventListener("DOMContentLoaded", () => {
  const modeCards = document.querySelectorAll(".mode-card");
  const gameSelection = document.querySelector(".game-selection");
  const modeSelection = document.querySelector(".mode-selection");
  const neonHr = document.getElementById("neon-separator");
  const backBtn = document.getElementById("backBtn");

  function showModes() {
    modeSelection.classList.remove("hidden");
    neonHr.classList.add("hidden");
    gameSelection.classList.remove("show");
    gameSelection.innerHTML = "";
    backBtn.classList.add("hidden");
    backBtn.classList.remove("show"); // <-- quita show al ocultar
    modeCards.forEach((c) => c.classList.remove("hidden"));
  }
  showModes();

  modeCards.forEach((card) => {
    card.addEventListener("click", () => {
      const selectedMode = card.getAttribute("data-mode");
      modeCards.forEach((c) => c.classList.add("hidden"));
      modeSelection.classList.add("hidden");
      neonHr.classList.remove("hidden");
      backBtn.classList.remove("hidden");
      backBtn.classList.add("show"); // <-- agrega show al mostrar
      showGameSelection(selectedMode);
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") card.click();
    });
  });

  backBtn.addEventListener("click", () => {
    modeSelection.classList.remove("hidden");
    modeCards.forEach((c) => c.classList.remove("hidden"));
    showModes();
  });

  function showGameSelection(mode) {
    gameSelection.innerHTML = "";
    gameSelection.classList.add("show");
    const games = {
      pve: [
        {
          key: "game1",
          name: "Simon Says",
          desc: "Repeat the color sequence. Memory challenge!",
          url: "/pages/game1.html",
        },
        {
          key: "game2",
          name: "Tic Tac Toe",
          desc: "Get three in a row before the computer.",
          url: "/pages/game2.html",
        },
        {
          key: "game3",
          name: "Rock Paper Scissors",
          desc: "Classic hand game. Beat the computer!",
          url: "/pages/game3.html",
        },
      ],
      pvp: [
        {
          key: "game2",
          name: "Tic Tac Toe",
          desc: "Play against a friend. Three in a row wins!",
          url: "/pages/game2.html",
        },
        {
          key: "game3",
          name: "Rock Paper Scissors",
          desc: "Challenge your friend in this classic game.",
          url: "/pages/game3.html",
        },
      ],
    };
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
        window.location.href = game.url;
      });
      div.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") div.click();
      });
      gameSelection.appendChild(div);
    });
  }

  // Animación letrero LED para el logo
  const logo = document.getElementById("arcadeLogo");
  if (logo) {
    const letters = logo.querySelectorAll("span");
    let step = 0;
    let interval;
    const total = letters.length;
    const onDelay = 120; // ms entre letras encendidas
    const holdDelay = 900; // ms encendido total
    const offDelay = 400; // ms apagado total

    function animateLogo() {
      // Apaga todas
      letters.forEach((l) => l.classList.remove("lit"));
      step = 0;

      // Enciende una a una
      interval = setInterval(() => {
        if (step < total) {
          letters[step].classList.add("lit");
          step++;
        } else {
          clearInterval(interval);
          // Mantiene encendido
          setTimeout(() => {
            // Apaga todas de golpe
            letters.forEach((l) => l.classList.remove("lit"));
            // Espera y repite
            setTimeout(animateLogo, offDelay);
          }, holdDelay);
        }
      }, onDelay);
    }
    animateLogo();
  }
});
