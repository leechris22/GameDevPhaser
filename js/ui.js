// Enemy constructor
//param is either the amount of health or the number of arrows to pick up
let UI = function(game, maxHealth) {
    game.UI = this;
    game.UI.currentHealth = 10;
    game.UI.maxHealth = maxHealth;
    
    
    //add health bar
    game.UI.healthBar = game.add.sprite(0, 0, "healthBar");
    //add arrow count
    
    //add text score
    let style = {
        font: "bold 30pt Arial",
        fill: "#ffffff",
        align: "center"
    };
    game.UI.textScore = game.add.text(0, 0, "0", style);
};

UI.prototype = Object.create(Phaser.Sprite.prototype);
UI.prototype.constructor = UI;

// For each frame
UI.prototype.update = function() {
    //check for collision
    game.UI.healthBar.scale.x = game.UI.currentHealth / game.UI.maxHealth;
    game.UI.textScore.text = game.UI.playerScore.toString();
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
