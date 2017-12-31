function checkToolAbility(tile) {
	if (MyCraft.toolsAbility[MyCraft.selectedTool].includes(tile)) {
		return true;
	}

	return false;
}

function updateInventory() {
	var dirt = $('#dirtInventory');
	var grass = $('#grassInventory');
	var leaf = $('#leafInventory');
	var tree = $('#treeInventory');
	var rock = $('#rockInventory');
	var bird = $('#birdInventory');

	dirt.html(MyCraft.inventory.dirt);
	grass.html(MyCraft.inventory.grass);
	leaf.html(MyCraft.inventory.leaf);
	tree.html(MyCraft.inventory.tree);
	rock.html(MyCraft.inventory.rock);
	bird.html(MyCraft.inventory.bird);
}


function generateGrid() {
	MyCraft.grid = new Array(MyCraft.rows);

	for (var i = 0; i < MyCraft.rows; i++) {
		MyCraft.grid[i] = new Array(MyCraft.cols);
	}

	for (var i = 0; i < MyCraft.rows; i++) {
		for (var j = 0; j < MyCraft.cols; j++) {
			let newDiv = $('<div/>').addClass('gridTile').attr('id', 'tile-' + i + '-' + j);

			let tileCoords = newDiv.attr('id').split('-');
			let x = tileCoords[1];
			let y = tileCoords[2];
			let tile = new Tile(x, y, MyCraft.tiles.none, newDiv);
			MyCraft.grid[x][y] = tile;

			setTileClickEvent(newDiv);
			$('#grid').append(newDiv);
		}
	}

	
}

function setTileClickEvent(div) {
	div.on('click', function() {
		if (MyCraft.lastSelected == MyCraft.tools.pickaxe ||
			MyCraft.lastSelected == MyCraft.tools.axe ||
			MyCraft.lastSelected == MyCraft.tools.shovel ||
			MyCraft.lastSelected == MyCraft.tools.slingshot) {

			let tileCoords = this.id.split('-');
			let x = tileCoords[1];
			let y = tileCoords[2];

			let gatheredTile = MyCraft.grid[x][y].tileType;

			if (checkToolAbility(gatheredTile)) {
				MyCraft.inventory[gatheredTile] = MyCraft.inventory[gatheredTile] + 1;
				MyCraft.grid[x][y].setTile('');
			} else {
				// TODO: Add effect
			}
			
		} else  {

			let tileCoords = this.id.split('-');
			let x = tileCoords[1];
			let y = tileCoords[2];

			if (MyCraft.grid[x][y].tileType=='' && MyCraft.inventory[MyCraft.selectedTile] !== 0) {
				MyCraft.grid[x][y].setTile(MyCraft.selectedTile);
				MyCraft.inventory[MyCraft.selectedTile] = MyCraft.inventory[MyCraft.selectedTile] - 1;
			}
		}

		updateInventory();
	});
}


function setSelectTilesEvent() {
	let toolbarTiles = $('.tileImage');

	toolbarTiles.on('click', function() {
		MyCraft.selectedTile = this.id;
		MyCraft.lastSelected = this.id;

		$('.tileImage').removeClass('selected');
		$('.toolImage').removeClass('selected');
		$('#' + MyCraft.selectedTile).addClass('selected');
	});
}

function setSelectToolsEvent() {
	let toolbarTools = $('.toolImage');

	toolbarTools.on('click', function() {
		MyCraft.selectedTool = this.id;
		MyCraft.lastSelected = this.id;

		$('.tileImage').removeClass('selected');
		$('.toolImage').removeClass('selected');
		$('#' + MyCraft.selectedTool).addClass('selected');
	});
}

function saveGrid (name) {
	let grid = {};

	for (var i = 0; i < MyCraft.rows; i++) {
		for (var j = 0; j < MyCraft.cols; j++) {
			let id = MyCraft.grid[i][j].element.attr('id');
			grid[id] = MyCraft.grid[i][j].toObj();
		}
	}

	var a = document.createElement('a');
	var file = new Blob([JSON.stringify(grid)],{type: "application/json"} );
	console.log(file);
	a.href = URL.createObjectURL(file);
	console.log(URL.createObjectURL(file));
	a.download = name;
	a.click();
}


function loadGrid(filename) {
	var grid = MyCraft.world;

	if (filename) {
		/*
		var fs = require('fs');

		fs.readFileSync(filename, function(data) {
			console.log(data);
			grid = data;

			let id = MyCraft.grid[i][j].element.attr('id');
			MyCraft.grid[i][j].setTile(grid[id].tileType);
		});
		*/

	} else {
		for (var i = 0; i < MyCraft.rows; i++) {
			for (var j = 0; j < MyCraft.cols; j++) {
				let id = MyCraft.grid[i][j].element.attr('id');
				MyCraft.grid[i][j].setTile(grid[id].tileType);
			}
		}
	}		
}


$(document).ready(function() {
	generateGrid();
	setSelectTilesEvent();
	setSelectToolsEvent();

	updateInventory();

	/*var mysave = $('#save');
	mysave.on('click',function() {
		saveGrid("world.json");
	});*/

	loadGrid();

	
	/*var myload = $('#load');
	myload.on('click',function() {
		loadGrid('world.json');
	});*/
});