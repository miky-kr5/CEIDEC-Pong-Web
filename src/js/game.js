/*
 * -----------------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <miguel.astor@ciens.ucv.ve> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return. Miguel Angel Astor
 * -----------------------------------------------------------------------------------
 */

////////////////////////////////////////////////////////////////////////////////////////
// Global variables.                                                                  //
////////////////////////////////////////////////////////////////////////////////////////

var player = null;
var computer = null;
var ball = null;
var playing = false;
var lives = 3;
var c_lives = 3;
var startButton = null;
var livesText = null;
var cLivesText = null;
var lifeLostText = null;
var successText = null;
var textStyle = {
    font: "18px Arial",
    fill: "#FFFFFF",
}

var ethCallback = null;

////////////////////////////////////////////////////////////////////////////////////////
// Helper functions.                                                                  //
////////////////////////////////////////////////////////////////////////////////////////

function randSig() {
    var signs = [-1, 1];
    return signs[Math.floor(signs.length * Math.random())];
}

function startGame() {
    if (ethCallback !== null) {
	ethCallback();
    } else {
	alert("Can't play the game\nWeb3 not initialized.");
    }
}

function playTheGame() {
    startButton.destroy();
    ball.body.velocity.set(randSig() * 150, randSig() * 150);
    playing = true;
}

function ballHitPaddle(ball, paddle) {
    ball.animations.play("wobble");
    ball.body.velocity.x = 1.15 * ball.body.velocity.x;
}

function ballLeaveScreen() {
    // Pause the game
    playing = false;

    if (ball.x < 0) {
	// If the ball left by the left side of the screen
	// then reduce player lives
	lives--;

	// Then show the defeat text
	lifeLostText.visible = true;

	// And update the player lives counter
	livesText.setText("Your lives: " + lives);
	
	if (!lives) {
            alert("Game over, dude!");
            location.reload();
	}
    } else if (ball.x > game.world.width) {
	// If the ball left by the right side of the screen
	// then reduce computer lives
	c_lives--;

	// Then show the victory text
	successText.visible = true;

	// And update the computer lives counter
	cLivesText.setText("Computer lives: " + c_lives);
	
	if (!c_lives) {
	    alert("A winner is you!");
            location.reload();
	}
    }

    // Reset all positions
    // Resetting the ball sets it's velocity to 0
    ball.reset(game.world.width * 0.5, game.world.height * 0.5);
    player.reset(20, game.world.height * 0.5);
    computer.reset(game.world.width - 20, game.world.height * 0.5);

    // Add an event listener for one event
    game.input.onDown.addOnce(function() {
	// Unpause the game
	ball.body.velocity.set(randSig() * 150, randSig() * 150);
	playing = true;
	lifeLostText.visible = false;
	successText.visible = false;
    }, this);
}

////////////////////////////////////////////////////////////////////////////////////////
// Loads all assets and sets up the game.                                             //
////////////////////////////////////////////////////////////////////////////////////////

function preload() {
    // Set basic game properties
    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //game.scale.pageAlignHorizontally = true;
    //game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#eee";

    // Set basic game properties
    game.load.image("bckg", "img/bckg.png");
    game.load.image("paddle", "img/paddle.png");
    game.load.image("computer", "img/computer.png");
    game.load.spritesheet("ball", "img/wobble.png", 20, 20);
    game.load.spritesheet("button", "img/button.png", 144, 40);
}

////////////////////////////////////////////////////////////////////////////////////////
// Creates all game objects                                                           //
////////////////////////////////////////////////////////////////////////////////////////

function create() {
    // Initialize the physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.left = false;
    game.physics.arcade.checkCollision.right = false;

    // Create the background
    bckg = game.add.sprite(0, 0, "bckg");

    // Create the ball sprite and set it"s properties
    ball = game.add.sprite(game.world.width * 0.5, game.world.height * 0.5, "ball");
    ball.animations.add("wobble", [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.bounce.set(1);
    ball.body.collideWorldBounds = true;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);
    
    // Create the player sprite and set it"s properties
    player = game.add.sprite(20, game.world.height * 0.5, "paddle");
    player.anchor.set(0.5, 0.5);
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.immovable = true;

    // Create the computer sprite and set it"s properties
    computer = game.add.sprite(game.world.width - 20, game.world.height * 0.5, "computer");
    computer.anchor.set(0.5, 0.5);
    game.physics.enable(computer, Phaser.Physics.ARCADE);
    computer.body.immovable = true;

    // Create the start button
    startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, "button", startGame, this, 1, 0, 2);
    startButton.anchor.set(0.5);

    // Create text elements
    livesText = game.add.text(7, 5, "Your lives: " + lives, textStyle);
    livesText.anchor.set(0, 0);
    cLivesText = game.add.text(game.world.width - 7, 5, "Computer lives: " + c_lives, textStyle);
    cLivesText.anchor.set(1, 0);
    lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'Got you!, click to continue', textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;
    successText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'You got me!, click to continue', textStyle);
    successText.anchor.set(0.5);
    successText.visible = false;
}

////////////////////////////////////////////////////////////////////////////////////////
// Implements the game logic                                                          //
////////////////////////////////////////////////////////////////////////////////////////

function update() {
    // Do collition detection
    game.physics.arcade.collide(ball, player, ballHitPaddle);
    game.physics.arcade.collide(ball, computer, ballHitPaddle);

    if (playing) {
	// If the game is on, move the player with the mouse
	player.y = game.input.y;

	// Set the computer's speed so it moves in the direction of the ball
	if (ball.y > computer.y)
	    computer.body.velocity.y = 65;
	else if (ball.y < computer.y)
	    computer.body.velocity.y = -65;
	else
	    computer.body.velocity.y = 0;

    } else {
	// If the game is off, fix the position of player and computer
	player.y = game.world.height * 0.5;
	computer.y = game.world.height * 0.5;
    }
}

////////////////////////////////////////////////////////////////////////////////////////
// Game initialization                                                                //
//////////////////////////////////////////////////////////////////////////////////////// 

// Function references for Phaser.
functions = {
    preload: preload,
    create: create,
    update: update
};

// Set the game canvas and play
game = new Phaser.Game(480, 320, Phaser.CANVAS, 'game_container', functions);
