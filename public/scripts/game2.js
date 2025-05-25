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

  // Panel 2: Game
  const tttGame = document.createElement("div");
  tttGame.id = "tictac-game";
  tttGame.className = "tictac-panel hidden";
  tttGame.innerHTML = `
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
      <button id="next-round-btn" class="play-again-btn" style="display: none">Next Round</button>
      <button id="end-game-btn" class="play-again-btn">End Game</button>
    </div>
  `;

  // Panel 3: Scoreboard
  const scoreboard = document.createElement("div");
  scoreboard.id = "scoreboard";
  scoreboard.className = "scoreboard hidden";

  // Add panels to DOM
  mainContent.appendChild(nicknameForm);
  mainContent.appendChild(tttGame);
  mainContent.appendChild(scoreboard);

  // Element references
  const input1 = nicknameForm.querySelector("#nickname-input-1");
  const input2 = nicknameForm.querySelector("#nickname-input-2");
  const label1 = nicknameForm.querySelector("#label-player1");
  const label2 = nicknameForm.querySelector("#label-player2");
  const inputGroup2 = nicknameForm.querySelector("#input-group-2");
  const startBtn = nicknameForm.querySelector("#start-btn");
  const tttBoard = tttGame.querySelector("#tictac-board");
  const tttStatus = tttGame.querySelector("#tictac-status");
  const scoreP1 = tttGame.querySelector("#score-p1");
  const scoreP2 = tttGame.querySelector("#score-p2");
  const nextRoundBtn = tttGame.querySelector("#next-round-btn");
  const endGameBtn = tttGame.querySelector("#end-game-btn");

  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") || "pve";

  // Show/hide second input and label based on mode
  if (mode === "pvp") {
    label1.textContent = "Player 1";
    label2.textContent = "Player 2";
    label2.style.display = "";
    input2.style.display = "";
    inputGroup2.style.display = "";
    input2.required = true;
  } else {
    label2.style.display = "none";
    input2.style.display = "none";
    inputGroup2.style.display = "none";
    input2.required = false;
  }

  function showNicknameForm() {
    showPanel(nicknameForm);
    hidePanel(tttGame);
    hidePanel(scoreboard);
  }
  showNicknameForm();

  let names = ["Player 1", "Player 2"];
  let scores = [0, 0];
  let board = Array(9).fill("");
  let turn = 0;
  let playing = false;

  function resetBoard() {
    board = Array(9).fill("");
    Array.from(tttBoard.children).forEach((cell) => {
      cell.textContent = "";
      cell.disabled = false;
    });
    tttStatus.textContent = `Turn: ${names[turn]}`;
    nextRoundBtn.style.display = "none";
    playing = true;
    if (mode === "pve" && turn === 1) {
      tttStatus.textContent = `Turn: ${names[1]}`;
      setTimeout(cpuMove, 600);
    }
  }

  function checkWinner() {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of wins) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    if (board.every((cell) => cell)) return "draw";
    return null;
  }

  function cpuMove() {
    if (!playing) return;
    const empty = board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
    if (empty.length) {
      const idx = empty[Math.floor(Math.random() * empty.length)];
      setTimeout(() => handleCellClick(idx, true), 400);
    }
  }

  function handleCellClick(idx, isCPU = false) {
    if (!playing || board[idx]) return;
    if (mode === "pve" && turn === 1 && !isCPU) return;
    board[idx] = turn === 0 ? "X" : "O";
    tttBoard.children[idx].textContent = board[idx];
    tttBoard.children[idx].disabled = true;
    const winner = checkWinner();
    if (winner) {
      playing = false;
      if (winner === "draw") {
        tttStatus.textContent = "Draw!";
      } else {
        const winnerIdx = winner === "X" ? 0 : 1;
        scores[winnerIdx]++;
        tttStatus.textContent = `Winner: ${names[winnerIdx]}`;
      }
      scoreP1.textContent = scores[0];
      scoreP2.textContent = scores[1];
      nextRoundBtn.style.display = "";
    } else {
      turn = 1 - turn;
      tttStatus.textContent = `Turn: ${names[turn]}${
        mode === "pve" && turn === 1 ? "" : ""
      }`;
      if (mode === "pve" && turn === 1) cpuMove();
    }
  }

  Array.from(tttBoard.children).forEach((cell, idx) => {
    cell.addEventListener("click", () => handleCellClick(idx));
  });

  nicknameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      input1.value.trim() === "" ||
      (mode === "pvp" && input2.value.trim() === "")
    ) {
      nicknameForm.classList.add("shake");
      setTimeout(() => nicknameForm.classList.remove("shake"), 400);
      return;
    }
    names[0] = input1.value.trim() || "Player 1";
    names[1] = mode === "pvp" ? input2.value.trim() || "Player 2" : "CPU";
    scores = [0, 0];
    scoreP1.textContent = scores[0];
    scoreP2.textContent = scores[1];
    turn = 0;
    hidePanel(nicknameForm);
    showPanel(tttGame);
    hidePanel(scoreboard);
    resetBoard();
  });

  input1.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startBtn.click();
  });

  input2.addEventListener("keydown", (e) => {
    if (e.key === "Enter") startBtn.click();
  });

  nextRoundBtn.addEventListener("click", () => {
    turn = 0;
    resetBoard();
  });

  endGameBtn.addEventListener("click", () => {
    hidePanel(tttGame);
    let winner =
      scores[0] > scores[1]
        ? names[0]
        : scores[1] > scores[0]
        ? names[1]
        : "Draw";
    let winnerScore = Math.max(scores[0], scores[1]);
    if (winner !== "Draw" && winnerScore > 0) {
      sendScore("/data/game2", winner, winnerScore).then(() => {
        fetchScores(
          "/data/game2",
          (data) => showScoreboard(scoreboard, data, winner, winnerScore),
          winner,
          winnerScore
        );
      });
    } else {
      showScoreboard(scoreboard, [], "", 0);
    }
  });

  animateLogo(document.getElementById("arcadeLogo"));
});
