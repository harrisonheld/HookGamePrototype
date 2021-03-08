var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.onclick = onCanvasClick

function onCanvasClick(e) {
	x = e.clientX;
	y = e.clientY;
	drawCircle(x, y, 20);
}

function drawCircle(x, y, radius) {
	context.beginPath();
	context.arc(x, y, 40, 0, 2 * Math.PI);
	context.stroke();
}