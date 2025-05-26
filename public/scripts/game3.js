import {
  showPanel,
  hidePanel,
  showScoreboard,
  sendScore,
  fetchScores,
  animateLogo,
} from "./shared.js";

document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");

  // Panel 1: Nickname form
  const nicknameForm = document.createElement("form");
  nicknameForm.id = "nickname-form";
  nicknameForm.className = "nickname-form show";
  nicknameForm.autocomplete = "off";
  nicknameForm.innerHTML = `
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

  // Panel 3: Scoreboard (always rendered)
  const scoreboard = document.createElement("div");
  scoreboard.id = "scoreboard";
  scoreboard.className = "scoreboard hidden";

  mainContent.appendChild(nicknameForm);
  mainContent.appendChild(scoreboard);

  const input1 = nicknameForm.querySelector("#nickname-input-1");
  const label2 = nicknameForm.querySelector("#label-player2");
  const inputGroup2 = nicknameForm.querySelector("#input-group-2");
  const input2 = nicknameForm.querySelector("#nickname-input-2");
  const startBtn = nicknameForm.querySelector("#start-btn");

  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") || "pve";

  // Mostrar/ocultar segundo input y label según modo
  if (mode === "pvp") {
    label2.textContent = "Player 2";
    inputGroup2.style.display = "";
    input2.required = true;
  } else {
    label2.textContent = "Player 2";
    inputGroup2.style.display = "none";
    input2.required = false;
  }

  let names = ["Player 1", "Player 2"];
  let scores = [0, 0];
  let choices = [null, null];
  let turn = 0; // 0: Player 1, 1: Player 2

  // Panel 2: Game (only rendered after names are set)
  let rpsGame = null;
  let rpsTitle, rpsStatus, rpsResult, scoreP1, scoreP2, nextRoundBtn, endGameBtn, rpsCards;

  function renderGamePanel() {
    // Estructura simplificada del panel de juego
    rpsGame = document.createElement("div");
    rpsGame.id = "rps-game";
    rpsGame.className = "rps-panel hidden";
    rpsGame.innerHTML = `
      <div class="rps-scores"><span id="score-p1">0</span> - <span id="score-p2">0</span></div>
      <div class="rps-cards" id="rps-cards">
        <button class="rps-card" data-choice="rock">Rock</button>
        <button class="rps-card" data-choice="paper">Paper</button>
        <button class="rps-card" data-choice="scissors">Scissors</button>
      </div>
      <div class="rps-status-group">
  <div class="rps-status" id="rps-status">Turno</div>
  <div class="rps-result" id="rps-result"></div>
</div>

      <div class="game-action-btns" style="display: none;">
        <button id="next-round-btn" class="play-again-btn">Next Round</button>
        <button id="end-game-btn" class="play-again-btn">End Game</button>
      </div>
    `;
    mainContent.insertBefore(rpsGame, scoreboard);

    rpsStatus = rpsGame.querySelector("#rps-status");
    rpsResult = rpsGame.querySelector("#rps-result");
    scoreP1 = rpsGame.querySelector("#score-p1");
    scoreP2 = rpsGame.querySelector("#score-p2");
    nextRoundBtn = rpsGame.querySelector("#next-round-btn");
    endGameBtn = rpsGame.querySelector("#end-game-btn");
    rpsCards = Array.from(rpsGame.querySelectorAll(".rps-card"));

    rpsCards.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (mode === "pve" && choices[0] === null) {
          handleChoice(btn.dataset.choice);
        } else if (mode === "pvp" && choices[turn] === null) {
          handleChoice(btn.dataset.choice);
        }
      });
    });

    nextRoundBtn.addEventListener("click", () => {
      resetRound();
      rpsCards.forEach((btn) => (btn.disabled = false));
    });

    endGameBtn.addEventListener("click", () => {
      hidePanel(rpsGame);
      let winnerIdx =
        scores[0] > scores[1] ? 0 : scores[1] > scores[0] ? 1 : -1;
      if (winnerIdx >= 0) {
        sendScore("/data/game3", names[winnerIdx], scores[winnerIdx]).then(
          () => {
            fetchScores(
              "/data/game3",
              (data) =>
                showScoreboard(
                  scoreboard,
                  data,
                  names[winnerIdx],
                  scores[winnerIdx]
                ),
              names[winnerIdx],
              scores[winnerIdx]
            );
          }
        );
      } else {
        showScoreboard(scoreboard, [], "", 0);
      }
      showPanel(scoreboard);
      hidePanel(rpsGame);
      hidePanel(nicknameForm);
    });
  }

  function resetRound() {
    choices = [null, null];
    turn = 0;
    
    // Restaurar cartas originales
    const cardsContainer = rpsGame.querySelector("#rps-cards");
    cardsContainer.innerHTML = `
      <button class="rps-card" data-choice="rock">Rock</button>
      <button class="rps-card" data-choice="paper">Paper</button>
      <button class="rps-card" data-choice="scissors">Scissors</button>
    `;
    
    // Reasignar event listeners
    rpsCards = Array.from(cardsContainer.querySelectorAll(".rps-card"));
    rpsCards.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (mode === "pve" && choices[0] === null) {
          handleChoice(btn.dataset.choice);
        } else if (mode === "pvp" && choices[turn] === null) {
          handleChoice(btn.dataset.choice);
        }
      });
    });
    
    // Solo mostrar "Turn" y nombre del jugador
    if (mode === "pvp") {
      rpsStatus.textContent = "Turn";
      rpsResult.textContent = names[turn];
    } else {
      rpsStatus.textContent = "Turn";
      rpsResult.textContent = names[0];
    }
    
    // Ocultar botones durante el juego
    const actionBtns = rpsGame.querySelector(".game-action-btns");
    actionBtns.style.display = "none";
  }

  function handleChoice(choice) {
    if (mode === "pve") {
      choices[0] = choice;
      // CPU random
      const cpuChoices = ["rock", "paper", "scissors"];
      choices[1] = cpuChoices[Math.floor(Math.random() * 3)];
      setTimeout(() => {
        showResult();
      }, 800);
    } else {
      choices[turn] = choice;
      if (turn === 0) {
        turn = 1;
        rpsStatus.textContent = "Turn";
        rpsResult.textContent = names[1];
      } else {
        showResult();
      }
    }
  }

  function showResult() {
    const [p1, p2] = choices;
    
    // Mostrar cartas de resultado
    const cardsContainer = rpsGame.querySelector("#rps-cards");
    cardsContainer.innerHTML = `
      <div class="rps-card result-card">${capitalize(p1)}</div>
      <div class="rps-card vs-card">VS</div>
      <div class="rps-card result-card">${capitalize(p2)}</div>
    `;
    
    // Determinar resultado
    let winner = "";
    if (p1 === p2) {
      rpsStatus.textContent = "Tie";
      rpsResult.textContent = "Nobody wins!";
    } else if (
      (p1 === "rock" && p2 === "scissors") ||
      (p1 === "paper" && p2 === "rock") ||
      (p1 === "scissors" && p2 === "paper")
    ) {
      scores[0]++;
      winner = names[0];
      rpsStatus.textContent = "Winner";
      rpsResult.textContent = winner;
    } else {
      scores[1]++;
      winner = names[1];
      rpsStatus.textContent = "Winner";
      rpsResult.textContent = winner;
    }
    
    // Actualizar marcador
    scoreP1.textContent = scores[0];
    scoreP2.textContent = scores[1];
    
    // Mostrar botones al final
    const actionBtns = rpsGame.querySelector(".game-action-btns");
    actionBtns.style.display = "flex";
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!input1.value.trim() || (mode === "pvp" && !input2.value.trim())) {
      nicknameForm.classList.add("shake");
      setTimeout(() => nicknameForm.classList.remove("shake"), 400);
      return;
    }
    names[0] = input1.value.trim();
    names[1] = mode === "pvp" ? input2.value.trim() : "CPU";
    scores = [0, 0];
    // Render game panel only after names are set
    if (!rpsGame) renderGamePanel();
    scoreP1.textContent = "0";
    scoreP2.textContent = "0";
    hidePanel(nicknameForm);
    hidePanel(scoreboard);
    showPanel(rpsGame);
    resetRound();
  });

  // Inicial: solo nickname form visible
  showPanel(nicknameForm);
  hidePanel(scoreboard);

  animateLogo(document.getElementById("arcadeLogo"));
});