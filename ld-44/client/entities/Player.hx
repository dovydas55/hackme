package entities;

import h2d.Graphics;
import h2d.Object;
import h2d.Scene;

class Player extends Entity {
    
    public var uuid : String;
    var player : Object;

    public function new(uuid : String, s2d : Scene) {
        this.uuid = uuid;
        this.player = initPlayer(s2d);
    }

    public override function update(du:Float) {
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