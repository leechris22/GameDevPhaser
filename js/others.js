// Others holds the location of all objects
let Others = function(game, wallSize, pickupSize) {
	// Initialize variables
	this.game = game;
	this.player = game.global.player.player;
	// Set up offscreen spawns
	this.spawnbox = game.camera.view;
	this.scale = game.global.scale;
	this.spawntime = 10;
	this.idleTimer = 0;
	
	// Set up walls
	this.walls = game.add.group();
	this.walls.enableBody = true;
	this.walls.physicsBodyType = Phaser.Physics.ARCADE;
	this.walls.createMultiple(wallSize, "Wall", 0);
	this.walls.setAll("anchor.x", 0.5);
	this.walls.setAll("anchor.y", 0.5);
	this.walls.setAll("body.immovable", true);
	let wall = this.walls.getAt(0);
	this.walls.setAll("body.width", wall.width*this.scale);
	this.walls.setAll("body.height", wall.height*this.scale);
	this.walls.setAll("body.offset.x", -wall.width/this.scale);
	this.walls.setAll("body.offset.y", -wall.height/this.scale);

	// Set up pickups
	this.pickups = game.add.group();
	this.pickups.enableBody = true;
	this.pickups.physicsBodyType = Phaser.Physics.ARCADE;
	this.pickups.createMultiple(pickupSize, "arrowPickup");
	this.pickups.createMultiple(pickupSize, "health");
	this.pickups.setAll("anchor.x", 0.5);
	this.pickups.setAll("anchor.y", 0.5);
	let pickup = this.pickups.getAt(0);
	this.pickups.setAll("body.width", pickup.width*this.scale);
	this.pickups.setAll("body.height", pickup.height*this.scale);
	this.pickups.setAll("body.offset.x", -pickup.width/this.scale);
	this.pickups.setAll("body.offset.y", -pickup.height/this.scale);
	this.pickups.setAll("alpha", 0);
};

// For each frame
Others.prototype.update = function() {
	this.game.physics.arcade.collide(this.player, this.walls);
	this.game.physics.arcade.overlap(this.player, this.pickups, this.getPickup);
	
	// Spawn at random intervals or maintain at least size/5 zombies
	if (this.idleTimer <= 0) {
		let side = Phaser.Math.trunc(Phaser.Math.random(0, 2));
		if (side === 0) {
			this.spawnPickup(this.spawnbox.randomX/this.scale, this.spawnbox.randomY/this.scale, "arrowPickup")
		} else if (side === 1) {
			this.spawnPickup(this.spawnbox.randomX/this.scale, this.spawnbox.randomY/this.scale, "health")
		}
		this.idleTimer = Phaser.Math.random(this.spawntime, this.spawntime+2) * 1000;
	} else {
		this.idleTimer -= this.game.time.elapsedMS;
	}
}

// Add a wall at cooredinate x, y
// Return true if wall successfully added
Others.prototype.spawnWall = function(x, y, index) {
	let wall = this.walls.getFirstExists(false);
	if (wall) {
		wall.frame = index-1;
		wall.fixedToCamera = false;
		wall.reset(x+32, y+32);
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
		game.add.tween(pickup).to( { alpha: 100 }, 200, Phaser.Easing.Linear.None, true);
		return true;
	}
	return false;
}

// When player overlaps with pickup, change some property based on pickup
Others.prototype.getPickup = function(self, target) {
	if (target.key === "arrowPickup") {
		self.ammo++;
		game.global.UI.numArrows = self.ammo;
		game.global.UI.updateArrowCount();
	} else if (target.key === "health") {
		if (self.health + 3 > self.maxHealth) {
			self.health = self.maxHealth;
		} else {
			self.health += 3;
		}
		game.global.UI.currentHealth = self.health;
		game.global.UI.updateHealth();
	}
	target.alpha = 0;
	target.kill();
}
