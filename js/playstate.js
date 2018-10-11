// PlayState constructor
let playState = function() {
	// EMPTY
};

// Override create
playState.prototype.create = function() {
	// globally enable the arcade-style physics system
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	// Add music
	music = game.add.audio('schoolgirl', 1, true);
	music.play();

	this.game.global.player = new Player();
	
	new Enemy(game, 500, 500);

	mainCamera = game.camera;
	mainCamera.scale.x += 2;
	mainCamera.scale.y += 2;
	mainCamera.resetFX;
	this.game.global.player.create(100, 100, mainCamera);
	mainCamera.follow(this.game.global.player.player);
};

// Override update
playState.prototype.update = function() {
	this.game.global.player.update();
};