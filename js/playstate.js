// PlayState constructor
let playState = function() {
	// EMPTY
};

// Override create
playState.prototype.create = function() {
	// Set the playing field
	game.world.setBounds(-1500, -750, 3000, 1500);
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	// Add the music and visuals
	this.background = game.add.sprite(-1500, -750, "Background");
	music = game.add.audio('schoolgirl', 1, true);
	music.play();
	
	// Create the global player
	game.global.player = new Player();
	game.global.player.create(0, 0, this.mainCamera);
	
	// Initialize player dependent classes
	this.spawn = new Spawn(game, 20);
	this.testing = new Enemy(game, 100, 100);

	// Set up the camera
	this.mainCamera = game.camera;
    game.camera.follow(game.global.player.player);
	game.camera.scale.setTo(game.global.scale);
	game.camera.resetFX;
	

	//cursors = game.input.keyboard.createCursorKeys();
};

// Override update
playState.prototype.update = function() {
	// Call all sub updates
	this.game.global.player.update();
	this.spawn.update();
	
	// Collisions
	this.game.physics.arcade.collide(this.game.global.player.player, this.testing);

	// TESTING
	game.debug.cameraInfo(this.mainCamera, 1000, 50);
	game.debug.spriteInfo(this.testing, 500, 50);
	game.debug.spriteInfo(this.game.global.player.player, 100, 50);

};








