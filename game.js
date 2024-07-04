// Game Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 300;
const GROUND_HEIGHT = 20;
const DINO_WIDTH = 60;
const DINO_HEIGHT = 60;
const GRAVITY = 0.6;
const JUMP_FORCE = 11;
const MAX_OBSTACLE_COUNT = 3;
const CACTUS_WIDTH = 20;
const CACTUS_HEIGHT = 50;
const MIN_CACTUS_GAP = 200;
const MAX_CACTUS_GAP = 400;
const GAME_SPEED = 6;

// Canvas and Context
let canvas;
let ctx;

// Game Variables
let dino;
let ground;
let obstacles = [];
let score = 0;
let highScore = 0;
let gameSpeed = GAME_SPEED;
let isGameOver = false;
let isJumping = false;

// Load game
document.addEventListener("DOMContentLoaded", function() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  resetGame();

document.addEventListener("keydown", function(event) {
  if ((event.code === "Space" || event.code === "ArrowUp") && !isJumping && !isGameOver) {
    dino.jump();
    isJumping = true;
  } else if (event.code === "Enter" && isGameOver) {
    resetGame();
    isGameOver = false; // Ajout pour réinitialiser le jeu
    update(); // Appel pour redémarrer le jeu
  }
  });

  update();
});

function resetGame() {
  dino = new Dino();
  ground = new Ground();
  obstacles = [];
  score = 0;
  isGameOver = false;
  isJumping = false;
}

function update() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (!isGameOver) {
    handleObstacles();
    dino.update();
    ground.draw();
    drawScore();

    if (checkCollision()) {
      gameOver();
    }

    if (obstacles.length < MAX_OBSTACLE_COUNT && Math.random() < 0.01) {
      let gap = MIN_CACTUS_GAP + Math.random() * (MAX_CACTUS_GAP - MIN_CACTUS_GAP);
      obstacles.push(new Cactus(CANVAS_WIDTH + gap));
    }

    score++;
    gameSpeed += 0.002;

    requestAnimationFrame(update);
  } else {
    drawGameOver();
  }
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "16px Arial";
  ctx.fillText(`Score: ${score}`, CANVAS_WIDTH - 100, 20);
  ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH - 100, 40);
}

function drawGameOver() {
  ctx.fillStyle = "#000";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", CANVAS_WIDTH / 2 - 80, CANVAS_HEIGHT / 2 - 15);
  ctx.font = "16px Arial";
  ctx.fillText("Press Enter to Play Again", CANVAS_WIDTH / 2 - 120, CANVAS_HEIGHT / 2 + 15);
}

function handleObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();

    if (obstacles[i].x + CACTUS_WIDTH < 0) {
      obstacles.splice(i, 1);
    }
  }
}

function checkCollision() {
  for (let obstacle of obstacles) {
    if (dino.x < obstacle.x + CACTUS_WIDTH &&
        dino.x + DINO_WIDTH > obstacle.x &&
        dino.y < obstacle.y + CACTUS_HEIGHT &&
        dino.y + DINO_HEIGHT > obstacle.y) {
      return true;
    }
  }
  return false;
}

function gameOver() {
  isGameOver = true;
  if (score > highScore) {
    highScore = score;
  }
  gameSpeed = GAME_SPEED;
}

class Dino {
  constructor() {
    this.x = 50;
    this.y = CANVAS_HEIGHT - GROUND_HEIGHT - DINO_HEIGHT;
    this.width = DINO_WIDTH;
    this.height = DINO_HEIGHT;
    this.velocityY = 0;
  }

  jump() {
    this.velocityY = -JUMP_FORCE;
  }

  update() {
    this.velocityY += GRAVITY;
    this.y += this.velocityY;

    if (this.y > CANVAS_HEIGHT - GROUND_HEIGHT - DINO_HEIGHT) {
      this.y = CANVAS_HEIGHT - GROUND_HEIGHT - DINO_HEIGHT;
      this.velocityY = 0;
      isJumping = false;
    }

    this.draw();
  }

  draw() {
    ctx.fillStyle = "#666";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Ground {
  constructor() {
    this.x = 0;
    this.y = CANVAS_HEIGHT - GROUND_HEIGHT;
    this.width = CANVAS_WIDTH;
    this.height = GROUND_HEIGHT;
    this.dx = -gameSpeed;
  }

  draw() {
    this.x += this.dx;

    if (this.x <= -CANVAS_WIDTH) {
      this.x += CANVAS_WIDTH;
    }

    ctx.fillStyle = "#999";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "#666";
    ctx.fillRect(this.x + this.width, this.y, this.width, this.height);
  }
}

class Cactus {
  constructor(x) {
    this.x = x;
    this.y = CANVAS_HEIGHT - GROUND_HEIGHT - CACTUS_HEIGHT;
    this.width = CACTUS_WIDTH;
    this.height = CACTUS_HEIGHT;
    this.dx = -gameSpeed;
  }

  update() {
    this.x += this.dx;
    this.draw();
  }

  draw() {
    ctx.fillStyle = "#666";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
