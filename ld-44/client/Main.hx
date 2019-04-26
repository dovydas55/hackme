import hxd.App;
import hxd.Key;
import h2d.Anim;
import h2d.Bitmap;
import h2d.Graphics;
import h2d.Object;
import h2d.Tile;

class Main extends App {

    var bmp : Bitmap;
    var anim : Anim;
    var player : Object;

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

        player = initPlayer(s2d);
    }

    function initPlayer(s2d: h2d.Scene): Graphics {
        var g = new Graphics(s2d);
        g.beginFill(0xFFFFFF);
        g.drawCircle(0, 0, 10, 20);
        g.endFill();
        return g;
    }

    // on each frame
    override function update(dt:Float) {
        // increment the display bitmap rotation by 0.1 radians
        bmp.rotation += 0.1 * dt * 60;
        handlePlayerMovement(dt);
    }

    function handlePlayerMovement(dt:Float) {
        if (Key.isDown(Key.UP) || Key.isDown(Key.W)) {
            player.y -= dt * 60;
        }
        if (Key.isDown(Key.DOWN) || Key.isDown(Key.S)) {
            player.y += dt * 60;
        }
        if (Key.isDown(Key.LEFT) || Key.isDown(Key.A)) {
            player.x -= dt * 60;
        }
        if (Key.isDown(Key.RIGHT) || Key.isDown(Key.D)) {
            player.x += dt * 60;            
        }
    }

    static function main() {
        new Main();
    }
}