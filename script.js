const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let score = 0;
let targets = [];
let difficulty = { speed: 2, size: 40, spawnRate: 2000 };
let gameInterval, timerInterval;
let timeLeft = 60;

function startGame(mode) {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    document.getElementById("restart-button").style.display = "none";
    
    if (mode === 'easy') difficulty = { speed: 2, size: 50, spawnRate: 2000 };
    else if (mode === 'medium') difficulty = { speed: 4, size: 30, spawnRate: 1500 };
    else if (mode === 'hard') difficulty = { speed: 6, size: 20, spawnRate: 1000 };
    
    score = 0;
    timeLeft = 60;
    document.getElementById("score").innerText = score;
    document.getElementById("timer").innerText = timeLeft;
    targets = [];
    gameInterval = setInterval(spawnTarget, difficulty.spawnRate);
    timerInterval = setInterval(updateTimer, 1000);
}

function spawnTarget() {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let dx = (Math.random() - 0.5) * difficulty.speed;
    let dy = (Math.random() - 0.5) * difficulty.speed;
    targets.push({ x, y, dx, dy, size: difficulty.size });
}

function updateTargets() {
    targets.forEach(target => {
        target.x += target.dx;
        target.y += target.dy;
        if (target.x - target.size < 0 || target.x + target.size > canvas.width) target.dx *= -1;
        if (target.y - target.size < 0 || target.y + target.size > canvas.height) target.dy *= -1;
    });
}

function updateTimer() {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    document.getElementById("restart-button").style.display = "block";
}

function restartGame() {
    location.reload();
}

canvas.addEventListener("click", (e) => {
    targets = targets.filter(target => {
        let dx = e.clientX - target.x;
        let dy = e.clientY - target.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < target.size) {
            score++;
            document.getElementById("score").innerText = score;
            return false;
        }
        return true;
    });
});

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateTargets();
    targets.forEach(target => {
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    });
    requestAnimationFrame(update);
}

update();