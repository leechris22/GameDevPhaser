// PlayState constructor
let playState = function() {
	// EMPTY
};

var map;
var groundLayer;
var fenceLayer;

// Override create
playState.prototype.create = function() {
	// Set the playing field
	game.world.setBounds(-1500, -750, 3000, 1500);
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//	Add map to game
	map = game.add.tilemap("levelmap");
	map.addTilesetImage("leveltileset", "leveltiles");
	groundLayer = map.createLayer("Ground");
	fenceLayer = map.createLayer("Fences");
	
	// Add the music and visuals
	//this.background = game.add.sprite(-1500, -750, "Background");
	music = game.add.audio('schoolgirl', 1, true);
	music.play();

	// Create the global player
	game.global.player = new Player();
	game.global.player.create(300, 300);	
	
	// Initialize player dependent classes
	this.spawn = new Spawn(game, 20);
	this.walls = new Walls(game, 20);

	// Set up the camera
	this.mainCamera = game.camera;
    game.camera.follow(game.global.player.player);
	game.camera.scale.setTo(game.global.scale);
	game.camera.resetFX;

    new UI(10);
    game.global.bubbles = [];
    game.global.bubbleSpawner = new BubbleSpawner();
    //game.global.bubbles.push(new Bubble(5, "hello hello hello hello hello hello"));
	//cursors = game.input.keyboard.createCursorKeys();

	//enemy.body.immovable = true;
};

// Override update
playState.prototype.update = function() {
	// Call all sub updates
	this.game.global.player.update();
	this.spawn.update();
	this.walls.update();
    game.global.UI.updateArrowCount(game.global.player.player.ammo);
    game.global.UI.updateHealth(game.global.player.player.health);
    game.global.UI.update();
    game.global.bubbles.forEach(function(element) { element.update()});
    game.global.bubbleSpawner.update();
	// Collisions
	//this.game.physics.arcade.collide(this.game.global.player.player, this.testing);

	console.log(game.global.player.player.health);

	// TESTING
	game.debug.cameraInfo(this.mainCamera, 1000, 50);
	game.debug.spriteInfo(this.game.global.player.player, 100, 50);
};






