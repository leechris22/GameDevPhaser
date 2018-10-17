// PlayState constructor
let playState = function() {
	// EMPTY
	var map;
	var groundLayer;
	var fenceLayer;
};

// Override create
playState.prototype.create = function() {
	// Set the playing field
	game.world.setBounds(0, 0, 2560, 2560);
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// Add map to game
	map = game.add.tilemap("levelmap");
	map.addTilesetImage("leveltileset", "leveltiles");
	groundLayer = map.createLayer("Ground");
	fenceLayer = map.createLayer("Fences");
	groundLayer.scrollFactorX = 0.5;
	groundLayer.scrollFactorY = 0.5;
	fenceLayer.scrollFactorX = 0.5;
	fenceLayer.scrollFactorY = 0.5;
	
	// Create the global player
	game.global.player = new Player();
	game.global.player.create(100, 100);

	// Initialize player dependent classes
	this.spawn = new Spawn(game, 20);
	this.others = new Others(game, 280, 5);
	
	// Set up the camera
	this.mainCamera = game.camera;
    game.camera.follow(game.global.player.player);
	game.camera.scale.setTo(game.global.scale);
	game.camera.resetFX;
	
	// Set up walls
	let fences = fenceLayer.getTiles(0, 0, 2560, 2560);
	
	for (let i = 0; i < fences.length; i++) {
		if (fences[i].index != -1) {
			this.others.spawnWall(fences[i].worldX, fences[i].worldY, fences[i].index);
		}
	};

    // Set up the UI
	game.global.UI = new UI(game, game.global.player.player.maxHealth);
    game.global.bubbles = [];
    game.global.bubbleSpawner = new BubbleSpawner();
	
	// Set up stage changes
	this.currentStage = 0;
	
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
};

// Override update
playState.prototype.update = function() {
	// Call all sub updates
	this.game.global.player.update();
	this.spawn.update();
	this.others.update();
	this.game.global.UI.update();
    game.global.bubbles.forEach(function(element) { element.update()});
    game.global.bubbleSpawner.update();
	
	// Collisions
	this.game.physics.arcade.collide(this.spawn.enemies, this.others.walls);
	
	if (upKey.isDown)
    {
        this.game.global.insanityState = 1;
    }
	if (downKey.isDown)
    {
        this.game.global.insanityState = 2;
    }
	if (leftKey.isDown)
    {
        this.game.global.insanityState = 3;
    }
	if (this.currentStage != this.game.global.insanityState) {
		console.log("next state");
		this.currentStage = this.game.global.insanityState;
		switch (this.currentStage) {
			case 1:
				this.game.global.player.player.speed = 250;
				this.spawn.enemies.setAll("body.maxVelocity.x", 200);
				this.spawn.enemies.setAll("body.maxVelocity.y", 200);
				this.spawn.setSize(30);
				this.others.spawntime = 8;
				break;
			case 2:
				this.game.global.player.player.speed = 300;
				this.spawn.enemies.setAll("body.maxVelocity.x", 250);
				this.spawn.enemies.setAll("body.maxVelocity.y", 250);
				this.spawn.setSize(40);
				this.others.spawntime = 6;
				break;
			case 3:
				this.game.global.player.player.speed = 350;
				this.spawn.enemies.setAll("body.maxVelocity.x", 300);
				this.spawn.enemies.setAll("body.maxVelocity.y", 300);
				this.spawn.setSize(50);
				this.spawn.spawntime = 1;
				this.others.spawntime = 4;
				break;
		}
	}
};

