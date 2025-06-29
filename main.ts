const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
let leftScore = 0;
let rightScore = 0;

const catIcon = new Image();
catIcon.src = "cat2.png";

const backgroundImage = new Image();
backgroundImage.src = "parralax_1.png";

canvas.width = 1280;
canvas.height = 800;

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  dy: number;
}

interface Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
}

const paddleWidth = 50;
const paddleHeight = 80;

let leftPaddle: Paddle = {
  x: 20,
  y: (canvas.height - paddleHeight) / 2,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0,
};
let rightPaddle: Paddle = {
  x: canvas.width - paddleWidth - 20,
  y: (canvas.height - paddleHeight) / 2, // centrera vertikalt om du vill,
  width: paddleWidth,
  height: paddleHeight,
  dy: 0,
};

let ball: Ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 12,
  dx: 4,
  dy: 4,
};

// Ladda kattbilden
const catImage = new Image();
catImage.src = "cat.png";

const yarnImage = new Image();
yarnImage.src = "yarn.png";

function drawCat(p: Paddle) {
  ctx.drawImage(catImage, p.x, p.y, p.width, p.height);
}

function drawBall(b: Ball) {
  ctx.drawImage(
    yarnImage,
    b.x - b.radius,
    b.y - b.radius,
    b.radius * 2,
    b.radius * 2
  );
}

let imagesLoaded = 0;

function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 4) {
    loop();
  }
}

catImage.onload = checkImagesLoaded;
yarnImage.onload = checkImagesLoaded;
catIcon.onload = checkImagesLoaded;
backgroundImage.onload = checkImagesLoaded;

function update() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  console.log(`X: ${ball.x}, Y: ${ball.y}`);

  // Väggstuds
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.dy *= -1;
  }

  // Vänster paddelträff
  if (
    ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
    ball.y > leftPaddle.y &&
    ball.y < leftPaddle.y + leftPaddle.height
  ) {
    ball.dx *= -1;
  }

  // Höger paddelträff
  if (
    ball.x + ball.radius > rightPaddle.x &&
    ball.y > rightPaddle.y &&
    ball.y < rightPaddle.y + rightPaddle.height
  ) {
    ball.dx *= -1;
  }

  // Flytta paddlar
  leftPaddle.y += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  // Begränsa paddlar inom canvas
  [leftPaddle, rightPaddle].forEach((p) => {
    if (p.y < 0) p.y = 0;
    if (p.y + p.height > canvas.height) p.y = canvas.height - p.height;
  });

  // Om bollen åker utanför vänster sida
  if (ball.x + ball.radius < 0) {
    rightScore++;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4;
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
  }

  // Om bollen åker utanför höger sida
  if (ball.x - ball.radius > canvas.width) {
    leftScore++;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -4;
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rita bakgrund
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  drawCat(leftPaddle);
  drawCat(rightPaddle);
  drawBall(ball);

  // Rita en bakgrundsplatta bakom poängen
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(canvas.width / 2 - 60, 10, 120, 40);

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`${leftScore} - ${rightScore}`, canvas.width / 2 - 30, 30);

  // Rita vänster spelares kattikoner
  for (let i = 0; i < leftScore; i++) {
    ctx.drawImage(catIcon, 20 + i * 30, 10, 24, 24);
  }

  // Rita höger spelares kattikoner
  for (let i = 0; i < rightScore; i++) {
    ctx.drawImage(catIcon, canvas.width - (i + 1) * 30 - 24, 10, 24, 24);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "w") leftPaddle.dy = -5;
  if (e.key === "s") leftPaddle.dy = 5;
  if (e.key === "ArrowUp") rightPaddle.dy = -5;
  if (e.key === "ArrowDown") rightPaddle.dy = 5;
});

window.addEventListener("keyup", (e) => {
  if (["w", "s"].includes(e.key)) leftPaddle.dy = 0;
  if (["ArrowUp", "ArrowDown"].includes(e.key)) rightPaddle.dy = 0;
});

// Starta spelet när kattbilden är laddad
// catImage.onload = () => {
//   loop();
// };

catImage.onload = checkImagesLoaded;
yarnImage.onload = checkImagesLoaded;
catIcon.onload = checkImagesLoaded;
