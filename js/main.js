var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var targetColor;

var raf; //handler for the requestAnimationFram, setInterval, etc.
var myTimer;

//pointers for the information to be displayed 
var $playerScore = document.querySelector("#score span");
var $playerMatches = document.querySelector("#matches span");
var $playerMissmatches = document.querySelector("#missmatches span");
// var $resetButton = document.getElementById("reset-button").addEventListener('click', resetGame);

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
    resetBall(){
        this.y= -(Math.floor(Math.random()*250))+60;
        this.color = randomColor();
        this.border = reverseColor(this.color);
    }
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
        this.key = false;
        this.catched = false;
        this.bubblesCatched = [];
    };
    resetBucket(){
        this.border = reverseColor(targetColor);
        this.key = false;
        this.catched = false;
        this.bubblesCatched = [];
    };
    
}

class Player {
    constructor(points){
        this.points = points;
        this.matches = 0;
        this.missmatches = 0;
    };
    resetPlayer(){
        this.matches = 0;
        this.missmatches = 0;
    }
}

class Game {
    constructor(timeToReset){
        this.timeToReset = timeToReset;
        this.match = false;
        this.isOver = false;
    };
    resetGame(){
        clearInterval(myTimer);
        cancelAnimationFrame(raf);
        // player.resetPlayer();
        // this.match = false;
        // this.isOver = false;

        // bucket.resetBucket();
        init();
        $playerMissmatches.textContent = player.missmatches;
        $playerMatches.textContent = player.matches;        
        // nextCombination();
        animateBubbleAndBucket();
        myTimer = setInterval(nextCombination, game.timeToReset*1000);
        $playerScore.textContent = player.points;
        
    }
    pauseGame (timeToPause){
        clearInterval(myTimer);
        // window.cancelAnimationFrame(raf);
        setTimeout(function() {
            // init();
            nextCombination();
            myTimer = setInterval(init, game.timeToReset*1000);
            // $playerScore.textContent = player.points;
            console.log('winner');
            console.log('points '+player.points);
            console.log('game was paused');
        }, timeToPause*1000);
    }
    displayGameOver(){
        ctx.font = "80px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("G A M E   O V E R", canvas.width/2, canvas.height/2);
    }
}


function nextCombination(){
    ball1.resetBall();
    ball2.resetBall();
    ball3.resetBall();
    
    targetColor = returnTargetColor([ball1.color, ball2.color, ball3.color]);

    bucket.resetBucket();

    if (!game.match){
        player.points--;
        player.missmatches++;
        $playerScore.textContent = player.points;
        $playerMissmatches.textContent = player.missmatches;
        if(player.points == 0){
            game.isOver = true;
            game.displayGameOver();
        }
        console.log('points '+player.points);
    } else {
        game.match = false;
    }
}

function init(){
    // var canvas = document.getElementById('canvas');
    // var ctx = canvas.getContext('2d');

    // if(!game.isOver){
    ball1 = new Ball (canvas.width/4, 50, 0, 3, 60);
    ball2 = new Ball (canvas.width/4*2, -36, 0, 3, 60);
    ball3 = new Ball (canvas.width/4*3, -72, 0, 3, 60);
    
    targetColor = returnTargetColor([ball1.color, ball2.color, ball3.color]);
    // targetColor = null;

    bucket = new Bucket (10, canvas.height-130, 120, 120, 3, 0);

    player = new Player(10);
    game = new Game(10);
    var $resetButton = document.getElementById("reset-button").addEventListener('click', game.resetGame);

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
    if(!game.isOver){
        if(!game.match ){
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
                        player.matches++;
                        $playerScore.textContent = player.points;
                        $playerMatches.textContent = player.matches;
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
}

init();
// resetGame();
animateBubbleAndBucket();
myTimer = setInterval(nextCombination, game.timeToReset*1000);