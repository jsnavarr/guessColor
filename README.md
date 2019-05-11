## guessColor
**guessColor** is a game which will let user guess what colors has to mix in order to obtain the target color.

Live version: [guessColor](http://splendid-cough.surge.sh/ "guessColor Homepage")


## user Stories
**guessColor** will display a target color in the background (let's say green) then 3 bubbles will drop from the top (let's say red, yellow and blue), the user must catch in a bucket 2 of those bubbles to obtain the target color (in this case it has to be yellow and blue), if user gets the target color then he gets points, if he does not then his score will be reduced.
User starts with an score of 10 and he will get 1 point for guessing each target color or reduce his score by 1 point if he does not.
The target color will be reset every 20 seconds until the player ends the game or player runs out of points. 

When there is match the bucked will be filled with the target color surrounded by green.

When there is a missmatch the bucket color will be surrounded by red.



![Welcome](https://github.com/jsnavarr/guessColor/blob/master/public/static/images/guessColorMS.jpg)

## Design
Classes for the main objects were defined (Ball, Bucket, Player, Game) with their respective attributes and methods. 

The main function is animateBallAndBucket which is cycling using requestAnimationFrame and listening to keyboard events to move the bucket and catch balls when the bucket is under the falling ball. The balls olor are reset every 15 seconds when calling nextCombination function which is being called by using setInterval function.

Variables and objects are initialized when calling init function. A new combination of colors is reset every 15 seconds when calling nextCombination function.

When there the right combination of balls is found or the wrong combination is chosen then the game is paused 1 second, this is done clearing the variables linked to the setInterval function.





