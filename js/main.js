var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var targetColor;

var raf;

class Player {
    constructor(points){
        this.points = points;
    }
}

class Game {
    constructor(timeToReset){
        this.timeToReset = timeToReset;
        this.match = false;
    }
    pauseGame (timeToPause){
        clearInterval(myTimer);
        // window.cancelAnimationFrame(raf);
        setTimeout(function() {
            init();
            myTimer = setInterval(init, game.timeToReset*1000);
            console.log('winner');
            console.log('points '+player.points);
            console.log('game was paused');
        }, timeToPause*1000);
    }
}

player = new Player (11);

game = new Game(20, false);

bucket = null;

var myTimer;
class Ball {
    constructor(x, y, vx, vy, radius){
        this.x = x;
        this.y= -(Math.floor(Math.random()*250))+60;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = randomColor();
        this.border = reverseColor(this.color);
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
        this.color = {r: 255, g: 255, b: 255};
        this.border = reverseColor(targetColor);
        console.log(this.border);
        this.key = false;
        this.catched = false;
        this.bubblesCatched = [];
    }
}

function init(){
    ball1 = new Ball (canvas.width/4, 50, 0, 3, 60);
    ball2 = new Ball (canvas.width/4*2, -36, 0, 3, 60);
    ball3 = new Ball (canvas.width/4*3, -72, 0, 3, 60);
    
    targetColor = returnTargetColor([ball1.color, ball2.color, ball3.color]);

    if (bucket == null) {
        bucket = new Bucket (10, canvas.height-130, 120, 120, 3, 0);
    } else {
        bucket.color = {r: 255, g: 255, b: 255};
        bucket.border = reverseColor(targetColor);
        bucket.catched = false;
        bucket.bubblesCatched = [];
    }
    if (!game.match){
        player.points-=1;
        console.log('points '+player.points);
    } else {
        game.match = false;
    }

    window.addEventListener('keydown', function (e) {
        bucket.key = e.keyCode;
    });
    window.addEventListener('keyup', function (e) {
        bucket.key = false;
    });
}

//gets an object {r: , g: , b: } and return a string as the actual RGB style
function returnRGB(color){
    return "rgb(" + color.r + ", "+color.g + ", " + color.b + ")";
}

//generate random colors for each RGB element
function randomColor(){
    var r= Math.floor(Math.random()*256);
    var g= Math.floor(Math.random()*256);
    var b= Math.floor(Math.random()*256);
    return {r: r, g: g, b: b};
}

//returns the target color which is made of the color of 2 bubbles randomly selected
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
    console.log('Bubble ' + (mixElem[0]+1) + ' and bubble ' + (mixElem[1]+1));
    // mix the 2 elements (mixElem) and return the mixed color
    return {r: (colors[mixElem[0]].r)*0.5+(colors[mixElem[1]].r)*0.5, g: (colors[mixElem[0]].g)*0.5+(colors[mixElem[1]].g)*0.5, b: (colors[mixElem[0]].b*0.5)+(colors[mixElem[1]].b)*0.5};
}

//draw the bubble in the parameter
function drawBubble(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, true);
    ctx.fillStyle = returnRGB(ball.border);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius-5, 0, Math.PI*2, true);
    ctx.fillStyle = returnRGB(ball.color);
    ctx.fill();
    ball.x += ball.vx;
    ball.y += ball.vy;
    return ball;
}

// returns kind of the reverse color adding or substracting 100 to each RGB value
function reverseColor (color){
    reversedColor = {};
    if(color.r <100) {
        reversedColor.r = color.r+100;
    } else {
        reversedColor.r = color.r - 100;
    }
    if(color.g <100) {
        reversedColor.g = color.g+100;
    } else {
        reversedColor.g = color.g - 100;
    }
    if(color.b <100) {
        reversedColor.b = color.b+100;
    } else {
        reversedColor.b = color.b - 100;
    }
    return reversedColor;

}

//draw the bucket
function drawBucket(winner) {
    //draw bucket with the bucket border color
    ctx.beginPath();
    ctx.moveTo(bucket.x, bucket.y);
    ctx.lineTo(bucket.x+bucket.w, bucket.y);
    ctx.lineTo(bucket.x+bucket.w-20, bucket.y+bucket.h);
    ctx.lineTo(bucket.x +20, bucket.y+bucket.h);
    ctx.lineTo(bucket.x, bucket.y);
    ctx.fillStyle = returnRGB(bucket.border);
    ctx.fill();
    //draw whta is inside of the bucket
    //if there is a winner then put green around the target color inside the bucket
    ctx.beginPath();
    //if no winner yet
    if (!game.match){
        if(bucket.bubblesCatched.length == 0 || bucket.bubblesCatched.length == 2){ //draw a full bucket
            ctx.moveTo(bucket.x+5, bucket.y);
            ctx.lineTo(bucket.x+bucket.w-5, bucket.y);
            ctx.lineTo(bucket.x+bucket.w-30, bucket.y+bucket.h-5);
            ctx.lineTo(bucket.x +30, bucket.y+bucket.h-5);
            ctx.lineTo(bucket.x+5, bucket.y);
            if(bucket.bubblesCatched.length == 0) { //fill the bucket with the bucket border
                ctx.fillStyle = returnRGB(bucket.border);
                ctx.fill(); 
            } else { //fill the bucket with red around the current color to let user know that he failed
                ctx.fillStyle = 'red';
                ctx.fill(); 
                //then add inside the current bucket color
                ctx.beginPath();
                ctx.moveTo(bucket.x+10, bucket.y+5);
                ctx.lineTo(bucket.x+bucket.w-10, bucket.y+5);
                ctx.lineTo(bucket.x+bucket.w-40, bucket.y+bucket.h-10);
                ctx.lineTo(bucket.x +40, bucket.y+bucket.h-10);
                ctx.lineTo(bucket.x+10, bucket.y+5);
                ctx.fillStyle = returnRGB(bucket.color);
                ctx.fill();        
            }
        } else { //only 1 bubble has been catched so bucket will be filled half with the color of the bubble catched
            ctx.moveTo(bucket.x+20, bucket.y+bucket.h/2);
            ctx.lineTo(bucket.x+bucket.w-20, bucket.y+bucket.h/2);
            ctx.lineTo(bucket.x+bucket.w-30, bucket.y+bucket.h-5);
            ctx.lineTo(bucket.x +30, bucket.y+bucket.h-5);
            ctx.lineTo(bucket.x+20, bucket.y+bucket.h/2);
            ctx.fillStyle = returnRGB(bucket.color);
            ctx.fill();    
        }
    } else { //there is a winner so fill bucket with green around the target color
        ctx.beginPath();
        ctx.moveTo(bucket.x+5, bucket.y);
        ctx.lineTo(bucket.x+bucket.w-5, bucket.y);
        ctx.lineTo(bucket.x+bucket.w-30, bucket.y+bucket.h-5);
        ctx.lineTo(bucket.x +30, bucket.y+bucket.h-5);
        ctx.lineTo(bucket.x+5, bucket.y);
        ctx.fillStyle = 'green';
        ctx.fill();        
        //now the target color
        ctx.beginPath();
        ctx.moveTo(bucket.x+10, bucket.y+5);
        ctx.lineTo(bucket.x+bucket.w-10, bucket.y+5);
        ctx.lineTo(bucket.x+bucket.w-40, bucket.y+bucket.h-10);
        ctx.lineTo(bucket.x +40, bucket.y+bucket.h-10);
        ctx.lineTo(bucket.x+10, bucket.y+5);
        ctx.fillStyle = returnRGB(targetColor);
        ctx.fill();        
    }
}

//mixes the 2 RGB colors sent as parameters
function mixColor(c1, c2){
    var mixedColor =  {r: c1.r*0.5+c2.r*0.5, g: c1.g*0.5+c2.g*0.5, b: c1.b*0.5+c2.b*0.5};
    // console.log('color 1' + c1 + 'combined with' + c2 + 'is ' + mixedColor);
    return mixedColor;
}

//main function to be 
function animateBubbleAndBucket() {
    if(!game.match){
    //check if ball1 crashes with the bucket
    if((ball1.y > bucket.y) && (ball1.x+30 > bucket.x && ball1.x-20 < bucket.x+100)){
        ball1.y = 50;
        if(bucket.bubblesCatched.length == 0){
            bucket.color = ball1.color;
            bucket.bubblesCatched.push(1);
            // bucket.catched = true;
        } else {
            if(bucket.bubblesCatched.indexOf(1) == -1 && bucket.bubblesCatched.length < 2){
                bucket.color = mixColor (bucket.color, ball1.color);
                bucket.bubblesCatched.push(1);
            }
        }
    } else if (ball1.y + ball1.vy > canvas.height) {
        ball1.y = 50;
    }
    //check if ball2 crashes with the bucket
    if((ball2.y > bucket.y) && (ball2.x+30 > bucket.x && ball2.x-20 < bucket.x+100)){
        ball2.y = 50;
        if(bucket.bubblesCatched.length == 0){
            bucket.color = ball2.color;
            bucket.bubblesCatched.push(2);
            // bucket.catched = true;
        } else {
            if(bucket.bubblesCatched.indexOf(2) == -1 && bucket.bubblesCatched.length < 2){
                bucket.color = mixColor (bucket.color, ball2.color);
                bucket.bubblesCatched.push(2);
            }
        }
    } else if (ball2.y + ball2.vy > canvas.height) {
        ball2.y = 50;
    }

    if((ball3.y > bucket.y) && (ball3.x+30 > bucket.x && ball3.x-20 < bucket.x+100)){
        ball3.y = 50;
        if(bucket.bubblesCatched.length == 0){
            bucket.color = ball3.color;
            bucket.bubblesCatched.push(3);
            // bucket.catched = true;
        } else {
            if(bucket.bubblesCatched.indexOf(3) == -1 && bucket.bubblesCatched.length < 2){
                bucket.color = mixColor (bucket.color, ball3.color);
                bucket.bubblesCatched.push(3);
            }
        }
    } else if (ball3.y + ball3.vy > canvas.height) {
        ball3.y = 50;
    }

    //check if there is a winner
    if(!game.match){  //not a winner yet
        if(bucket.bubblesCatched.length == 2){
            if(JSON.stringify(bucket.color) === JSON.stringify(targetColor)){ //there is a winner
                game.match = true;
                player.points++;
                game.pauseGame(2);    
            } 
        }
    }
    }
    //if left arrow is pushed down move box to the left if it is not already on the left margin
    if (bucket.key && bucket.key == 37) {
        if((bucket.x - bucket.hx) > 10)
            bucket.x -= bucket.hx; 
    }
    //if right arrow is pushed down move box to the right if it is not already on the right margin
    if (bucket.key && bucket.key == 39) {
        if((bucket.x + bucket.w + bucket.hx) < canvas.width-10)
            bucket.x += bucket.hx; 
    }

    //make a little frame to the canvas area
    ctx.fillStyle = returnRGB(reverseColor(targetColor));
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = returnRGB(targetColor);
    ctx.fillRect(5, 5, canvas.width-10, canvas.height-10);

    // ctx.clearRect(0,0, canvas.width, canvas.height);

    ball1 = drawBubble(ball1);

    ball2 = drawBubble(ball2);

    ball3 = drawBubble(ball3);

    drawBucket(game.match);

    raf = window.requestAnimationFrame(animateBubbleAndBucket);
}

init();
animateBubbleAndBucket();
myTimer = setInterval(init, game.timeToReset*1000);

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