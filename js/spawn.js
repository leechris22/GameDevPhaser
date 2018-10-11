// Spawn constructor, size represents the max number of enemies
let Spawn = function(game, size) {
	// Initialize variables
	this.game = game;
	this.size = size;
	this.player = game.global.player.player;
	
	// Set up offscreen spawns
	this.spawnbox = this.game.camera.view;

	// Set up a list of spawns
	this.spawns = [];
	
	// Set up enemies
	this.enemies = game.add.group();
	this.enemies.classType = Enemy;
	this.enemies.enableBody = true;
	this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
	this.enemies.createMultiple(size, "Enemy");
		
	/* EXTRA
	cursors = game.input.keyboard.createCursorKeys();
	cursors.left.isDown
	*/
};

// For each frame
Spawn.prototype.update = function() {
	// TEMP CODE
	//this.fsm.update();

	if (this.game.input.keyboard.isDown(Phaser.KeyCode.A)) {
		this.addOffscreen(1);
		console.log(true);
	}
	
}


// Spawn an enemy offscreen
// Side represents which side the enemy spawns in respect to the camera
// 0 - UP, 1 - DOWN, 2 - LEFT, 3 - RIGHT
Spawn.prototype.addOffscreen = function(side) {
	console.log("TESTING");
	//let spawnbounds = this.game.camera.view;
	let enemy = this.enemies.getFirstExists(false);
	console.log(enemy);
	switch (side) {
		case 0:
			enemy.reset(this.spawnbox.randomX, this.spawnbox.top);
			break;
		case 1:
			enemy.reset(this.spawnbox.randomX, this.spawnbox.bottom);
			break;
		case 2:
			enemy.reset(this.spawnbox.left, this.spawnbox.randomY);
			break;
		case 3:
			enemy.reset(this.spawnbox.right, this.spawnbox.randomY);
			break;
	}
	console.log(enemy);
}

// Add a new spawn area
Spawn.prototype.addSpawn = function(x, y, width, height) {
	this.spawns.push(new Phaser.Rectangle(x, y, width, height));
}

// Add an enemy
Spawn.prototype.addEnemy = function() {
	if (this.enemies.countLiving !== this.enemies.length) {
		for (i = 0; i < spawns.length; i++) {
			if (this.player.body.center.x && this.player.body.center.x ) {
				let enemy = this.enemies.getFirstExists(false);
				enemy.reset(spawns[i].randomX, spawns[i].randomY);
			}
		}
	}
}
