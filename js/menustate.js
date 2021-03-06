// MenuState constructor
let menuState = function() {
	// EMPTY
};

// Override create, start MenuState
menuState.prototype.create = function() {
	// Add background
	this.background = game.add.sprite(0, 0, "Title");
	
	// Add game title text
	let style = {
		font: "bold 160pt Arial",
		fill: "#ff0000",
		align: "center"
	};
	this.text = game.add.text(game.world.centerX, game.world.centerY-100, game.global.title, style);
	this.text.anchor.setTo(0.5, 0.5);
	
	// Add start button
	this.startButton = game.add.button(0, 0, "StartButton", function(Button, Pointer, isOver) {
		// Fade to black
		game.camera.fade('#000000');
		game.camera.onFadeComplete.add(function() {
			game.state.start("PlayState");
		},this);
	}, this, 1, 0, 2, 0);
	this.startButton.scale.x = 3;
	this.startButton.scale.y = 3;
	this.startButton.centerX = game.world.centerX;
	this.startButton.centerY = game.world.centerY + 250;
};
