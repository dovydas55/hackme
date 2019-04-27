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

/*
{
    type: "move",
    move: "left"
}

{
    type: "new",
    player_id: 1,
    pos: [1,1],
    color: "green"
}
*/

let players = [];

websocket.onmessage = (msg) => {
	response = JSON.parse(msg.data)
	switch (response.type) {
		case 'USER_JOIN_EVENT':
            players = [];
            for(i = 0; i < response.event.length; ++i)
            {
                createPlayer(response.event[i].user_id);
            }
			break;
		case 'USER_MOVE_EVENT':
            console.log(response)
            move(response.event.user_id, response.event.direction);
            break;
	}
}

function move(playerId, movement)
{
    var player = players.find(function(i){
        return i.id == playerId;
    })
    console.log(player)
    if(!player) return;
    switch (movement)
    {
		case 'left':
            player.x -= 5;
			break;
		case 'right':
            player.x += 5;
        	break;
		case 'up':
            player.y -= 5;
			break;
		case 'down':
            player.y += 5;
			break;
	}
}

function createPlayer(playerId)
{
    let x =  getRandomInt(45, canvas.width - 45);
    let y =  getRandomInt(45, canvas.height - 45);
    players.push({
        id:playerId,
        x:x,
        y:y,
        color: "green"
    });
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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


var lastTime = null;
var cx;
const canvas = document.querySelector("canvas");
function frame(time) {
    if(lastTime != null) {
        update(Math.min(100, time - lastTime) / 1000);
    }
    lastTime = time;
    requestAnimationFrame(frame);
}

function update(dt)
{
    cx.clearRect(0,0, canvas.width, canvas.height);
    for(index = 0; index < players.length; ++index)
    {
        let player = players[index];

        cx.beginPath();
        cx.fillStyle = player.color;
        cx.arc(player.x, player.y, 20, 0, Math.PI *2);
        cx.fill();
    }
}

window.onload = () => {
    cx = canvas.getContext("2d");

    requestAnimationFrame(frame);
}


