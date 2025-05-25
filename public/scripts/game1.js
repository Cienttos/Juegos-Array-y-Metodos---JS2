import {
  showPanel,
  hidePanel,
  showScoreboard,
  sendScore,
  fetchScores,
  animateLogo,
} from "./shared.js";

document.addEventListener("DOMContentLoaded", () => {
  // Renderizar los 3 paneles en el DOM
  const mainContent = document.getElementById("main-content");

  // Panel 1: Nickname
  const nicknameForm = document.createElement("div");
  nicknameForm.id = "nickname-form";
  nicknameForm.className = "nickname-form show";
  nicknameForm.innerHTML = `
    <label for="nickname-input">Enter your nickname</label>
    <input type="text" id="nickname-input" maxlength="12" autocomplete="off" />
    <button id="start-btn">Start Game</button>
  `;

  // Panel 2: Juego Simon
  const simonGame = document.createElement("div");
  simonGame.id = "simon-game";
  simonGame.className = "simon-panel hidden";
  simonGame.innerHTML = `
    <div class="game-panel">
      <div class="code-display" id="codeDisplay">
        <span id="typedCode" class="typed-code"></span>
        <span id="codeCursor" class="code-cursor">|</span>
      </div>
      <div class="simon-buttons-6">
        <button class="simon-btn6" data-char="Ж"><span>Ж</span></button>
        <button class="simon-btn6" data-char="Я"><span>Я</span></button>
        <button class="simon-btn6" data-char="Ф"><span>Ф</span></button>
        <button class="simon-btn6" data-char="Ю"><span>Ю</span></button>
        <button class="simon-btn6" data-char="Б"><span>Б</span></button>
        <button class="simon-btn6" data-char="Э"><span>Э</span></button>
      </div>
      <div class="score-block">
        <div class="score-label">Score</div>
        <div class="score-value" id="score">0</div>
      </div>
    </div>
  `;

  // Panel 3: Scoreboard
  const scoreboard = document.createElement("div");
  scoreboard.id = "scoreboard";
  scoreboard.className = "scoreboard hidden";

  // Agregar los paneles al DOM
  mainContent.appendChild(nicknameForm);
  mainContent.appendChild(simonGame);
  mainContent.appendChild(scoreboard);

  // Referencias a elementos
  const nicknameInput = document.getElementById("nickname-input");
  const startBtn = document.getElementById("start-btn");
  const codeDisplay = document.getElementById("typedCode");
  const codeCursor = document.getElementById("codeCursor");
  const simonBtns = Array.from(document.querySelectorAll(".simon-btn6"));
  const scoreSpan = document.getElementById("score");

  const CHARS = ["Ж", "Я", "Ф", "Ю", "Б", "Э"];
  let sequence = [];
  let userSequence = [];
  let score = 0;
  let nickname = "";
  let acceptingInput = false;

  // Mostrar nickname form al inicio
  function showNicknamePanel() {
    showPanel(nicknameForm);
    hidePanel(simonGame);
    hidePanel(scoreboard);
  }
  showNicknamePanel();

  // Iniciar juego tras nickname
  startBtn.addEventListener("click", () => {
    nickname = nicknameInput.value.trim();
    if (!nickname) {
      nicknameInput.focus();
      return;
    }
    score = 0;
    scoreSpan.textContent = score;
    hidePanel(nicknameForm);
    showPanel(simonGame);
    hidePanel(scoreboard);
    startSimon();
  });

  nicknameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startBtn.click();
  });

  // Simon Dice lógica
  function startSimon() {
    sequence = [];
    userSequence = [];
    score = 0;
    scoreSpan.textContent = score;
    clearCode();
    nextRound();
  }

  function nextRound() {
    userSequence = [];
    sequence.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
    setTimeout(() => showSequence(0), 600);
  }

  function showSequence(index) {
    simonBtns.forEach((btn) => {
      btn.classList.remove("enabled", "active");
    });
    codeCursor.style.visibility = "hidden";
    if (index >= sequence.length) {
      acceptingInput = true;
      simonBtns.forEach((btn) => btn.classList.add("enabled"));
      codeCursor.style.visibility = "visible";
      clearCode();
      return;
    }
    const char = sequence[index];
    const btn = simonBtns.find((b) => b.dataset.char === char);
    btn.classList.add("active");
    setTimeout(() => {
      btn.classList.remove("active");
      setTimeout(() => showSequence(index + 1), 350);
    }, 700);
  }

  simonBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!acceptingInput || !btn.classList.contains("enabled")) return;
      const char = btn.dataset.char;
      btn.classList.add("active");
      setTimeout(() => btn.classList.remove("active"), 180);
      userSequence.push(char);
      typeChar(char);
      checkUserInput();
    });
  });

  function typeChar(char) {
    codeDisplay.textContent += char;
    codeDisplay.classList.remove("typed-code");
    void codeDisplay.offsetWidth;
    codeDisplay.classList.add("typed-code");
  }

  function clearCode() {
    codeDisplay.textContent = "";
  }

  function checkUserInput() {
    const idx = userSequence.length - 1;
    if (userSequence[idx] !== sequence[idx]) {
      endGame();
      return;
    }
    if (userSequence.length === sequence.length) {
      score++;
      scoreSpan.textContent = score;
      acceptingInput = false;
      setTimeout(() => {
        clearCode();
        nextRound();
      }, 700);
    }
  }

  function endGame() {
    hidePanel(simonGame);
    sendScore("/data/game1", nickname, score).then(() => {
      fetchScores(
        "/data/game1",
        (data) => showScoreboard(scoreboard, data, nickname, score),
        nickname,
        score
      );
    });
  }

  animateLogo(document.getElementById("arcadeLogo"));
});
