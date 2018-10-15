// PreloadState constructor
let preloadState = function() {
	// EMPTY
};

// Load all assets
preloadState.prototype.preload = function() {
	// INSERT IMAGES
	game.load.spritesheet("StartButton", "assets/Images/startbutton.png", 150, 50);
    game.load.image("Background", "assets/Images/background.png");
	game.load.spritesheet("Player", "assets/Images/schoolgirl.png", 64, 128);
	game.load.image("Enemy", "assets/Images/enemy.png");
    game.load.image("Wall", "assets/Images/wall.png");
	game.load.image("sky", "assets/Images/sky.png");
	game.load.image("platform", "assets/Images/platform.png");
	game.load.image("star", "assets/Images/star.png");
	game.load.image("arrow", "assets/Images/arrow.png");
    game.load.image("pickupArrow", "assets/Images/temp_arrow.png");
    game.load.image("pickupHealth", "assets/Images/temp_health.png");
	game.load.audio("schoolgirl", "assets/Music/mainsoundtrack.wav");
	//Load tilemap
	//game.load.tilemap(/*name of map*/, /*Assets/filename.json*/, null, Phaser.Tilemap.TILED_JSON);
};

// Override create, start MenuState
preloadState.prototype.create = function() {
	game.state.start("MenuState");
};
