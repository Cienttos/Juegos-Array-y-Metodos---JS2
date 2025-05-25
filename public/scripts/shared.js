export function showPanel(panel) {
  panel.classList.remove("hidden");
  panel.classList.add("show");
}
export function hidePanel(panel) {
  panel.classList.add("hidden");
  panel.classList.remove("show");
}

export function showScoreboard(scoreboard, scores, myNick, myScore) {
  scores = scores.slice().sort((a, b) => b.score - a.score);
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
  setTimeout(() => {
    scoreboard.classList.add("show");
  }, 10);
}

// Envia score a un endpoint (ej: "/data/game1")
export async function sendScore(endpoint, nick, score) {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `nickname=${encodeURIComponent(nick)}&score=${score}`,
    });
  } catch (e) {}
}

// Obtiene scores de un endpoint y ejecuta callback
export async function fetchScores(endpoint, callback, myNick, myScore) {
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    callback(data, myNick, myScore);
  } catch (e) {
  }
}

// Animación LED cartel arcade
export function animateLogo(logo) {
  if (!logo) return;
  const letters = logo.querySelectorAll("span");
  let step = 0;
  let interval;
  const total = letters.length;
  const onDelay = 120;
  const holdDelay = 900;
  const offDelay = 400;

  function run() {
    letters.forEach((l) => l.classList.remove("lit"));
    step = 0;
    interval = setInterval(() => {
      if (step < total) {
        letters[step].classList.add("lit");
        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          letters.forEach((l) => l.classList.remove("lit"));
          setTimeout(run, offDelay);
        }, holdDelay);
      }
    }, onDelay);
  }
  run();
}

