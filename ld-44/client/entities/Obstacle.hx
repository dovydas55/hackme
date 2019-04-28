package entities;

import h2d.Anim;
import h2d.Scene;
import h2d.Tile;

class Obstacle extends Entity {

    public function new(s2d : Scene) {
        // creates three tiles with different color
        var t1 = Tile.fromColor(0xFF0000, 30, 30);
        var t2 = Tile.fromColor(0x00FF00, 30, 30);
        var t3 = Tile.fromColor(0x0000FF, 30, 30);

        // creates an animation for these tiles
        var anim = new Anim([t1,t2,t3], s2d);
        anim.speed = 5;
        anim.x = s2d.width * 0.5;
        anim.y = s2d.height * 0.25;
    }
}