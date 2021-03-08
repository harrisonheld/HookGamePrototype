var player = {
	x: 0.0,
	y: 0.0,
	vx: 0.0,
	vy: 0.0
}

var hook = {
	x: 0.0,
	y: 0.0,
	vx: 0.0,
	vy: 0.0,
	targetX: 0.0,
	targetY: 0.0,
	outVel: 1000.0,
	reelVel: 600.0,
	out: false,
	attached: false
}

var obstacles = [ new Obstacle(500, 500, 100, 100) ]

function Obstacle(x, y, sizeX, sizeY) {
	this.x = x;
	this.y = y;
	this.sizeX = sizeX;
	this.sizeY = sizeY;
}

var mouseDown = false;
var GRAVITY = 500; // gravity in pixels/s^2

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.strokeStyle = "#ffffff"; // stroke color to white

canvas.addEventListener('mousedown', e => { onMouseDown(e) });
canvas.addEventListener('mouseup', e => { onMouseUp(e) });

var lastFrameTimeMs = 0; // The last time the loop was run
var MAX_FPS = 60; // The maximum FPS we want to allow

requestAnimationFrame(mainLoop);

function mainLoop(timestamp) {

	// Throttle the frame rate.    
	if (timestamp < lastFrameTimeMs + (1000 / MAX_FPS)) {
		requestAnimationFrame(mainLoop);
		return;
	}

	deltaTime = (timestamp - lastFrameTimeMs) / 1000 // delta time in seconds
	lastFrameTimeMs = timestamp;

	update(deltaTime); 
	render();

	requestAnimationFrame(mainLoop);
}

function onMouseDown(e) {
	if (!hook.out) {
		hook.out = true;
		hook.x = player.x;
		hook.y = player.y;
		hook.targetX = e.offsetX;
		hook.targetY = e.offsetY;
	}

	mouseDown = true;
}

function onMouseUp(e) {
	mouseDown = false;
}

function drawCircle(x, y, radius) {
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI);
	context.stroke();
}

function drawRect(x, y, sizeX, sizeY) {
	context.beginPath();
	context.rect(x, y, sizeX, sizeY);
	context.stroke();
}

function update(deltaTime) {

	if (hook.out) {
		if (!hook.attached) {
			// move the hook towards its target at a constant rate
			relX = hook.targetX - hook.x;
			relY = hook.targetY - hook.y;
			distance = Math.hypot(relX, relY);

			conversionFac = hook.outVel / distance;

			hook.vx = relX * conversionFac;
			hook.vy = relY * conversionFac;
			hook.x += hook.vx * deltaTime;
			hook.y += hook.vy * deltaTime;

			// check if hook collided with any obstacles
			var collided = false;
			for (var i = 0; i < obstacles.length; i++) {

				obstacle = obstacles[i];

				if (hook.x >= obstacle.x && hook.y >= obstacle.y && hook.x <= obstacle.x + obstacle.sizeX && hook.y <= obstacle.y + obstacle.sizeY) {
					collided = true;
					break;
				}
			}

			if (collided) {
				hook.attached = true;
			}
		}
		else { //if (hook.attached)
			// move the player towards the hook at a constant rate
			relX = hook.x - player.x;
			relY = hook.y - player.y;
			distance = Math.hypot(relX, relY);

			conversionFac = hook.reelVel / distance;

			player.vx = player.vx * conversionFac;
			player.vy = player.vy * conversionFac;
		}
	}
	else {
		// apply acceleration due to gravity
		player.y += GRAVITY * deltaTime
	}

	player.x += player.vx * deltaTime;
	player.y += player.vy * deltaTime;
}

function render() {
	// clear the canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	// draw the player
	drawCircle(player.x, player.y, 20);

	// draw the hook if its out
	if (hook.out) {
		drawCircle(hook.x, hook.y, 10);
	}

	// draw all the obstacles
	obstacles.forEach(function (obstacle) {
		drawRect(obstacle.x, obstacle.y, obstacle.sizeX, obstacle.sizeY);
	})
}