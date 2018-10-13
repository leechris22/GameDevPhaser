// Walls holds the location of all walls
let Walls = function(game, size) {
	// Initialize variables
	this.game = game;
	this.player = game.global.player.player;
	
	// Set up walls
	this.walls = game.add.group();
	this.walls.enableBody = true;
	this.walls.physicsBodyType = Phaser.Physics.ARCADE;
	this.walls.createMultiple(size, "Wall");
	this.walls.setAll("anchor.x", 0.5);
	this.walls.setAll("anchor.y", 0.5);
	this.walls.setAll("body.immovable", true);
	let scale = game.global.scale;
	let wall = this.walls.getAt(0);
	this.walls.setAll("body.width", wall.width*scale);
	this.walls.setAll("body.height", wall.height*scale);
	this.walls.setAll("body.offset.x", -wall.width/2);
	this.walls.setAll("body.offset.y", -wall.height/2);
};

// For each frame
Walls.prototype.update = function() {
	this.game.physics.arcade.collide(this.player, this.walls);
	
/*	// TESTING
	if (this.game.input.keyboard.isDown(Phaser.KeyCode.D) && this.walls.countLiving() === 0) {
		this.spawnEnemy(0,0);
	}

	if (this.game.input.keyboard.isDown(Phaser.KeyCode.A)) {
		console.log(this.walls.countLiving());
		console.log(this.a);
	}*/
}

// Add a wall at cooredinate x, y
// Return true if wall successfully added
Walls.prototype.spawnEnemy = function(x, y) {
	let wall = this.walls.getFirstExists(false);
	this.a = wall;
	if (wall) {
		wall.reset(x, y);
		return true;
	}
	return false;
}