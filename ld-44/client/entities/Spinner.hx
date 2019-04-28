package entities;

import h2d.Bitmap;
import h2d.Scene;
import h2d.Tile;

class Spinner extends Entity {

    var bmp : Bitmap;

    public function new(s2d: Scene) {
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
    }

    public override function update(du: Float) {

        // increment the display bitmap rotation by 0.1 radians
        bmp.rotation += 0.1 * du;
    }
}