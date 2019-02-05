var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var targetColor;

class Ball {
    constructor(x, y, vx, vy, radius){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = randomColor();
    };
}

class Bucket {
    constructor(x, y, w, h, hx, hy){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.hx = hx;
        this.hy = hy;
        this.color = randomColor();
        this.key = false;
        this.catched = false;
    }
}

function init(){
    ball1 = new Ball (canvas.width/4, 50, 0, 3, 50);
    ball2 = new Ball (canvas.width/4*2, -36, 0, 3, 50);
    ball3 = new Ball (canvas.width/4*3, -72, 0, 3, 50);
    
    targetColor = returnTargetColor([ball1.color, ball2.color, ball3.color]);
    
    bucket = new Bucket (10, canvas.height-110, 100, 100, 3, 0);

    window.addEventListener('keydown', function (e) {
        bucket.key = e.keyCode;
    });
    window.addEventListener('keyup', function (e) {
        bucket.key = false;
    });
}


function returnRGB(color){
    return "rgb(" + color.r + ", "+color.g + ", " + color.b + ")";
}

function randomColor(){
    var r= Math.floor(Math.random()*256);
    var g= Math.floor(Math.random()*256);
    var b= Math.floor(Math.random()*256);
    return {r: r, g: g, b: b};
}

function returnTargetColor(colors){
    var mixElem = [];
    var pickedElem; //to compare the mixElem with a new random element
    mixElem.push(Math.floor(Math.random()*3)); //get a random element between 0 and 2 and that will be the first color to mix
    while(mixElem.length<2){ //will loop while we have only 1 color to mix (random function may generate again the number we already picked)
        pickedElem = Math.floor(Math.random()*3);
        if(pickedElem != mixElem[0]){  //if the new random number is not the same than the one we had (mixElem) then keep it
            mixElem.push(pickedElem)
        }
    }
    console.log('mixElem' + mixElem);
    // mix the 2 elements (mixElem) and return the mixed color
    return {r: (colors[mixElem[0]].r)*0.5+(colors[mixElem[1]].r)*0.5, g: (colors[mixElem[0]].g)*0.5+(colors[mixElem[1]].g)*0.5, b: (colors[mixElem[0]].b*0.5)+(colors[mixElem[1]].b)*0.5};
}

function drawBubble(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, true);
    ctx.closePath();
    //ctx.fillStyle = ball.color;
    ctx.fillStyle = returnRGB(ball.color);
    ctx.fill();
    ball.x += ball.vx;
    ball.y += ball.vy;
    return ball;
}

function drawBucket() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(bucket.x, bucket.y, bucket.w, bucket.h);
    ctx.fillStyle = returnRGB(bucket.color);
    ctx.fillRect(bucket.x+10, bucket.y+10, bucket.w-20, bucket.h-20);
}

function mixColor(c1, c2){
    var mixedColor =  {r: c1.r*0.5+c2.r*0.5, g: c1.g*0.5+c2.g*0.5, b: c1.b*0.5+c2.b*0.5};
    console.log('color 1' + c1 + 'combined with' + c2 + 'is ' + mixedColor);
    return mixedColor;
}

function animateBubbleAndBucket() {
    //check if ball1 crashes with the bucket
    if((ball1.y > bucket.y) && (ball1.x+30 > bucket.x && ball1.x-20 < bucket.x+100)){
        ball1.y = 50;
        if(!bucket.catched){
            bucket.color = ball1.color;
            bucket.catched = true;
        } else {
            bucket.color = mixColor (bucket.color, ball1.color);
            console.log('ball1 bucket'+bucket.color);
        }
    } else if (ball1.y + ball1.vy > canvas.height) {
        ball1.y = 50;
    }
    //check if ball2 crashes with the bucket
    if((ball2.y > bucket.y) && (ball2.x+30 > bucket.x && ball2.x-20 < bucket.x+100)){
        ball2.y = 50;
        if(!bucket.catched){
            bucket.color = ball2.color;
            bucket.catched = true;
        } else {
            bucket.color = mixColor (bucket.color, ball2.color);
            console.log('ball2 bucket'+bucket.color);
        }
    } else if (ball2.y + ball2.vy > canvas.height) {
        ball2.y = 50;
    }

    if((ball3.y > bucket.y) && (ball3.x+30 > bucket.x && ball3.x-20 < bucket.x+100)){
        ball3.y = 50;
        if(!bucket.catched){
            bucket.color = ball3.color;
            bucket.catched = true;
        } else {
            bucket.color = mixColor (bucket.color, ball3.color);
            console.log('ball3 bucket'+bucket.color);
        }
    } else if (ball3.y + ball3.vy > canvas.height) {
        ball3.y = 50;
    }

    //if left arrow is pushed down move box to the left if it is not already on the left margin
    if (bucket.key && bucket.key == 37) {
        if((bucket.x - bucket.hx) > 10)
            bucket.x -= bucket.hx; 
    }
    //if right arrow is pushed down move box to the right if it is not already on the right margin
    if (bucket.key && bucket.key == 39) {
        if((bucket.x + bucket.w + bucket.hx) < canvas.width)
            bucket.x += bucket.hx; 
    }
    ctx.fillStyle = returnRGB(targetColor);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.clearRect(0,0, canvas.width, canvas.height);

    ball1 = drawBubble(ball1);

    ball2 = drawBubble(ball2);

    ball3 = drawBubble(ball3);

    drawBucket();

    window.requestAnimationFrame(animateBubbleAndBucket);
}

init();
animateBubbleAndBucket();

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