//Create the canvas. Note the size of canvas is
//the same with the size of background image.
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 475;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "./imgs/background.png";

// player image
var playerReady = false;
var playerImage = new Image();
playerImage.onload = function () {
	playerReady = true;
};
playerImage.src = "./imgs/player.png";

// football image
var footballReady = false;
var footballImage = new Image();
footballImage.onload = function () {
	footballReady = true;
};
footballImage.src = "./imgs/football.png";

// Game objects
var player = {
	speed: 256 // movement in pixels per second
};
var football = {};
var footballsCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// need modification
// Reset the game when the player kicks a football
var reset = function () {
	player.x = canvas.width / 2;
	player.y = canvas.height / 2;

	// Throw the football in the right zone randomly
	football.x = 32 + (Math.random() * (canvas.width - 64));
	football.y = 32+185 + (Math.random() * (canvas.height - 64 - 185));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		player.y -= player.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		player.y += player.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		player.x -= player.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		player.x += player.speed * modifier;
	}

	// Are they touching?
	if (
		player.x <= (football.x + 32)
		&& football.x <= (player.x + 70)
		&& player.y <= (football.y + 32)
		&& football.y <= (player.y + 68)
	) {
		++footballsCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (playerReady) {
		ctx.drawImage(playerImage, player.x, player.y);
	}

	if (footballReady) {
		ctx.drawImage(footballImage, football.x, football.y);
	}

	// Score
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.fillText("Total Goals: " + footballsCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();
