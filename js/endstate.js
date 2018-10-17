// MenuState constructor
let endState = function() {
	// EMPTY
};

// Override create, start MenuState
endState.prototype.create = function() {
	// Add background
	game.world.setBounds(0, 0, 2436, 1125);
	game.camera.scale.setTo(1);
	this.background = game.add.sprite(0, 0, "Endscreen");
	if (this.game.global.highscore < this.game.global.UI.score) {
		this.game.global.highscore = this.game.global.UI.score;
	}
	// Add game title text
	let style = {
		font: "bold 60pt Arial",
		fill: "#000000",
		align: "center"
	};

	let style2 = {
		font: "bold 44pt Arial",
		fill: "#000000",
		align: "center"
	};

	let style3 = {
		font: "bold 30pt Arial",
		fill: "#000000",
		align: "center"
	};

	this.text = game.add.text(game.world.centerX, game.world.centerY-300, "GAME OVER", style);
	this.text.anchor.setTo(0.5, 0.5);
	this.highscore = game.add.text(game.world.centerX, game.world.centerY-100, "Score: "+this.game.global.UI.score+"\nHighscore: "+this.game.global.highscore, style);
	this.highscore.anchor.setTo(0.5, 0.5);
	this.developers = game.add.text(320, 260, this.game.global.developers, style2);
	this.developers.anchor.setTo(0.5, 0.5);
	this.credits = game.add.text(1800, 1000, this.game.global.credits, style3);
	this.credits.anchor.setTo(0.5, 0.5);
	
	// Add start button
	this.menuButton = game.add.button(0, 0, "RestartButton", function(Button, Pointer, isOver) {
		// Fade to black
		game.camera.fade('#000000');
		game.camera.onFadeComplete.add(function() {
			game.state.start("MenuState");
		},this);
	}, this, 1, 0, 2, 0);
	this.menuButton.scale.x = 3;
	this.menuButton.scale.y = 3;
	this.menuButton.centerX = game.world.centerX;
	this.menuButton.centerY = game.world.centerY + 250;
};
