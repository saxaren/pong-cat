"use strict";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
const paddleWidth = 50;
const paddleHeight = 80;
let leftPaddle = {
    x: 20,
    y: 250,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
};
let rightPaddle = {
    x: 730,
    y: 250,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
};
let ball = { x: 400, y: 300, radius: 12, dx: 4, dy: 4 };
// Ladda kattbilden
const catImage = new Image();
catImage.src = "cat.png";
const yarnImage = new Image();
yarnImage.src = "yarn.png";
function drawCat(p) {
    ctx.drawImage(catImage, p.x, p.y, p.width, p.height);
}
// function drawBall(b: Ball) {
//   ctx.beginPath();
//   ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
//   ctx.fillStyle = "white";
//   ctx.fill();
//   ctx.closePath();
// }
function drawBall(b) {
    ctx.drawImage(yarnImage, b.x - b.radius, b.y - b.radius, b.radius * 2, b.radius * 2);
}
function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    console.log(`X: ${ball.x}, Y: ${ball.y}`);
    // Väggstuds
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
    }
    // Vänster paddelträff
    if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height) {
        ball.dx *= -1;
    }
    // Höger paddelträff
    if (ball.x + ball.radius > rightPaddle.x &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height) {
        ball.dx *= -1;
    }
    // Flytta paddlar
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
    // Begränsa paddlar inom canvas
    [leftPaddle, rightPaddle].forEach((p) => {
        if (p.y < 0)
            p.y = 0;
        if (p.y + p.height > canvas.height)
            p.y = canvas.height - p.height;
    });
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCat(leftPaddle);
    drawCat(rightPaddle);
    drawBall(ball);
}
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
window.addEventListener("keydown", (e) => {
    if (e.key === "w")
        leftPaddle.dy = -5;
    if (e.key === "s")
        leftPaddle.dy = 5;
    if (e.key === "ArrowUp")
        rightPaddle.dy = -5;
    if (e.key === "ArrowDown")
        rightPaddle.dy = 5;
});
window.addEventListener("keyup", (e) => {
    if (["w", "s"].includes(e.key))
        leftPaddle.dy = 0;
    if (["ArrowUp", "ArrowDown"].includes(e.key))
        rightPaddle.dy = 0;
});
// Starta spelet när kattbilden är laddad
catImage.onload = () => {
    loop();
};
