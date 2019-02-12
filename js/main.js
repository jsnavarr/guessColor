var canvas = document.getElementById('canvas');
var ctx =   canvas.getContext('2d');

var targetColor; //the target color that player must create mixing 2 balls

var raf; //handler for the requestAnimationFram, setInterval, etc.
var myTimer; //linked to setInterval calling to nextCombination function which creates new combination of colors
var idVar; //to get the time and display the timer counter

//pointers for the information to be displayed 
var $playerScore = document.querySelector("#score span");
var $playerMatches = document.querySelector("#matches span");
var $playerMissmatches = document.querySelector("#missmatches span");
var $gameTimer = document.querySelector("#timer span");
var $leftButtonPressed = document.getElementById("left").addEventListener('mousedown', leftArrowPressed);
var $leftButtonReleased = document.getElementById("left").addEventListener('mouseup', leftArrowReleased);
var $rightButtonPressed = document.getElementById("right").addEventListener('mousedown', rightArrowPressed);
var $rightButtonReleased = document.getElementById("right").addEventListener('mouseup', rightArrowReleased);

var $leftButtonPressed = document.getElementById("left").addEventListener('touchstart', leftArrowPressed);
var $leftButtonReleased = document.getElementById("left").addEventListener('touchend', leftArrowReleased);
var $rightButtonPressed = document.getElementById("right").addEventListener('touchstart', rightArrowPressed);
var $rightButtonReleased = document.getElementById("right").addEventListener('touchend', rightArrowReleased);


// to keep some values when using touchscreen
class TouchScreen {
    constructor(){
        this.touched = false; //flag is set to true when the screen is touched and false when released
        this.x = 0; //x coordinate of the point touched in the screen
        this.y = 0; //y coordinate of the point touched in the screen
    };
}

touchScreen = new TouchScreen();

class Ball {
    constructor(x, y, vy, radius){
        this.x = x; //the x coordinate of the center of the ball
        this.y= -(Math.floor(Math.random()*250))+60; //the  y coordinate of the center of the ball which is above the top of the canvas
        this.vy = vy; //the speed of how the ball falls
        this.radius = radius; //the radio of the ball
        this.color = randomColor(); //the color of the ball
        this.border = reverseColor(this.color); //the border color of the ball
    };
    resetBall(){ //will set the ball to a new color and fall again from the top
        this.y= -(Math.floor(Math.random()*250))+60; 
        this.color = randomColor();
        this.border = reverseColor(this.color);
    }
}

class Bucket {
    constructor(x, y, w, h, hx){
        this.x = x; //the x coordinate of the left top corner of the bucket
        this.y = y; //the y coordinate of the right top corner of the bucket
        this.w = w; //the width of the bucket
        this.h = h; //the height of the bucket
        this.hx = hx; //the spped at which the bucket moves when the left or right arrow are pushed
        this.color = {r: 255, g: 255, b: 255}; //the color filling the bucket but will be set later
        this.border = reverseColor(targetColor); //the border is kind of the reverse color of the target color
        this.key = false; //the key pressed (we are interested only in the left and right arrows)
        this.ballsCatched = []; //it will contain which balls has been catched (up to 2)
    };
    resetBucket(){ //this will empty the bucket filled with the target color (same as the background color)
        this.color = {r: 255, g: 255, b: 255}; //the color filling the bucket but will be set later
        this.border = reverseColor(targetColor); 
        this.key = false;
        this.ballsCatched = [];
    };
    
}

class Player {
    constructor(points){
        this.points = points; //the  initial points for the player (usually 10)
        this.matches = 0; //how many times the player had found the right combination of colors
        this.missmatches = 0; //how many times the player has not found the right combination of colors
    };
    resetPlayer(){ //to be called every time a new game is started
        this.matches = 0;
        this.missmatches = 0;
    }
}

class Game {
    constructor(timeToReset){
        this.timeToReset = timeToReset; //this is the time given to the player to find the right combination of colors (usually 15 seconds)
        this.match = false; //if the right combination was found
        this.isOver = false; //set to true when the player has reached 0 poiints
        this.secondsCounter = 0; //to count the seconds elapsed from timeToReset to 0
        this.loser = false; //set to true if the player could not find the right combination
    };
    welcomeScreen(){
        ctx.fillStyle = 'powderblue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = "70px Arial";
        ctx.fillStyle = "purple";
        ctx.textAlign = "center";
        ctx.fillText("Welcome", canvas.width/2, 100);
        ctx.fillStyle = "blue";
        ctx.font = "40px Arial";
        ctx.fillText("guessColor is a fun game which can help you identify", canvas.width/2, 200);
        ctx.fillText("what colors you need to combine to get a target color", canvas.width/2, 250);
        ctx.fillText("just catch 2 of the falling balls and you will get 1 point", canvas.width/2, 300);
        ctx.fillText("if those 2 colors match the background.", canvas.width/2, 350);
        ctx.fillText("You have 15 seconds to guess the target color.", canvas.width/2, 400);
        ctx.fillStyle = "darkred";
        ctx.font = "50px Arial";
        ctx.fillText("Have fun!!!", canvas.width/2, 500);
        ctx.fillStyle = "darkblue";
        ctx.font = "16px Arial";
        ctx.fillText("Click anywhere on this box to start", canvas.width/2, 550);
    }
    
    //to update the information displayed at the bottom of the screen
    updateMessageLine(){
        $playerScore.textContent = player.points;
        $playerMatches.textContent = player.matches;
        $playerMissmatches.textContent = player.missmatches;
        if(!game.isOver){
            $gameTimer.textContent = game.timeToReset;
        }
    };

    //to start a new game
    resetGame(){
        clearInterval(myTimer);
        cancelAnimationFrame(raf);
        init();
        game.updateMessageLine();
        animateBallAndBucket();
        myTimer = setInterval(nextCombination, game.timeToReset*1000);
    }

    //to pause current game when the right combination is found or 2 balls were chosen but they are not the right combination
    pauseGame (timeToPause){
        clearInterval(myTimer);
        clearInterval(idVar);
        setTimeout(function() {
            nextCombination();
            game.updateMessageLine();
            if(!game.isOver){
                myTimer = setInterval(nextCombination, game.timeToReset*1000);
            }
        }, timeToPause*1000);
    }

    //to display GAME OVER message and stop the game
    displayGameOver(){
        ctx.font = "80px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("G A M E   O V E R", canvas.width/2, canvas.height/2);
        clearInterval(myTimer);
        clearInterval(idVar);
        cancelAnimationFrame(raf);
        $gameTimer.textContent = 0;
    }
}

//to create a new combination of colors (called usually every 15 seconds)
function nextCombination(){
    //get new colors for the balls, the target color and the bucket
    ball1.resetBall();
    ball2.resetBall();
    ball3.resetBall();
    targetColor = returnTargetColor([ball1.color, ball2.color, ball3.color]);
    bucket.resetBucket();
    //clear and set the intervals to call the timer function every 1 second to update the countdown of the timer
    clearInterval(idVar);
    idVar = setInterval(timer, 1000);
    game.secondsCounter = 0;

    if (!game.match){ //no winner then decrease the player points and increase missmatches
        player.points--;
        player.missmatches++;
        if(player.points == 0){ //if player reaches 0 then display GAME OVER
            game.isOver = true;
            game.displayGameOver();
        }
    } 
    game.match = false;
    game.loser = false;
    game.updateMessageLine();
}

//this will be called every 1 second to update the countdown timer
function timer() {
    var dateVar = new Date();
    var t = dateVar.toLocaleTimeString();
    var s = (' ' + t).slice(1);
    game.secondsCounter++;
    $gameTimer.textContent = game.timeToReset - game.secondsCounter;
 };

 //will be call when the game starts to create all required objects, event listeners
function init(){
    ball1 = new Ball (canvas.width/4, 50, 3, 50);
    ball2 = new Ball (canvas.width/4*2, -36, 3, 50);
    ball3 = new Ball (canvas.width/4*3, -72, 3, 50);
    
    targetColor = returnTargetColor([ball1.color, ball2.color, ball3.color]);
    
    bucket = new Bucket (10, canvas.height-110, 100, 100, 3, 0);

    player = new Player(10);
    game = new Game(15);
    clearInterval(idVar);
    idVar = setInterval(timer, 1000);
    game.updateMessageLine();
    var $resetButton = document.getElementById("reset-button").addEventListener('click', game.resetGame);

    window.addEventListener('keydown', function (e) {
        bucket.key = e.keyCode;
    });
    
    window.addEventListener('keyup', function (e) {
        bucket.key = false;
    });
    //store the x,y coordinates of the point touched in the screen
    var $startedTouchingCanvas = document.getElementById("canvas").addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger)
        touchScreen.x = parseInt(touchobj.clientX); // get x position of touch point relative to left edge of browser
        touchScreen.y = parseInt(touchobj.clientY); // get y position of touch point relative to left edge of browser
        touchScreen.touched = true;
        console.log('touched screen at '+touchScreen.x +', '+touchScreen.y);
        e.preventDefault();
    }, false);

    //set the touched flag to  false when stopping touching the screen
    var $endedTouchingCanvas = document.getElementById("canvas").addEventListener('touchend', function(e){
        touchScreen.touched = false;
        e.preventDefault()
    }, false);    
}

//when left or right button is clicked on the screen then it is as if the left/arrow key was pressed

function leftArrowPressed(){
    bucket.key = 37;
}
function leftArrowReleased(){
    bucket.key = false;
}

function rightArrowPressed(){
    bucket.key = 39;
}
function rightArrowReleased(){
    bucket.key = false;
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
    console.log('Ball ' + (mixElem[0]+1) + ' and ball ' + (mixElem[1]+1));
    // mix the 2 elements (mixElem) and return the mixed color
    return {r: Math.floor((colors[mixElem[0]].r)*0.5+(colors[mixElem[1]].r)*0.5), g: Math.floor((colors[mixElem[0]].g)*0.5+(colors[mixElem[1]].g)*0.5), b: Math.floor((colors[mixElem[0]].b*0.5)+(colors[mixElem[1]].b)*0.5)};
}

//draw the bubble in the parameter
function drawBall(ball) {
    // ctx = canvas.getContext('2d');
    ctx.strokeStyle = returnRGB(ball.border);
    ctx.fillStyle = returnRGB(ball.color);
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius-5, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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
    ctx.fillStyle = returnRGB(bucket.border);
    ctx.beginPath();
    ctx.moveTo(bucket.x, bucket.y);
    ctx.lineTo(bucket.x+bucket.w, bucket.y);
    ctx.lineTo(bucket.x+bucket.w-20, bucket.y+bucket.h);
    ctx.lineTo(bucket.x +20, bucket.y+bucket.h);
    ctx.lineTo(bucket.x, bucket.y);
    ctx.closePath();
    ctx.fill();

    //if there is a winner then put green around the target color inside the bucket
    if(bucket.ballsCatched.length == 2){ 
        if (!game.match){     //draw a full bucket with red around the inside color for a loser
            ctx.fillStyle = 'red';
        } else {  //draw a full bucket with green around the inside color for a loser
            ctx.fillStyle = 'green';
        }
        ctx.beginPath();
        ctx.moveTo(bucket.x+5, bucket.y);
        ctx.lineTo(bucket.x+bucket.w-5, bucket.y);
        ctx.lineTo(bucket.x+bucket.w-30, bucket.y+bucket.h-5);
        ctx.lineTo(bucket.x +30, bucket.y+bucket.h-5);
        ctx.lineTo(bucket.x+5, bucket.y);
        ctx.closePath();
        ctx.fill(); 
        //then add inside the current bucket color
        ctx.fillStyle = returnRGB(bucket.color);
        ctx.beginPath();
        ctx.moveTo(bucket.x+10, bucket.y+5);
        ctx.lineTo(bucket.x+bucket.w-10, bucket.y+5);
        ctx.lineTo(bucket.x+bucket.w-40, bucket.y+bucket.h-10);
        ctx.lineTo(bucket.x +40, bucket.y+bucket.h-10);
        ctx.lineTo(bucket.x+10, bucket.y+10);
        ctx.closePath();
        ctx.fill();        
    }
    if(bucket.ballsCatched.length == 1){ //only 1 ball has been catched so bucket will be filled half with the color of the ball catched
        ctx.fillStyle = returnRGB(bucket.color);
        ctx.beginPath();
        ctx.moveTo(bucket.x+20, bucket.y+bucket.h/2);
        ctx.lineTo(bucket.x+bucket.w-20, bucket.y+bucket.h/2);
        ctx.lineTo(bucket.x+bucket.w-30, bucket.y+bucket.h-5);
        ctx.lineTo(bucket.x +30, bucket.y+bucket.h-5);
        ctx.lineTo(bucket.x+20, bucket.y+bucket.h/2);
        ctx.closePath();
        ctx.fill();    
    }
}

//mixes the 2 RGB colors sent as parameters
function mixColor(c1, c2){
    var mixedColor =  {r: Math.floor(c1.r*0.5+c2.r*0.5), g: Math.floor(c1.g*0.5+c2.g*0.5), b: Math.floor(c1.b*0.5+c2.b*0.5)};
    return mixedColor;
}

//check if the ball was touched and update bucket color
function isBallTouched(ball, ballNumber){
    if((ball.y/2 -150 < touchScreen.y && ball.y/2 +150 > touchScreen.y) && 
    ((window.innerWidth/4)*ballNumber -30 < touchScreen.x && (window.innerWidth/4)*ballNumber +30 > touchScreen.x)){
        ball.y = 50;
        if(bucket.ballsCatched.length == 0){
            bucket.color = ball.color;
            bucket.ballsCatched.push(ballNumber);
            // bucket.catched = true;
        } else {
            if(bucket.ballsCatched.indexOf(ballNumber) == -1 && bucket.ballsCatched.length < 2){
                bucket.color = mixColor (bucket.color, ball.color);
                bucket.ballsCatched.push(ballNumber);
            }
        }
    }
    return ball;
}

//check if the ball was touched and update bucket color
function isBallCatched(ball, ballNumber){
    if((ball.y > bucket.y) && (ball.x+30 > bucket.x && ball.x-20 < bucket.x+100)){
        ball.y = 50;
        if(bucket.ballsCatched.length == 0){
            bucket.color = ball.color;
            bucket.ballsCatched.push(ballNumber);
            // bucket.catched = true;
        } else {
            if(bucket.ballsCatched.indexOf(ballNumber) == -1 && bucket.ballsCatched.length < 2){
                bucket.color = mixColor (bucket.color, ball.color);
                bucket.ballsCatched.push(ballNumber);
            }
        }
    } else if (ball.y + ball.vy > canvas.height) {
        ball.y = 50;
    }
    return ball;
}


//main function to be called every timeToReset seconds to act based on the left or right arrow events (moving the bucket)
//check if the balls were catched by the bucket, verify if the target color was found and update the screen accordingly
function animateBallAndBucket() {
    if(!game.isOver){
        if(!game.match && !game.loser){
            //check if user touched ball1 with his finger
            if(touchScreen.touched){
                console.log('ball1 position '+ball1.x + ', '+ball1.y);
                console.log('ball2 position '+ball2.x + ', '+ball2.y);
                console.log('ball3 position '+ball3.x + ', '+ball3.y);
                //check for ball1 located at window.innerWidth/4 (each ball is 1/4 width apart)
                ball1 = isBallTouched(ball1, 1);
                ball2 = isBallTouched(ball2, 2);
                ball3 = isBallTouched(ball3, 3);
            }
            ball1 = isBallCatched(ball1, 1);
            ball2 = isBallCatched(ball2, 2);
            ball3 = isBallCatched(ball3, 3);
            //check if there is a winner
            if(!game.match){  //not a winner yet
                if(bucket.ballsCatched.length == 2){
                    if(JSON.stringify(bucket.color) === JSON.stringify(targetColor)){ //there is a winner
                        game.match = true;
                        player.points++;
                        player.matches++;
                        game.pauseGame(1);  
                    } else {
                        game.loser = true;
                        game.pauseGame(1);
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
            ball1 = drawBall(ball1);

            ball2 = drawBall(ball2);

            ball3 = drawBall(ball3);

            drawBucket(game.match);
        }
        if(!game.isOver){
            raf = window.requestAnimationFrame(animateBallAndBucket);
        }
    }
}

function startGame(){
    document.getElementById("canvas").removeEventListener('click', startGame);
    init();
    animateBallAndBucket();
    myTimer = setInterval(nextCombination, game.timeToReset*1000);
}

function mainFunction (){
    game = new Game(15);
    game.welcomeScreen();
    var $clickToStart= document.getElementById("canvas").addEventListener('click', startGame);
}

mainFunction();
