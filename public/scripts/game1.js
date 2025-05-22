const nicknameForm = document.getElementById("nickname-form");
const nicknameInput = document.getElementById("nickname-input");
const startBtn = document.getElementById("start-btn");
const simonGame = document.getElementById("simon-game");
const scoreSpan = document.getElementById("score");
const scoreboard = document.getElementById("scoreboard");
const codeDisplay = document.getElementById("typedCode");
const codeCursor = document.getElementById("codeCursor");
const simonBtns = Array.from(document.querySelectorAll(".simon-btn6"));

const CHARS = ["Ж", "Я", "Ф", "Ю", "Б", "Э"];

let sequence = [];
let userSequence = [];
let score = 0;
let nickname = "";
let acceptingInput = false;

// Mostrar nickname form al inicio
function showNicknameForm() {
  nicknameForm.classList.remove("hidden");
  simonGame.classList.add("hidden");
  scoreboard.classList.add("hidden");
}
showNicknameForm();

// Iniciar juego tras nickname
startBtn.addEventListener("click", () => {
  nickname = nicknameInput.value.trim();
  if (!nickname) {
    nicknameInput.focus();
    return;
  }
  score = 0;
  scoreSpan.textContent = score;
  nicknameForm.classList.add("hidden");
  simonGame.classList.remove("hidden");
  scoreboard.classList.add("hidden");
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
    btn.classList.remove("enabled");
    btn.classList.remove("active");
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

// Efecto de tipeo y entrada de usuario
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
  void codeDisplay.offsetWidth; // trigger reflow for animation
  codeDisplay.classList.add("typed-code");
}

function clearCode() {
  codeDisplay.textContent = "";
}

// Validar secuencia
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

// Fin de juego y mostrar scores
function endGame() {
  simonGame.classList.add("hidden");
  sendScore(nickname, score).then(() => {
    fetchScores(nickname);
  });
}

// --- Scores API ---
async function sendScore(nick, score) {
  try {
    await fetch("/data/game1", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `nickname=${encodeURIComponent(nick)}&score=${score}`,
    });
  } catch (e) {
    // ignore
  }
}

async function fetchScores(myNick) {
  try {
    const res = await fetch("/data/game1");
    const data = await res.json();
    showScoreboard(data, myNick, score);
  } catch (e) {
    scoreboard.innerHTML = "<div>Error loading scores.</div>";
    scoreboard.classList.remove("hidden");
  }
}

function showScoreboard(scores, myNick, myScore) {
  // Sort by score desc
  scores = scores.slice().sort((a, b) => b.score - a.score);
  // List
  let list = "";
  let myPos = -1;
  scores.forEach((entry, i) => {
    const isMe =
      entry.nickname === myNick && entry.score === myScore && myPos === -1;
    if (isMe) myPos = i + 1;
    list += `<div class="score-row${isMe ? " me" : ""}">${i + 1}. ${
      entry.nickname
    } - ${entry.score}</div>`;
  });

  scoreboard.innerHTML = `
    <div class="scoreboard-title">High Scores</div>
    <div class="score-list">${list}</div>
    <div class="scoreboard-btns">
      <button onclick="location.reload()" class="play-again-btn">Play Again</button>
      <button onclick="window.location.href='/'" class="play-again-btn">Return to Home</button>
    </div>
  `;
  scoreboard.classList.remove("hidden");
}

// Para mostrar
element.classList.remove("hidden");
element.classList.add("fade-in");
setTimeout(() => element.classList.remove("fade-in"), 500);

// Para ocultar
element.classList.add("fade-out");
setTimeout(() => {
  element.classList.remove("fade-out");
  element.classList.add("hidden");
}, 400);
