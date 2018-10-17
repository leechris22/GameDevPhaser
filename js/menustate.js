// MenuState constructor
let menuState = function() {
	// EMPTY
};

// Override create, start MenuState
menuState.prototype.create = function() {
	// Add background
	this.background = game.add.sprite(0, 0, "Titlescreen");
	
	// Add game title text
	let style = {
		font: "bold 60pt Arial",
		fill: "#ffffff",
		align: "center"
	};
	let text = game.add.text(game.world.centerX, game.world.centerY-100, game.global.title, style);
	text.anchor.setTo(0.5, 0.5);
	
	// Add start button
	let startButton = game.add.button(0, 0, "StartButton", function(Button, Pointer, isOver) {
		// Fade to black
		game.camera.fade('#000000');
		game.camera.onFadeComplete.add(function() {
			game.state.start("PlayState");
		},this);
	}, this, 1, 0, 2, 0);
	startButton.scale.x = 3;
	startButton.scale.y = 3;
	startButton.centerX = game.world.centerX;
	startButton.centerY = game.world.centerY + 250;
};
