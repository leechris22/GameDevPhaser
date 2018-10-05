// MenuState constructor
let menuState = function() {
	// EMPTY
};

// Override create, start MenuState
menuState.prototype.create = function() {
	// Add game title text
	let style = {
		font: "bold 30pt Arial",
		fill: "#ffffff",
		align: "center"
	};
	let text = game.add.text(game.world.centerX, game.world.centerY-100, game.global.title, style);
	text.anchor.setTo(0.5, 0.5);
	
	// Add start button
	let startButton = game.add.button(0, 0, "StartButton", function(Button, Pointer, isOver) {
		game.state.start("PlayState");
	});
	startButton.centerX = game.world.centerX;
	startButton.centerY = game.world.centerY;
};
