import h2d.TileGroup;
import hxd.App;
import hxd.Key;
import entities.Entity;
import entities.Movable;
import entities.Obstacle;
import entities.Player;
import entities.Spinner;

class Main extends App {

    var players : Array<Player>;
    var movables : Array<Movable>;
    var entities : Array<Entity>;

    var playerid : String;
    var socket : js.html.WebSocket;
    var map : TileGroup;
    var camera : Camera;

    override function init() {

        players = new Array<Player>();
        movables = new Array<Movable>();
        entities = new Array<Entity>();

        // Settings the view and the world
        camera = new Camera(s2d);

		var hostname = js.Browser.window.location.hostname;
        if (hostname != null) {

            socket = new js.html.WebSocket("ws://192.168.1.10:8080/ws");

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
                // trace(msg);
                var response = haxe.Json.parse(msg.data);

                switch (response.type)
                {
                    case 'USER_JOIN_EVENT':
                        var isNewLocalPlayer : Bool = false;
                        // Set local player id when joining
                        if (playerid == null) {
                            playerid = response.user_id;
                            isNewLocalPlayer = true;
                            trace("setting local user: " + playerid);
                        }

                        /*
                            type User struct {
                                UserID    string `json:"user_id"`
                                Timestamp string `json:"timestamp"`
                                StartX    int    `json:"start_x"`
                                StartY    int    `json:"start_y"`
                            }
                        */
                        var ble:Array<Dynamic> = response.event;
                        for (user in ble)
                        {
                            // Add new players that have just joined
                            // and move them to their starting position
                            if (getLocalPlayer(user.user_id) == null) {
                                // var player = user.user_id == playerid ?
                                //  new Player(user.user_id, camera) :
                                //  new Player(user.user_id, new Camera(s2d));
                                var player = new Player(user.user_id, camera);
                                player.entity.x = user.start_x;
                                player.entity.y = user.start_y;
                                players.push(player);

                                trace("Adding new player at (" + player.entity.x + ", " + player.entity.y + ")");
                            }
                        }

                        var count = 0;
                        for (player in players) {
                            count++;
                        }
                        trace(count);

                        if (isNewLocalPlayer) generateMap(response.world_width, response.world_height);

                    case 'USER_MOVE_EVENT':

                        /*
                            type MoveRequestEvent struct {
                                UserID string `json:"user_id"`
                                Dx     int    `json:"dx"`
                                Dy     int    `json:"dy"`
                            }
                        */
                        var e:Dynamic = response.event;

                        var player = getLocalPlayer(e.user_id);
                        if (player != null) {
                            player.dx = e.dx;
                            player.dy = e.dy;

                            trace("set move " + player.uuid + " (" + e.dx + ", " + e.dy + ")");
                        }

                        //move(response.event.user_id, response.event.direction);
                        // trace(response.event);
                }
            }
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
            // trace("camera at (" + camera.viewX + ", " + camera.viewY + ")");
        }
    }

    function getLocalPlayer(uuid : String) : Player {
        var filtered = players.filter(function (p) return p.uuid == uuid);
        if (filtered.length == 0)
            return null;
        return filtered[0];
    }

    function generateMap(width: Float, height: Float) {

		var tile = h2d.Tile.fromColor(0x00ff00, 16, 16);
        map = new TileGroup(tile, camera);

        for (i in 0...500)
        {
            map.add(Std.int(width * Math.random()), Std.int(height * Math.random()), tile);
        }


        // var tile = new h2d.Graphics();

        // //specify a color we want to draw with
        // // tile.beginFill(0xEA8220);
        // //Draw a rectangle at 10,10 that is 300 pixels wide and 200 pixels tall
        // tile.drawRect(0, 0, width, height);
        // //End our fill
        // // tile.endFill();

        // map = new TileGroup(tile, camera);
    }

    static function main() {
        new Main();
    }
}
