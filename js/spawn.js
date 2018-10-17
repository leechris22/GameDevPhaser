// Spawn handles all enemy spawns and collisions
// Size represents the max number of enemies at any given time.
let Spawn = function(game, size) {
	// Initialize variables
	this.game = game;
	this.player = game.global.player;
	this.spawntime = 3;
	this.idleTimer = 0;
	
	// Set up offscreen spawns
	this.spawnbox = game.camera.view;
	this.scale = game.global.scale;
	
	// Set up enemies
	this.enemies = game.add.group();
	this.enemies.classType = Enemy;
	this.enemies.enableBody = true;
	this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
	this.enemies.createMultiple(size, "Enemy");
	
	// Set up bullets
	this.bullets = this.player.bullets;
};

// For each frame
Spawn.prototype.update = function() {
	this.game.physics.arcade.collide(this.enemies);
	this.game.physics.arcade.collide(this.player.player, this.enemies, this.player.checkHitBox, null, game.global.player);
	this.game.physics.arcade.overlap(this.bullets, this.enemies, function(self, target) {
		target.damage(self.power);
	});

	// Spawn at random intervals or maintain at least size/5 zombies
	if (this.idleTimer <= 0 || this.enemies.countLiving() < this.enemies.length / 5) {
		let side = Phaser.Math.trunc(Phaser.Math.random(0, 4));
		if (this.game.camera.atLimit.x) {
			if (this.game.camera.x === 0 && side === 2) {
				side++;
			} else if (this.game.camera.x !== 0 && side === 3) {
				side--;
			}
		}
		if (this.game.camera.atLimit.y) {
			if (this.game.camera.y === 0 && side === 0) {
				side++;
			} else if (this.game.camera.y !== 0 && side === 1) {
				side--;
			}
		}
		this.spawnOffscreen(side);
		this.idleTimer = Phaser.Math.random(this.spawntime, this.spawntime+2) * 1000;
	} else {
		this.idleTimer -= this.game.time.elapsedMS;
	}
	
	
	this.despawnEnemies();
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
