// PreloadState constructor
let preloadState = function() {
	// EMPTY
};

// Load all assets
preloadState.prototype.preload = function() {
	// INSERT IMAGES
    //game.load.image("Titlescreen", "assets/Images/titlescreen.png");
    //game.load.image("Endscreen", "assets/Images/endscreen.png");
	game.load.spritesheet("StartButton", "assets/Images/startbutton.png", 150, 50);
	game.load.spritesheet("RestartButton", "assets/Images/restartbutton.png", 150, 50);
    game.load.spritesheet("Player", "assets/Images/schoolgirl.png", 64, 128);
	game.load.spritesheet("Enemy", "assets/Images/zombie.png", 64, 128);
	game.load.spritesheet("Wall", "assets/images/Tileset.png", 64, 64);
    game.load.spritesheet("bubble", "assets/Images/Bubble.png", 300, 300);
	game.load.image("arrow", "assets/Images/arrow.png");
	game.load.image("arrowPickup", "assets/Images/arrowPickup.png");
    game.load.image("health", "assets/Images/health.png");
    game.load.image("ui_background", "assets/Images/ui_background.png");
    game.load.image("healthBar", "assets/Images/healthbar.png");
	game.load.audio("mainsoundtrack", "assets/Music/mainsoundtrack.wav");
    game.load.audio("softdistorted", "assets/Music/softdistorted.wav");
    game.load.audio("superdistorted", "assets/Music/superdistorted.wav");
	game.load.audio("hyperdistorted", "assets/Music/hyperdistorted.wav");
	game.load.audio("arrowshot", "assets/Music/arrowshot.wav");
	game.load.audio("playermelee", "assets/Music/playermelee.wav");
	game.load.audio("zombiedeath", "assets/Music/zombiedeath.wav");
	game.load.audio("zombiepain", "assets/Music/zombiepain.wav");
	game.load.audio("playerdeath", "assets/Music/playerdeath.wav");
	game.load.audio("playerhurt", "assets/Music/playerhurt.wav");

	//Load tilemap
	game.load.tilemap("levelmap", "assets/levelmap.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("leveltiles", "assets/images/Tileset.png");
};

// Override create, start MenuState
preloadState.prototype.create = function() {
	game.state.start("MenuState");
};
