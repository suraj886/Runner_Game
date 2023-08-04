var gamePiece;
var obstacles=[];
var frameno = 0;
var speed = 0;
function resetGame() {
    obstacles.splice(0, obstacles.length);
    frameno = 0;
    gamePiece.x = 20;
    gamePiece.y = 200;
    gamePiece.width = 20;
    gamePiece.height = 20;
    gamePiece.speedX = 0;
    gamePiece.speedY = 0;
    speed = 0;
    clearInterval(gameArea.interval);
    // @ts-ignore
    document.getElementById("restart").style.display = "none";
    startGame();
}
window.addEventListener('keydown', (e) => {
    if (e.key == " ") resetGame();
})
function startGame() {
    gameArea.start();
    gamePiece = new component(20, 20, "black", 20, 200);
}
var gameArea = {
    canvas : document.createElement("canvas"),
    start: function () {
        this.canvas.width = window.innerWidth/2;
        this.canvas.height = window.innerHeight/2;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20); 
        this.keys = [false, false, false, false];
        window.addEventListener('keydown', (e)=> {
            if (e.key == "ArrowLeft") this.keys[0] = true;
            if (e.key == "ArrowUp") this.keys[1] = true;
            if (e.key == "ArrowRight") this.keys[2] = true;
            if (e.key == "ArrowDown") this.keys[3] = true;
        }) 
        window.addEventListener('keyup', (e) => {
            if (e.key == "ArrowLeft") this.keys[0] = false;
            if (e.key == "ArrowUp") this.keys[1] = false;
            if (e.key == "ArrowRight") this.keys[2] = false;
            if (e.key == "ArrowDown") this.keys[3] = false;
        })
    }, 
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
        const restart = document.getElementById("restart");
        // @ts-ignore
        restart.style.display = "block";
    }
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    const ctx = gameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    this.newpos = function () {
        // @ts-ignore
        this.x += this.speedX + speed;
        // @ts-ignore
        this.y += this.speedY + speed;
        // @ts-ignore
        if (this.x < 0) this.x = 0;
        // @ts-ignore
        if (this.y < 0) this.y = 0;
        // @ts-ignore
        if (this.x + this.width >= gameArea.canvas.width) this.x = gameArea.canvas.width - this.width; 
        // @ts-ignore
        if (this.y + this.height >= gameArea.canvas.height) this.y = gameArea.canvas.height - this.height; 
    }
    this.update = function() {
        const ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x , this.y , this.width, this.height);
    }
}
function hascrashed(obstacle) {
    var pieceleft = gamePiece.x;
    var pieceright = gamePiece.x + gamePiece.width;
    var piecetop = gamePiece.y;
    var piecebottom = gamePiece.y + gamePiece.height;
    
    var obstacleleft = obstacle.x;
    var obstacleright = obstacle.x + obstacle.width;
    var obstacletop = obstacle.y;
    var obstaclebottom = obstacle.y + obstacle.height;
    if (piecebottom < obstacletop || piecetop > obstaclebottom || pieceright < obstacleleft || pieceleft > obstacleright) return false;
    else return true;
}
function everyinterval(obstacle) {
    // if ((n / 150) % 1 == 0) return true;
    // return false;
    var x = gameArea.canvas.width;
    if (x - obstacle.x > 150) return true;
}
function increaseSpeed(n) {
    if ((n / 150) % 1 == 0) return true;
    return false;
}
function updateGameArea() {
    for (var i = 0; i < obstacles.length; i += 1) if (hascrashed(obstacles[i])) { gameArea.stop(); return; }
    gameArea.clear();
    if (gameArea.keys[0] == true || gameArea.keys[2]) {
        if (gameArea.keys[2]) gamePiece.speedX = 1+speed;
        else gamePiece.speedX = -1-speed;
    } else {
        gamePiece.speedX = 0;
    }
    if (gameArea.keys[1] == true || gameArea.keys[3]) {
        if (gameArea.keys[1]) gamePiece.speedY = -1-speed;
        else gamePiece.speedY = 1+speed;
    } else {
        gamePiece.speedY = 0;
    }
    if (frameno == 0 || everyinterval(obstacles[obstacles.length-1])) {
        var x = gameArea.canvas.width;
        var y = gameArea.canvas.height;
        var mingap = 100;
        var maxgap = 200;
        var gap = Math.floor(Math.random() * (maxgap - mingap + 1) + mingap);
        var height = Math.floor(Math.random() * (y - gap + 1) );
        obstacles.push(new component(10, height, "white", x, 0));
        obstacles.push(new component(10, y-height-gap, "white", x, height + gap));
    }
    if (increaseSpeed(frameno)) {
        speed += 0.02;
    }
    for (var i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x -= (1+speed);
        obstacles[i].update();
    }
    gamePiece.newpos();
    gamePiece.update();
    frameno += 1;
    const score = document.getElementById("score");
    // @ts-ignore
    score.innerHTML =  frameno.toString();
}