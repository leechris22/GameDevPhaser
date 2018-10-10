// PreloadState constructor
let preloadState = function() {
	// EMPTY
};

// Load all assets
preloadState.prototype.preload = function() {
	// INSERT IMAGES
	game.load.image("StartButton", "assets/Images/startbutton.png");
	game.load.image("Enemy", "assets/Images/enemy.png");
	game.load.image("sky", "assets/Images/sky.png");
	game.load.image("platform", "assets/Images/platform.png");
	game.load.image("star", "assets/Images/star.png");
	game.load.spritesheet("murph", "assets/Images/character.png", 32, 48);
	game.load.audio("schoolgirl", "assets/Music/schoolgirldraft.wav");
};

// Override create, start MenuState
preloadState.prototype.create = function() {
	game.state.start("MenuState");
};