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
	game.world.setBounds(0, 0, 9600, 4480);
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
	game.global.player.create(0, 0);	

    // Set up the UI
	game.global.UI = new UI(game, game.global.player.player.maxHealth);
    game.global.bubbles = [];
    game.global.bubbleSpawner = new BubbleSpawner();
	
	// Initialize player dependent classes
	this.spawn = new Spawn(game, 20);
	this.others = new Others(game, 10500, 5);
	

	// Set up the camera
	this.mainCamera = game.camera;
    game.camera.follow(game.global.player.player);
	game.camera.scale.setTo(game.global.scale);
	game.camera.resetFX;

	let fences = fenceLayer.getTiles(0, 0, 9600, 4480);
	console.log(fences.length);
	for(var i = 0; i < fences.length; i++) {
		//console.log(fences[i].index);
		if(fences[i].index > 0) {
			this.others.spawnWall(fences[i].worldX * game.global.scale, fences[i].worldY * game.global.scale);
			//console.log([fences[i].worldX, fences[i].worldY, fences[i].x, fences[i].y]);
		}
	};
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


	// TESTING
	//game.debug.cameraInfo(this.mainCamera, 1000, 50);
	//game.debug.spriteInfo(this.game.global.player.player, 100, 50);
};






