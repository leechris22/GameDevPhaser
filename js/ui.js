// Enemy constructor
//param is either the amount of health or the number of arrows to pick up
let UI = function(game, maxHealth) {
    game.UI = this;
    game.UI.currentHealth = 10;
    game.UI.maxHealth = maxHealth;
    
    
    //add health bar
    //add arrow count
    //add text score
};

UI.prototype = Object.create(Phaser.Sprite.prototype);
UI.prototype.constructor = UI;

// For each frame
UI.prototype.update = function() {
    //check for collision
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
