/** @type {CanvasRenderingContext2D} */
var dy = 0;
var dx = 10;
const board_border = "black";
const board_background = "white";
const snake_col = "lightblue";
const snake_border = "darkblue";
var foodX = 0;
var foodY = 0;
let score = 0;
let GAME_SPEED = 100;

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

let snake = [
  { x: 200, y: 200 },
  { x: 190, y: 200 },
  { x: 180, y: 200 },
  { x: 170, y: 200 },
  { x: 160, y: 200 },
];

let snakeFood = [{ x: 0, y: 0 }];
const snakeboard = document.getElementById("snakeboard");
// Return a two dimensional drawing context
const snakeboard_ctx = snakeboard.getContext("2d");

main();
createFood();

function main() {
  // If the game ended return early to stop game
  if (didGameEnd()) return;
  document.addEventListener("keydown", snake_Controls);
  document.getElementById("score_Board").innerHTML = score;

  setTimeout(function onTick() {
    clearCanvas();
    move_snake();
    drawSnake();
    drawFood();

    // Call game again
    main();
  }, GAME_SPEED);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
  // Set the colour of the snake part
  snakeboard_ctx.fillStyle = snake_col;
  // Set the border colour of the snake part
  snakeboard_ctx.strokestyle = snake_border;
  // Draw a "filled" rectangle to represent the snake part at the coordinates
  // the part is located
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  // Draw a border around the snake part
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function clearCanvas() {
  snakeboard_ctx.fillStyle = "white";
  snakeboard_ctx.strokestyle = "black";
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function snake_Controls(event) {
  const leftKey = 37;
  const rightKey = 39;
  const upKey = 38;
  const downKey = 40;

  const keyPressed = event.keyCode;
  const isGoingUp = dy === 10;
  const isGoingDown = dy === -10;
  const isGoingRight = dx === 10;
  const isGoingLeft = dx === -10;

  if (keyPressed === leftKey && !isGoingRight) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === rightKey && !isGoingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === downKey && !isGoingUp) {
    dx = 0;
    dy = 10;
  }
  if (keyPressed === upKey && !isGoingDown) {
    dx = 0;
    dy = -10;
  }
}

function createFood() {
  foodX = randomTen(0, snakeboard.width - 10);
  foodY = randomTen(0, snakeboard.height - 10);
  snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY;
    if (foodIsOnSnake) createFood();
  });
}
function drawFood() {
  snakeboard_ctx.fillStyle = "red";
  snakeboard_ctx.strokestyle = "darkred";
  snakeboard_ctx.fillRect(foodX, foodY, 10, 10);
  snakeboard_ctx.strokeRect(foodX, foodY, 10, 10);
}

function move_snake() {
  // Create the new Snake's head
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  // Add the new head to the beginning of snake body
  snake.unshift(head);
  const didEatFood = foodX == head.x && foodY == head.y;
  if (didEatFood) {
    createFood();
    score += 100;
    document.getElementById("score_Board").innerHTML = score;
  } else {
    snake.pop();
  }
}

function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }

  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 10;

  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}
