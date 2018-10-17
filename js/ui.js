// Enemy constructor
//param is either the amount of health or the number of arrows to pick up
let UI = function(game, maxHealth) {
    this.game = game;
    
	// add background
    this.background = game.add.sprite(0, 0, "ui_background");
    this.background.fixedToCamera = true;
    this.background.scale.setTo(1 / game.global.scale);
    //add health bar
    this.healthBar = game.add.sprite(1300, 25, "healthBar");
    this.healthBar.fixedToCamera = true;
    this.healthBar.scale.setTo(1 / game.global.scale);
    //add arrow count
    
    //add text score
    let style = {
        font: "bold 30pt Arial",
        fill: "#ffffff",
        align: "center"
    };
    this.textScore = game.add.text(200, 25, "", style);
    this.textScore.fixedToCamera = true;
    this.textScore.scale.setTo(1 / game.global.scale);
    
    this.arrowScore = game.add.text(1050, 25, "", style);
    this.arrowScore.fixedToCamera = true;
    this.arrowScore.scale.setTo(1 / game.global.scale);
    this.score = 0;
    this.numArrows = this.game.global.player.player.ammo;
    this.currentHealth = this.game.global.player.player.health;
	this.maxHealth = this.game.global.player.player.maxHealth;
	this.updateScore();
	this.updateArrowCount();
	this.updateHealth();
};

UI.prototype = Object.create(Phaser.Sprite.prototype);
UI.prototype.constructor = UI;

// For each frame
UI.prototype.update = function() {
    this.healthBar.alpha = (1 + Math.cos(game.time.time / 1000.0)) / 2.0;
};

UI.prototype.updateScore = function() {
    this.textScore.text = "Score: " + this.score.toString();
};

UI.prototype.updateArrowCount = function() {
    this.arrowScore.text = "Arrows: " + this.numArrows.toString();
};

UI.prototype.updateHealth = function() {
    this.healthBar.scale.x = (this.currentHealth) / (this.maxHealth * game.global.scale);
}
