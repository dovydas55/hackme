package entities;

import h2d.Graphics;
import h2d.Object;

class Player extends Movable {

    public var uuid : String;
    public var entity(default, null) : Object;

    public function new(uuid:String, s2d:Object) {
        this.uuid = uuid;
        this.entity = initPlayer(s2d);
    }

    public override function update(du:Float) {
        entity.x += dx * du * 10;
        entity.y += dy * du * 10;

        // Reset its own directional vector
        dx = 0;
        dy = 0;
    }

    public function setPos(x:Int, y:Int)
    {
        entity.x = x;
        entity.y = y;
    }

    function initPlayer(s2d:Object): Graphics {
        var g = new Graphics(s2d);
        g.beginFill(0xFFFFFF);
        g.drawCircle(0, 0, 10, 20);
        g.endFill();
        return g;
    }
}
