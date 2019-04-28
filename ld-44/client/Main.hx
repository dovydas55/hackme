import hxd.App;
import hxd.Key;
import entities.Entity;
import entities.Movable;
import entities.Obstacle;
import entities.Player;
import entities.Spinner;

class Main extends App {

    var players : Map<String, Player>;
    var movables : Array<Movable>;
    var entities : Array<Entity>;

    var playerid : String;
    var socket: js.html.WebSocket;

    override function init() {
		var hostname = js.Browser.window.location.hostname;
    	socket = new js.html.WebSocket("ws://"+hostname+":8080/ws");

    	socket.onopen = function(e:js.html.Event) {
			trace("Succesfully connected "+e);
		};
		socket.onclose = function(event) {
			trace("Closed connection", event);
		};
		socket.onerror = function(err) {
			trace(err);
		};

		socket.onmessage = function(msg){
			trace(msg);
			var response = haxe.Json.parse(msg.data);

			switch (response.type)
			{
				case 'USER_JOIN_EVENT':
					trace(response.event);
					if (playerid == "") {
						playerid = response.user_id;
					}

					var ble:Array<Dynamic> = response.event;
					for (e in ble)
					{
						players.set(playerid, new Player(e.user_id, s2d));
					}

				case 'USER_MOVE_EVENT':

					//move(response.event.user_id, response.event.direction);
					trace(response.event);
			}
		}

        players = new Map<String, Player>();
        movables = new Array<Movable>();
        entities = new Array<Entity>();

        entities.push(new Obstacle(s2d));
        entities.push(new Spinner(s2d));

    }

    // on each frame
    override function update(dt:Float) {
        // dt is the change in time in seconds
        // assume 60 frames per second
        // du is then the change in time unit
        var du = dt * 60;

        handleInput();

        for (entity in entities) {
            entity.update(du);
        }
        for (movable in movables) {
            movable.update(du);
        }
        for (player in players) {
            // do nothing for now when it's diagonal input
            // TODO: change this later
            if (!(player.dx != 0 && player.dy != 0)) {
                player.update(du);
            }
        }
    }

    function handleInput() {
        // update player position
        // move this later into a proper input handler or manager
        var dx = 0;
        var dy = 0;

        if (Key.isDown(Key.UP) || Key.isDown(Key.W)) {
            dy -= 1;
        }
        if (Key.isDown(Key.DOWN) || Key.isDown(Key.S)) {
            dy += 1;
        }
        if (Key.isDown(Key.LEFT) || Key.isDown(Key.A)) {
            dx -= 1;
        }
        if (Key.isDown(Key.RIGHT) || Key.isDown(Key.D)) {
            dx = 1;
        }

        var player = getLocalPlayer(playerid);
        if (player != null)
        {
        	if (dx != 0 && dy != 0)
        	{
        		var ble = { "type":"move", "user_id": playerid, "dx": dx, "dy": dy};
        		socket.send(haxe.Json.stringify(ble));
        	}

	        player.dx = dx;
	        player.dy = dy;
        }
    }

    function getLocalPlayer(uuid : String) : Player {
        return players.get(uuid);
    }

    static function main() {
        new Main();
    }
}
