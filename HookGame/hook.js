var player = new Object();
player.x = player.y = 0.0;
player.vx = player.vy = 0.0;

var hook = new Object();
hook.x = hook.y = 0.0;
hook.targetX = hook.targetY = 0.0;
hook.reelVelocity = 600;
hook.out = false;
hook.attached = false;

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
	hook.targetX = e.offsetX;
	hook.targetY = e.offsetY;
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

function update(deltaTime) {

	if (mouseDown) {
		// move the player towards the hook at a constant rate

		relX = hookX - player.x;
		relY = hookY - player.y;
		distance = Math.hypot(relX, relY); // distance from player to hook

		conversionFac = HOOK_VEL / distance;

		player.vx = player.vx * conversionFac;
		player.vy = player.vy * conversionFac;
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
}