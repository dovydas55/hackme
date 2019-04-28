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

    override function init() {
        
        players = new Array<Player>();
        movables = new Array<Movable>();
        entities = new Array<Entity>();

        entities.push(new Obstacle(s2d));
        entities.push(new Spinner(s2d));

        playerid = "0000";
        players.push(new Player(playerid, s2d));
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
            dx += 1;          
        }
        
        var player = getLocalPlayer(playerid);
        player.dx = dx;
        player.dy = dy;
    }

    function getLocalPlayer(uuid : String) : Player {
        return players.filter(function (p) return p.uuid == uuid)[0];
    }

    static function main() {
        new Main();
    }
}