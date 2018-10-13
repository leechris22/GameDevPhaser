// Spawn handles all enemy spawns and collisions
// Size represents the max number of enemies at any given time.
let Spawn = function(game, size) {
	// Initialize variables
	this.game = game;
	this.player = game.global.player.player;
	
	// Set up offscreen spawns
	this.spawnbox = game.camera.view;
	this.scale = game.global.scale;
	
	// Set up a list of spawns
	this.spawners = [];
	
	// Set up enemies
	this.enemies = game.add.group();
	this.enemies.classType = Enemy;
	this.enemies.enableBody = true;
	this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
	this.enemies.createMultiple(size, "Enemy");
};

// For each frame
Spawn.prototype.update = function() {
	/*this.game.physics.arcade.collide(this.enemies);
	
	// TESTING
	if (this.game.input.keyboard.isDown(Phaser.KeyCode.D)) {
		this.spawnOffscreen(0);
	}

	if (this.game.input.keyboard.isDown(Phaser.KeyCode.A)) {
		console.log(this.enemies.countLiving());
	}

	this.despawnEnemies();*/
}

// Changes the maximum number of enemies
// Returns true if the size is changed
Spawn.prototype.setSize = function(size) {
	if (size >= 0 && size !== this.enemies.length) {
		if (size > this.enemies.length) {
			this.enemies.createMultiple(size - this.enemies.length, "Enemy");
		} else if (size < this.enemies.length) {
			let amount = this.enemies.length - size;
			for (i = 0; i < amount; i++) {
				let enemy = this.enemies.removeChildAt(0);
				enemy.destroy();
			}
		}
		return true;
	}
	return false;
}

// Spawn an enemy offscreen
// Side represents which side the enemy spawns in respect to the camera
// 0 - UP, 1 - DOWN, 2 - LEFT, 3 - RIGHT
// Return true if enemy successfully spawned
Spawn.prototype.spawnOffscreen = function(side) {
	let enemy = this.enemies.getFirstExists(false);
	if (enemy) {
		switch (side) {
			case 0:
				enemy.reset(this.spawnbox.randomX/this.scale, this.spawnbox.top/this.scale-100);
				break;
			case 1:
				enemy.reset(this.spawnbox.randomX/this.scale, this.spawnbox.bottom/this.scale+100);
				break;
			case 2:
				enemy.reset(this.spawnbox.left/this.scale-100, this.spawnbox.randomY/this.scale);
				break;
			case 3:
				enemy.reset(this.spawnbox.right/this.scale+100, this.spawnbox.randomY/this.scale);
				break;
		}
		return true;
	}
	return false;
}

// Add a new spawn area as a rectangle
// x,y are the top left point of the spawn rectangle
// width and height determine the size
// Returns the new spawner index
Spawn.prototype.addSpawner = function(x, y, width, height) {
	this.spawners.push(new Phaser.Rectangle(x, y, width, height));
	return this.spawners.length - 1;
}

// Add an enemy at spawn area i
// i is the spawn area index
// Return true if enemy successfully added
Spawn.prototype.spawnEnemy = function(i) {
	let enemy = this.enemies.getFirstExists(false);
	if (enemy && i >= 0 && i < this.spawners.length) {
		enemy.reset(this.spawners[i].randomX, this.spawners[i].randomY);
		return true;
	}
	return false;
}

// Despawn any enemies that go too far offscreen
Spawn.prototype.despawnEnemies = function() {
	let despawnRect = this.spawnbox.clone();
	despawnRect.inflate(350, 350);
	this.enemies.forEachAlive(function(child) {
		if (!despawnRect.contains(child.centerX*this.scale, child.centerY*this.scale)) {
			child.remove();
		}
	}, this);
}