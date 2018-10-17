// Enemy constructor
//param is either the amount of health or the number of arrows to pick up
let UI = function(_maxHealth) {
    game.global.UI = this;
    this.currentHealth = 10;
    this.maxHealth = _maxHealth;
    
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
    //this.textScore = game.add.text(1050, 25, "0", style);
    //this.textScore.fixedToCamera = true;
    //this.textScore.scale.setTo(1 / game.global.scale);
    
    this.arrowScore = game.add.text(1050, 25, "Arrows: 0", style);
    this.arrowScore.fixedToCamera = true;
    this.arrowScore.scale.setTo(1 / game.global.scale);
    this.playerScore = 0;
    this.numArrows = 0;
    this.currentHealth = 0;
};

UI.prototype = Object.create(Phaser.Sprite.prototype);
UI.prototype.constructor = UI;

// For each frame
UI.prototype.update = function() {
    //check for collision
    this.healthBar.scale.x = (this.currentHealth) / (this.maxHealth * game.global.scale);
    //this.textScore.text = this.playerScore.toString();
    this.arrowScore.text = "Arrows: " + this.numArrows.toString();
};

UI.prototype.updateScore = function(score) {
    this.playerScore = score;
};

UI.prototype.updateArrowCount = function(count) {
    this.numArrows = count;
};

UI.prototype.updateHealth = function(health) {
    this.currentHealth = health;
}
