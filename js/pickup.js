// Enemy constructor
//param is either the amount of health or the number of arrows to pick up
let Pickup = function(game, x, y, type, param) {
	
    
    
    
    
    // Extend sprite object
	Phaser.Sprite.call(this, game, x, y, "");
	
	// Set to center
	this.anchor.setTo(0.5, 0.5);
		
    
    if (type === "arrow") {
        game.add.sprite(x, y, "pickupArrow");
        this.numArrows = param;
    } else if (type === "health") {
        game.add.sprite(x, y, "pickupHealth");
        this.health = param;
    } else {
        console.log("Error: Pickup type is not valid.");
    }
    
    this.dropType = type;

    
    game.physics.arcade.enable(this);
	game.add.existing(this);
};

Pickup.prototype = Object.create(Phaser.Sprite.prototype);
Pickup.prototype.constructor = Pickup;

// For each frame
Pickup.prototype.update = function() {
    //check for collision
};

Pickup.prototype.collideWithPlayer = function(target) {
    if (this.dropType === "arrow") {
        target.ammo += this.numArrows;
    } else {
        target.health += this.health;
    }
    
    this.kill();
};
