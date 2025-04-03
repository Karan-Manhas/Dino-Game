const dino = document.getElementById("dino");
const rock = document.getElementById("rock");
const scoreElement = document.getElementById("score-value");
const levelElement = document.getElementById("level-value");
const startBtn = document.getElementById("start-btn");

let score = 0;
let level = 1;
let jumpCount = 0;
let gameRunning = false;
let gameLoopId = null;

const jumpDuration = 500;
let rockSpeed = 1.33; // Seconds

function jump() {
  if (dino.classList.contains("jump-animation")) return;

  dino.classList.add("jump-animation");
  setTimeout(() => dino.classList.remove("jump-animation"), jumpDuration);

  jumpCount++;

  if (jumpCount % 5 === 0) {
    levelUp();
  }
}

function levelUp() {
  level++;
  levelElement.innerText = level;

  // Increase rock speed (decrease duration)
  rockSpeed = Math.max(0.5, rockSpeed - 0.1); // minimum speed
  rock.style.animation = `rock ${rockSpeed}s linear infinite`;
}

function updateScore() {
  score++;
  scoreElement.innerText = score;
}

function detectCollision(dinoTop, rockLeft) {
  return rockLeft < 50 && rockLeft > 0 && dinoTop > 150;
}

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(gameLoopId);
  alert(`Game Over!\nScore: ${score}\nLevel: ${level}\n\nPlay again?`);
  location.reload();
}

function gameLoop() {
  if (!gameRunning) return;

  const dinoTop = parseInt(getComputedStyle(dino).getPropertyValue("top"));
  const rockLeft = parseInt(getComputedStyle(rock).getPropertyValue("left"));

  updateScore();

  rock.style.display = rockLeft < 0 ? "none" : "";

  if (detectCollision(dinoTop, rockLeft)) {
    endGame();
    return;
  }

  gameLoopId = requestAnimationFrame(gameLoop);
}

document.addEventListener("keypress", () => {
  if (gameRunning) jump();
});

startBtn.addEventListener("click", () => {
  if (!gameRunning) {
    rock.style.animation = `rock ${rockSpeed}s linear infinite`;
    gameRunning = true;
    score = 0;
    level = 1;
    jumpCount = 0;
    scoreElement.innerText = score;
    levelElement.innerText = level;
    startBtn.style.display = "none";
    gameLoop();
  }
});
