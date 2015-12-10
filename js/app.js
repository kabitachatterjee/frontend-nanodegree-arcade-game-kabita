var tile_width = 101;
var tile_height = 83;
// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -15;
    // Use Math.random() to randomly generate 0, 1 or 2. 
    // This is used to randomly place enemies on the first, second or third level of the 'street'
    // Since blocks are 83px high, we choose between the three enemy 'levels' with 50 + 83 * (random number)
    var randomY = 50 + tile_height * Math.floor(Math.random() * 3);
    this.y = randomY;
    // Speed is randomly generated between 100 and 400.
    var speed = Math.floor(Math.random() * 300 + 100);
    this.speed = speed;
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    // this.reset() checks if the bug has moved all the way to the right,
    // and if so, starts them off at a random level on the left again
    this.reset();
    // Check for collisions with the player with collisionCheck()
    this.collisionCheck();
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

Enemy.prototype.reset = function() {
    // If the enemy bug is at the right end of the screen
    if (this.x > 500) {
        // Starts all the way from the left again
        this.x = -15;
       // Starts in any one of the three levels of the street randomly
        var randomY = 50 + tile_height * Math.floor(Math.random() * 3);
        this.y = randomY;
       // Sets a random speed between 100 and 400
        var speed = Math.floor(Math.random() * 300 + 100);
        this.speed = speed;
    }
};
/* 
To check for collisions, we first check if the player and enemy are on the same
height (same this.y level). If so, we also check if the absolute distance between
the enemy's and player's 'x' location is less than 51px. 
If so, use player.reset() to move the player back to the starting position,
and reset scoreboard.score to 0.
*/
Enemy.prototype.collisionCheck = function() {
    if (this.y == player.y && Math.abs(this.x - player.x) < 51) {
        player.reset();
        scoreboard.score = 0;
    }
   // Resets the gem if an enemy touches the gem.   
     if (gem.visible && this.y == gem.y && gem.x - this.x < 51 && gem.x - this.x > 25) {
        gem.reset();
    }
};
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // I have chosen the char-pink-girl sprite as my player
    this.sprite = 'images/char-pink-girl.png';
    //This is the starting point for the player
    this.x = 2 * tile_width;
    this.y = 50 + 4 * tile_height;
};
// Draws the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Resets the player to the=] usual starting position
Player.prototype.reset = function() {
    this.x = 2 * tile_width;
    this.y = 50 + 4 * tile_height;
};
Player.prototype.handleInput = function(allowedKeys) {
    /* Moves player around within the game screen.*/
    if (allowedKeys == 'left' && this.x > 0) this.x = this.x - 101;
    else if (allowedKeys == 'right' && this.x < 404) this.x = this.x + 101;
    else if (allowedKeys == 'up' && this.y > 0) this.y = this.y - 83;
    else if (allowedKeys == 'down' && this.y < 382) this.y = this.y + 83;
   /* If the player has reached the water (this.y will be -33)
    And we reset the player's position to the starting point and 
    add points to the scoreboard */
    if (this.y < 0) {
        this.reset();
        scoreboard.score += 100;
    }
};
var Scoreboard = function() {
    this.score = 0;
};

// Displays the scoreboard.
Scoreboard.prototype.render = function() {
    ctx.font = "30px Impact";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText("SCORE : " + this.score, 320, 100); 
};

/* Colored gems that appear randomly in the street. 
   Both enemies and the player can get them.
   They appear at random times, using the dt variable to count down */
var Gem = function() {
    /* Use Math.random() to randomly generate X and Y values that are in any
     of the 'street' blocks. */
    var randomX = tile_width * Math.floor(Math.random() * 4);
    var randomY = 50 + tile_height * Math.floor(Math.random() * 3);
    this.x = randomX;
    this.y = randomY;

    // Any of the three gems can appear at random
    this.sprite = { 
        'blue' :'images/Gem Blue.png',
        'green' :'images/Gem Green.png',
        'orange' :'images/Gem Orange.png'
    };
   // The first gem is always the blue gem.
    this.color = 'blue';
   /* Extra gems are not visible all the time. Initially, the gem will be invisible */
    this.visible = false;
   /* The wait until a new gem becomes visible is random */
    this.wait = Math.floor(Math.random() * 10);
};

// update() makes the gem visible if the waiting time is up and then checks for collisions.
Gem.prototype.update = function(dt) {
    // The update function counts down the waiting time using dt.
    // Once the waiting time is up, the gem becomes visible
    this.wait -= dt;
    if (this.wait < 0) {
        this.visible = true;
    }

    // Only once the gem is visible will it be checked for collisions
    if (this.visible) {
        this.collisionCheck();
    }
};

Gem.prototype.render = function() {
    if (this.visible) {
        ctx.drawImage(Resources.get(this.sprite[this.color]), this.x, this.y);
    }
};

/* We check if the player has collided with the gem.
   This can be an exact collision (x and y numbers are exactly equal), because players
   and gems only move in the center of squares.
   The score for each gem is : blue gets 100 points and orange 300.
   After incrementing the score, the gem is reset.
 */
Gem.prototype.collisionCheck = function() {
    if (this.y == player.y && this.x == player.x) {
        if (this.color == 'blue') {
            scoreboard.score += 100;
        } else if (this.color == 'green') {
            scoreboard.score += 200;
        } else if (this.color == 'orange') {
            scoreboard.score += 300;
        }
        this.reset();
    }
};

// The reset function for when either enemies or the player hits a gem
Gem.prototype.reset = function() {
    /* Use Math.random() to randomly generate X and Y values that are in any
     of the 'street' blocks. */
    var randomX = tile_width * Math.floor(Math.random() * 4);
    var randomY = 50 + tile_height * Math.floor(Math.random() * 3);
    this.x = randomX;
    this.y = randomY;
    /* Extra gems are not visible all the time. Initially, the gem will be invisible */
    this.visible = false;
    /* The color is decided randomly: Orange will appear the least frequently, blue the most */
    var random = Math.random() * 10;
    if (random > 9) {
        this.color = 'orange';
    } else if (random > 6) {
        this.color = 'green';
    } else {
        this.color = 'blue';
    }
   /* The wait until a new gem becomes visible is random! */
    this.wait = Math.floor(Math.random() * 10);
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}
var player = new Player();
// Initialize the scoreboard and gems
var scoreboard = new Scoreboard();
var gem = new Gem();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
