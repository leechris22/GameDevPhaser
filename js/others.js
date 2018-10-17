// Others holds the location of all objects
let Others = function(game, wallSize, pickupSize) {
	// Initialize variables
	this.game = game;
	this.player = game.global.player.player;
	this.scale = game.global.scale;
	
	// Set up walls
	this.walls = game.add.group();
	this.walls.enableBody = true;
	this.walls.physicsBodyType = Phaser.Physics.ARCADE;
	this.walls.createMultiple(wallSize, "Wall");
	this.walls.setAll("anchor.x", 0.5);
	this.walls.setAll("anchor.y", 0.5);
	this.walls.setAll("body.immovable", true);
	let wall = this.walls.getAt(0);
	this.walls.setAll("body.width", wall.width*this.scale);
	this.walls.setAll("body.height", wall.height*this.scale);
	this.walls.setAll("body.offset.x", -wall.width/this.scale);
	this.walls.setAll("body.offset.y", -wall.height/this.scale);
	
	// Set up arrow pickups
	this.pickups = game.add.group();
	this.pickups.enableBody = true;
	this.pickups.physicsBodyType = Phaser.Physics.ARCADE;
	this.pickups.createMultiple(pickupSize, "pickupArrow");
	this.pickups.createMultiple(pickupSize, "pickupHealth");
	this.pickups.setAll("anchor.x", 0.5);
	this.pickups.setAll("anchor.y", 0.5);
	let pickup = this.pickups.getAt(0);
	this.pickups.setAll("body.width", pickup.width*this.scale);
	this.pickups.setAll("body.height", pickup.height*this.scale);
	this.pickups.setAll("body.offset.x", -pickup.width/this.scale);
	this.pickups.setAll("body.offset.y", -pickup.height/this.scale);
};

// For each frame
Others.prototype.update = function() {
	this.game.physics.arcade.collide(this.player, this.walls);
	this.game.physics.arcade.overlap(this.player, this.pickups, this.getPickup);

	// TESTING
	/*if (this.game.input.keyboard.isDown(Phaser.KeyCode.D)) {
		this.spawnWall(0,0);
		this.spawnPickup(100,0, "pickupHealth");
	}

	if (this.game.input.keyboard.isDown(Phaser.KeyCode.A)) {
		
	}*/
}

// Add a wall at cooredinate x, y
// Return true if wall successfully added
Others.prototype.spawnWall = function(x, y) {
	let wall = this.walls.getFirstExists(false);
	if (wall) {
		wall.fixedToCamera = false;
		wall.reset(x, y);
		return true;
	}
	return false;
}

// Add the pickup key at cooredinate x, y
// Return true if pickup successfully added
Others.prototype.spawnPickup = function(x, y, key) {
	let pickup = this.pickups.getFirst("key", key);
	if (pickup && this.game.world.bounds.contains(x,y)) {
		pickup.reset(x, y);
		return true;
	}
	return false;
}

// When player overlaps with pickup, change some property based on pickup
Others.prototype.getPickup = function(self, target) {
	if (target.key === "pickupArrow") {
		self.ammo++;
		this.game.global.UI.numArrows = self.ammo;
		this.game.global.UI.updateArrowCount();
	} else if (target.key === "pickupHealth") {
		self.health += 5;
		this.game.global.UI.currentHealth = self.health;
		this.game.global.UI.updateHealth();
	}
	target.kill();
}
