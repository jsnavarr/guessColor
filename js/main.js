var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

class Ball {
    constructor(x, y, vx, vy, radius, color){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
    };
}

class Bucket {
    constructor(x, y, w, h, hx, hy, color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.hx = hx;
        this.hy = hy;
        this.color = color;
        this.key = false;
    }
}

ball1 = new Ball (canvas.width/4, 50, 0, 3, 50, 'blue');
ball2 = new Ball (canvas.width/4*2, -36, 0, 3, 50, 'red');
ball3 = new Ball (canvas.width/4*3, -72, 0, 3, 50, 'yellow');

bucket = new Bucket (10, canvas.height-110, 100, 100, 3, 0, 'pink');

window.addEventListener('keydown', function (e) {
    bucket.key = e.keyCode;
});
window.addEventListener('keyup', function (e) {
    bucket.key = false;
});

function drawBubble(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = ball.color;
    ctx.fill();
    ball.x += ball.vx;
    ball.y += ball.vy;
    return ball;
}

function drawBucket() {
    // ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(bucket.x, bucket.y, bucket.w, bucket.h);
    ctx.fillStyle = bucket.color;
    ctx.fillRect(bucket.x+10, bucket.y+10, bucket.w-20, bucket.h-20);

    // ctx.closePath();
    
    // ctx.fill();
    // bucket.x += bucket.hx;
    // bucket.y += bucket.hy;
}

function animateBubble() {
    if (ball1.y + ball1.vy > canvas.height) {
        // ball1.vy = 3;
        ball1.y = 50;
    }
    if (ball2.y + ball2.vy > canvas.height) {
        // ball2.vy = 3;
        ball2.y = 50;
    }
    if (ball3.y + ball3.vy > canvas.height) {
        // ball3.vy = 3;
        ball3.y = 50;
    }

    ctx.clearRect(0,0, canvas.width, canvas.height);

    ball1 = drawBubble(ball1);

    ball2 = drawBubble(ball2);

    ball3 = drawBubble(ball3);

    window.requestAnimationFrame(animateBubble);
}

function animateBucket() {
    if (bucket.key && bucket.key == 37) {
        if((bucket.x - bucket.hx) > 10)
            bucket.x -= bucket.hx; 
    }
    if (bucket.key && bucket.key == 39) {
        if((bucket.x + bucket.w + bucket.hx) < canvas.width)
            bucket.x += bucket.hx; 
    }
    // if (bucket.key && bucket.key == 38) {myGamePiece.speedY = -1; }
    // if (bucket.key && bucket.key == 40) {myGamePiece.speedY = 1; }

    ctx.clearRect(0,0, canvas.width, canvas.height);

    drawBucket();

    window.requestAnimationFrame(animateBucket);
}

animateBubble();

// drawBucket();
// animateBucket();


// function drawCircles() {
//     var ctx = document.getElementById('myCanvas').getContext('2d');
//     for (var i = 0; i < 6; i++) {
//       for (var j = 0; j < 6; j++) {
//         ctx.strokeStyle = 'rgb(0, ' + Math.floor(255 - 42.5 * i) + ', ' + 
//                          Math.floor(255 - 42.5 * j) + ')';
//         ctx.beginPath();
//         ctx.arc(12.5 + j * 25, 12.5 + i * 25, 10, 0, Math.PI * 2, true);
//         ctx.stroke();
//       }
//     }
//   }

//   function drawRect() {
//     var ctx = document.getElementById('myCanvas').getContext('2d');
//     for (var i = 0; i < 6; i++) {
//       for (var j = 0; j < 6; j++) {
//         ctx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * i) + ', ' +
//                          Math.floor(255 - 42.5 * j) + ', 0)';
//         ctx.fillRect(j * 25, i * 25, 25, 25);
//       }
//     }
//   }

//   function drawOneCircle() {
//     var ctx = document.getElementById('myCanvas').getContext('2d'); 
//     ctx.beginPath(); 
//     ctx.arc(50, 50, 30, 0, Math.PI * 2, true);
//     ctx.arc(50, 50, 15, 0, Math.PI * 2, true);
//     ctx.fill('evenodd');
//   }

//   function drawHeart() {
//     var canvas = document.getElementById('myCanvas');
//     if (canvas.getContext) {
//       var ctx = canvas.getContext('2d');
  
//       // Cubic curves example
//       ctx.beginPath();
//       ctx.moveTo(75, 40);
//       ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
//       ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
//       ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
//       ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
//       ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
//       ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
//       ctx.fill();
//     }
//   }