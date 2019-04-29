import h2d.TileGroup;
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
    var socket : js.html.WebSocket;
    var map : TileGroup;
    var camera : Camera;

    override function init() {
        var font : h2d.Font = hxd.res.DefaultFont.get();
        var playerIdText = new h2d.Text(font, s2d);
        playerIdText.text = "PlayerId:";

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
			var response = haxe.Json.parse(msg.data);

			trace(response);
			switch (response.type)
			{
				case 'USER_JOIN_EVENT':
					if (playerid == "" || playerid == null) {
						playerid = response.user_id;
                        playerIdText.text = "PlayerId: "+ playerid;
					}

					var ble:Array<Dynamic> = response.event;
					for (e in ble)
					{
                        var player = players.get(e.user_id);
                        if(player == null)
                        {
                            var char = new Player(e.user_id, camera);
                            char.setPos(e.start_x, e.start_y);
						    players.set(e.user_id, char);
                        }
					}

				case 'USER_MOVE_EVENT':
                    var player = players.get(response.move_event.user_id);
                    player.dx = response.move_event.dx;
                    player.dy = response.move_event.dy;
                case 'USER_REMOVE_EVENT':
                	var player = players.get(response.user_id);
                	if (player != null)
                	{
                		camera.removeChild(player.entity);
                		players.remove(response.user_id);
                	}
			}
		}

        players = new Map<String, Player>();
        movables = new Array<Movable>();
        entities = new Array<Entity>();

        camera = new Camera(s2d);
		var tile = h2d.Tile.fromColor(0x00ff00, 16, 16);
        map = new TileGroup(tile, camera);

        for (i in 0...1000)
        {
            map.add(Std.int(s2d.width * Math.random()), Std.int(s2d.height * Math.random()), tile);
        }
    }

    // on each frame
    override function update(dt:Float) {
        // dt is the change in time in milliseconds
        // assume 60 frames per second
        // du is then the change in time unit
        var du = dt * 60;

        handleInput();
        handleUpdate(du);
        handleViewport();
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
        	if (dx != 0 || dy != 0)
        	{
        		var ble = { "type":"move", "user_id": playerid, "dx": dx, "dy": dy};
        		socket.send(haxe.Json.stringify(ble));
        	}

	        player.dx = dx;
	        player.dy = dy;
        }
    }

    function handleUpdate(du : Float) {

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

    function handleViewport() {

        var player = getLocalPlayer(playerid);
        if (player != null) {
            camera.viewX = player.entity.x;
            camera.viewY = player.entity.y;
        }
    }

    function getLocalPlayer(uuid : String) : Player {
        return players.get(uuid);
    }

    static function main() {
        new Main();
    }
}
