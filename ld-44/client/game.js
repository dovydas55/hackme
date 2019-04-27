const hostname = window.location.hostname;
let websocket = new WebSocket("ws://"+hostname+":8080/ws")
console.log("Attempting web socket connection at "+ hostname)

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
            move(response.event.user_id, response.event.direction);
            break;
	}
}

function move(playerId, movement)
{
    var player = players.find(function(i){
        return i.id == playerId;
    })
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




function fixedUpdate(dt)
{

}

function render(dt)
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

var now;
const renderFps = 30;
var renderThen = Date.now();
var renderDelta;
const updateFps = 60;
var updateThen = Date.now();
var updateDelta;
var lastTime = null;
var cx;
const canvas = document.querySelector("canvas");
function frame(time) {
    requestAnimationFrame(frame);
    now = Date.now();

    updateDelta = now - updateThen;
    if(updateDelta > (1000 / updateFps))
    {
        fixedUpdate(updateDelta);
        updateThen = now - (updateDelta % (1000 / updateFps));
    }

    renderDelta = now - renderThen;
    if( renderDelta > (1000/ renderFps))
    {
        render(renderDelta);
        renderThen = now - (renderDelta % (1000 / renderFps));
    }
}

window.onload = () => {
    cx = canvas.getContext("2d");

    requestAnimationFrame(frame);
}


