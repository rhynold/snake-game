const playBoard = document.querySelector(".play-board");
const scoreCounter = document.querySelector(".score");
const highScoreCounter = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const overlay = document.getElementById('overlay');
const runDurationDisplay = document.querySelector(".run-duration");

let gameStarted = false;
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let myTimer;

//* Gets the highscore from local storage

let highScore = localStorage.getItem("high-score") || 0;
highScoreCounter.innerText = `High Score: ${highScore}`;

//* Assigns a random number from 1-30 as the starting food position

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleStartGame = () => {
    overlay.style.display = 'none';
    gameStarted = true;
    velocityX = 1;
    initGame();
    startTimer();
};

function startTimer() {
    let seconds = 0;
    myTimer = setInterval(function() {
        seconds++;
        runDurationDisplay.innerText = `Elapsed Time: ${seconds}`;
    }, 1000);
}

overlay.addEventListener('click', handleStartGame);

const handleGameOver = () => {
    clearInterval(setIntervalId);
    clearInterval(myTimer);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

//* Changes the velocity values based on a key press

const changeDirection = e => {
    if (gameStarted) {
        if (e.key === "ArrowUp" && velocityY != 1) {
            velocityX = 0;
            velocityY = -1;
        } else if (e.key === "ArrowDown" && velocityY != -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (e.key === "ArrowLeft" && velocityX != 1) {
            velocityX = -1;
            velocityY = 0;
        } else if (e.key === "ArrowRight" && velocityX != -1) {
            velocityX = 1;
            velocityY = 0;
        }
    }
}

//* Changes the direction of the snake on key click

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //* When the snake eats a piece of food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); //* Adds a piece of food to the snake body array
        score++;
        highScore = score >= highScore ? score : highScore; //* if score > high score => high score = score

        localStorage.setItem("high-score", highScore);
        scoreCounter.innerText = `Score: ${score}`;
        highScoreCounter.innerText = `High Score: ${highScore}`;
    }

    //* Updates the snake head
    snakeX += velocityX;
    snakeY += velocityY;

    //* Pushing forward the snake value of the body by one

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    //* Checks to see if the snake body has hit a wall or not

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    //* Adds a div for each part of the snakes body

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //* Checks to see if the head has collided with the body or not
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);