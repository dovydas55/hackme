package entities;

import h2d.Graphics;
import h2d.Object;
import h2d.Scene;

class Player {
    
    var userId : Int;
    var player : Object;

    public function new(userId : Int, s2d : Scene) {
        this.userId = userId;
        this.player = initPlayer(s2d);
    }

    public function updatePlayerMovement(du:Float, dx : Float, dy : Float) {
        player.x += dx * du;
        player.y += dy * du;
    }

    function initPlayer(s2d: Scene): Graphics {
        var g = new Graphics(s2d);
        g.beginFill(0xFFFFFF);
        g.drawCircle(0, 0, 10, 20);
        g.endFill();
        return g;
    }
}