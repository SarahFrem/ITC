class Tile {
	constructor(x, y, tileType, element) {
		this.x = x;
		this.y = y;
		this.tileType = tileType;
		this.element = element;
		
		this.setTile(tileType);
	}
}

Tile.prototype.setBackground = function() {
	$(this.element).css('background-image', 'url("' + this.tile + '")');
}

Tile.prototype.setTile = function(tileType) {
	this.tileType = tileType;

	switch (this.tileType) {
		case 'dirt':
			this.tile = MyCraft.tiles.dirt;
			break;
		case 'grass':
			this.tile = MyCraft.tiles.grass;
			break;
		case 'leaf':
			this.tile = MyCraft.tiles.leaf;
			break;
		case 'rock':
			this.tile = MyCraft.tiles.rock;
			break;
		case 'tree':
			this.tile = MyCraft.tiles.tree;
			break;
		case 'bird':
			this.tile = MyCraft.tiles.bird;
			break;
		default:
			this.tile = MyCraft.tiles.none;
			break;
	};

	this.setBackground();
}

Tile.prototype.toObj = function() {
	let tile = {};

	tile.x = this.x;
	tile.y = this.y;
	tile.tileType = this.tileType;
	tile.size = this.size;
	tile.element = this.element.attr('id');

	return tile;
}

Tile.prototype.loadFromObj = function(tile) {
	this.x = tile.x;
	this.y = tile.y;
	this.tileType = tile.tileType;
	this.size = tile.size;
	this.element = $(this.element);
}