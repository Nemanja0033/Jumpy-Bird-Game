const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let birdImg = new Image();
birdImg.src = '/assets/img/bird.png'; 
let pipeImg = new Image();
pipeImg.src = '/assets/img/pipe.png'; 
let bird = { x: 50, y: 150, speedY: 0 };
let obstacles = [];
let isGameOver = false;
let score = 0;
let gameStarted = false;
canvas.width = 900;
canvas.height = 500;
const flapSound = new Audio('../assets/sounds/flap.mp3');
const crashSound = new Audio('../assets/sounds/crash.mp3');
const scoreSound = new Audio('../assets/sounds/score.mp3');
const themeSound = new Audio('../assets/theme/theme.mp3');
birdImg.onload = function() {
    update();
};

function drawMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '30px "Tiny5", sans-serif';
    ctx.fillText('Press space to start', canvas.width / 2 - 100, canvas.height / 2);
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, 60, 60);
}

function drawObstacles() {
    obstacles.forEach(function(obstacle) {
        ctx.drawImage(pipeImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

}

function createObstacle() {
    const obstacleHeight = Math.floor(Math.random() * 100) + 50;
    const obstacleGap = 210;
    const obstacle = { x: canvas.width, y: 0, width: 60, height: obstacleHeight };
    const obstacle2 = { x: canvas.width, y: obstacleHeight + obstacleGap, width: 60, height: canvas.height - obstacleHeight - obstacleGap };
    obstacles.push(obstacle, obstacle2);
}

function checkCollision() {
    obstacles.forEach(function(obstacle) {
        if (bird.x < obstacle.x + obstacle.width && bird.x + 40 > obstacle.x && bird.y < obstacle.y + obstacle.height && bird.y + 40 > obstacle.y) {
            isGameOver = true;
            crashSound.play();
        }
    });
    if (bird.y <= 0 || bird.y + 40 >= canvas.height) {
        isGameOver = true;
        crashSound.currentTime = 1;
        crashSound.play();
    }
}

function update() {
    if (!gameStarted) {
        drawMenu();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!isGameOver) {
            drawBird();
            drawObstacles();
            bird.y += bird.speedY;
            bird.speedY += 0.1;
            if (Math.random() < 0.01) {
                createObstacle();
            }
            obstacles.forEach(function(obstacle) {
                obstacle.x -= 2;
                if (obstacle.x === bird.x) {
                    score++;
                    scoreSound.currentTime = 0;
                    scoreSound.play();
                }
            });
            checkCollision();
        }
        if (isGameOver) {
            ctx.fillStyle = 'red';
            ctx.font = '30px  "Tiny5", sans-serif';
            ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
            ctx.fillText('Score: ' + score, canvas.width / 2 - 60, canvas.height / 2 + 30);
            ctx.fillText('Press F5 to restart', canvas.width / 2 - 120, canvas.height / 2 + 60);
        } else {
            ctx.fillStyle = 'black';
            ctx.font = '40px Tiny5", sans-serif';
            ctx.fillText('Score: ' + score, 390, 490);
        }
    }
    requestAnimationFrame(update);
}

document.addEventListener('keydown', function() {
    if (!gameStarted) {
        gameStarted = true;
        requestAnimationFrame(update);
        themeSound.currentTime = 0;
        themeSound.play();
    }
    if (!isGameOver) {
        bird.speedY = -3.5; 
        flapSound.currentTime = 0;
        flapSound.play();
    }
});

// Start the game loop
update();