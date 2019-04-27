import hxd.App;
import hxd.Key;
import h2d.Anim;
import h2d.Bitmap;
import h2d.Tile;
import entities.Entity;
import entities.Player;

class Main extends App {

    var bmp : Bitmap;
    var anim : Anim;
    var players : Array<Player>;
    var entities : Array<Entity>;
    var playerid : String;

    override function init() {
        // allocate a Texture with red color and creates a 100x100 Tile from it
        var tile = Tile.fromColor(0xFF0000, 100, 100);
        // create a Bitmap object, which will display the tile
        // and will be added to our 2D scene (s2d)
        bmp = new Bitmap(tile, s2d);
        // modify the display position of the Bitmap sprite
        bmp.x = s2d.width * 0.25;
        bmp.y = s2d.height * 0.25;
        bmp.tile.dx = -tile.width * 0.5;
        bmp.tile.dy = -tile.height * 0.5;

        // creates three tiles with different color
        var t1 = Tile.fromColor(0xFF0000, 30, 30);
        var t2 = Tile.fromColor(0x00FF00, 30, 30);
        var t3 = Tile.fromColor(0x0000FF, 30, 30);

        // creates an animation for these tiles
        anim = new Anim([t1,t2,t3], s2d);
        anim.speed = 5;
        anim.x = s2d.width * 0.5;
        anim.y = s2d.height * 0.25;

        players = new Array<Player>();
    }

    // on each frame
    override function update(dt:Float) {
        // dt is the change in time in seconds
        // assume 60 frames per second
        // du is then the change in time unit
        var du = dt * 60;

        // increment the display bitmap rotation by 0.1 radians
        bmp.rotation += 0.1 * du;

        handleInput();

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
        
        var player = getPlayer(playerid);
        player.dx = dx;
        player.dy = dy;
    }

    function getPlayer(uuid : String) : Player {
        return players.filter(function (p) return p.uuid == uuid)[0];
    }

    static function main() {
        new Main();
    }
}