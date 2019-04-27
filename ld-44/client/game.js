let websocket = new WebSocket("ws://localhost:8080/ws")
console.log("Attempting web socket connection")

websocket.onopen = () => {
	console.log("Succesfully connected");
}

websocket.onclose = (event) => {
	console.log("Closed connection", event);
}

websocket.onerror = (err) => {
	console.log(err);
}

websocket.onmessage = (msg) => {
	response = JSON.parse(msg.data)
	switch (response.type) {
		case 'USER_JOIN_EVENT':
			console.log(response)
			break;
		case 'USER_MOVE_EVENT':
			switch (response.event.direction) {
				case 'left':
					leftArrowPressed();
					console.log(response)
					break;
				case 'right':
					rightArrowPressed();
					break;
				case 'up':
					upArrowPressed();
					break;
				case 'down':
					downArrowPressed();
					break;
			}
			break;
	}
}

function leftArrowPressed() {
	var element = document.getElementById("image1");
	element.style.left = parseInt(element.style.left) - 5 + 'px';
}

function rightArrowPressed() {
	var element = document.getElementById("image1");
	element.style.left = parseInt(element.style.left) + 5 + 'px';
}

function upArrowPressed() {
	var element = document.getElementById("image1");
	element.style.top = parseInt(element.style.top) - 5 + 'px';
}

function downArrowPressed() {
	var element = document.getElementById("image1");
	element.style.top = parseInt(element.style.top) + 5 + 'px';
}

function moveSelection(event) {
	if(!event) return
	switch (event.keyCode) {
		case 37:
			websocket.send('left');
			break;
		case 39:
			websocket.send('right');
			break;
		case 38:
			websocket.send('up');
			break;
		case 40:
			websocket.send('down');
			break;
	}
};

function gameLoop() {
	setTimeout("gameLoop()", 10);
}
