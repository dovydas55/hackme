package entities;

class Room extends Sprite {
	// these values hold grid coordinates for each corner of the room
	public var x1:Int;
	public var x2:Int;
	public var y1:Int;
	public var y2:Int;
	// width and height of room in terms of grid
	public var w:Int;
	public var h:Int;
	// center point of the room
	public var center:Point;

	// constructor for creating new rooms
	public function new(x:Int, y:Int, w:Int, h:Int) {
		super();

		x1 = x;
		x2 = x + w;
		y1 = y;
		y2 = y + h;
		this.x = x * Main.TILE_WIDTH;
		this.y = y * Main.TILE_HEIGHT;
		this.w = w;
		this.h = h;
		center = new Point(Math.floor((x1 + x2) / 2), Math.floor((y1 + y2) / 2));
	}

	// return true if this room intersects provided room
	public function intersects(room:Room):Bool {
		return (x1 <= room.x2 && x2 >= room.x1 && y1 <= room.y2 && room.y2 >= room.y1);
	}
}
