let Player = function() {};

Player.prototype.preload = function() {};

Player.prototype.create = function(x, y) {
    // construct sprite for the player
    this.player = game.add.sprite(x, y, "Player", 0);

    // initialize all needed player variabels
    this.player.anchor.setTo(0.5, 0.5);
    this.player.maxHealth = 6;
    this.player.health = 6;
    this.player.ammo = 4;
    this.player.speed = 200;
    this.player.damage = 1;
    this.player.movingRight = false;
    this.player.movingLeft = false;
    this.player.movingUp = false;
    this.player.movingDown = false;
    this.player.direction = "S";
    this.player.attacking = 0;
    this.player.power = 1;
    this.scale = game.global.scale;
    this.attackSound = game.add.audio("playermelee", 0.10, false);
    this.arrowSound = game.add.audio("arrowshot", 0.50, false);
    this.playerHurt = game.add.audio("playerhurt", 1.60, false);
    this.playerDeath = game.add.audio("playerdeath", 0.4, false);
    offset = 35;

    // add in animations for the player
    this.player.animations.add("left", [19,20,21,22,23,24,25,26,27], 6, true);
    this.player.animations.add("right", [10,11,12,13,14,15,16,17,18], 6, true);
    this.player.animations.add("up", [5,6,7,8,9], 5, true);
    this.player.animations.add("down", [1,2,3,4], 5, true);
	this.player.animations.add("damage", [0, 0, 0, 0], 10, false);
	this.player.animations.add("death", [0,5,10,19], 10, false);

    // set up player physics
    this.player.inputEnabled = true;
    game.physics.arcade.enable(this.player);
    this.player.body.width = 66;
    this.player.body.height = 190;
		
	// Initialize bullet group
	this.bullets = game.add.group();
	this.bullets.enableBody = true;
	this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
	this.bullets.createMultiple(15, "arrow");
	this.bullets.setAll("inputEnabled", true);
	this.bullets.setAll("anchor.x", 0.5);
	this.bullets.setAll("anchor.y", 0.5);
	this.bullets.setAll("body.width", 20);
	this.bullets.setAll("body.height", 20);
};

Player.prototype.update = function() {
	if (this.player.alive) {
		this.movement();
		game.input.onTap.add(this.shoot, this);
	}
};

// function to check collision hit box and call attack() or takeDamage() accordingly
Player.prototype.checkHitBox = function(self, target) {
	// determine if the player is attacking or if they have been attacked
	if (this.isAttacking(target)) { // player successfully attacked
        target.damage(this.player.damage);
        this.attackSound.play();
	} else { // player was attacked
        if (!game.global.debug) {
            this.takeDamage(target);
        }
	}
};

// helper function for checking the hitboxs, determines if player is attacking or being attacked
Player.prototype.isAttacking = function(target) {
    // update the direction of the player when the collision occured
    this.getDirection();

    // conditionals to determine if the player successfully attacked
    if(this.player.body.touching.left) {
        if((this.player.direction == "SW") || (this.player.direction == "W") || (this.player.direction == "NW")) {
            return true;
        }
    } else if(this.player.body.touching.right) {
        if((this.player.direction == "SE") || (this.player.direction == "E") || (this.player.direction == "NE")) {
            return true;
        }
    } else if(this.player.body.touching.up) {
        if((this.player.direction == "NE") || (this.player.direction == "N") || (this.player.direction == "NW")) {
            return true;
        }
    } else if(this.player.body.touching.down) {
        if((this.player.direction == "SE") || (this.player.direction == "S") || (this.player.direction == "SW")) {
            return true;
        }
    }
	return false;
};

// function to do processing for being attacked by an enemy
Player.prototype.takeDamage = function(target) {
    // take health from player by target.damage
    this.playerHurt.play();
    this.player.health -= target.power;
    this.player.body.checkCollision.none = true;
    this.player.x -= Phaser.Math.sign(target.body.x - this.player.body.x) * 40;
    this.player.y -= Phaser.Math.sign(target.body.y - this.player.body.y) * 40;
	this.player.game.global.UI.currentHealth = this.player.health;
	this.player.game.global.UI.updateHealth();

    // check for if player has been killed
    if (this.player.health <= 0) {
        this.playerDeath.play();
        this.kill();
    }
	
	// Play damaged animation
	this.player.animations.play("damage");
	this.player.events.onAnimationComplete.addOnce(function() {
		this.player.body.checkCollision.none = false;
	}, this);
};

// player movement function to be called in update
Player.prototype.movement = function() {
    // if the left mouse button is being held down
    let touch = game.input.activePointer.leftButton;
    let touch_x = game.input.mousePointer.worldX/2;
    let touch_y = game.input.mousePointer.worldY/2;

    // reinitialize all movement direction to false
    this.player.movingLeft = false;
    this.player.movingRight = false;
    this.player.movingUp = false;
    this.player.movingDown = false;

    // check for if the left mouse button is being held down
    if (touch.isDown) {
        // movement adjustment for the x coordinate of the player
        if((touch_x > this.player.x - offset) && (touch_x < this.player.x + offset)) {
            this.player.body.velocity.x = 0;
        } else if(touch_x > this.player.x) { // click is to left of player
            this.player.body.velocity.x = this.player.speed;
            this.player.movingRight = true;
        } else if(touch_x < this.player.x) { // click is to right of player
            this.player.body.velocity.x = -this.player.speed;
            this.player.movingLeft = true;
        }

        // movement adjustment for the y coordinate of the player
        if((touch_y > this.player.y - offset) && (touch_y < this.player.y + offset)) {
            this.player.body.velocity.y = 0;
        } else if(touch_y > this.player.y) { // click is below player
            this.player.body.velocity.y = this.player.speed;
            this.player.movingDown = true;
        } else if(touch_y < this.player.y) { // click is above player
            this.player.body.velocity.y = -this.player.speed;
            this.player.movingUp = true;
        }
    } else {
		this.player.body.velocity.setTo(0);
	}

    // decide what animation to play
    if(this.player.movingRight) {
        this.player.animations.play("right");
    } else if(this.player.movingLeft) {
        this.player.animations.play("left");
    } else if(this.player.movingUp) {
        this.player.animations.play("up");
    } else if(this.player.movingDown) {
        this.player.animations.play("down");
    } else if (this.player.animations.currentAnim.name !== "damage") {
        this.player.animations.stop();
        this.player.frame = 0;
		this.player.direction = "S";
    }
    this.player.body.checkCollision.none = false;
};

// function to use arrow powerup if the player has available arrows
Player.prototype.shoot = function() {
    if (this.player.ammo > 0) {
        // shoot arrow and lose an arrow
		let bullet = this.bullets.getFirstExists(false);
        bullet.power = 2;
        if (this.shootDirection(bullet)) {
            this.arrowSound.play();
            this.player.ammo--;
			this.player.game.global.UI.numArrows = this.player.ammo;
			this.player.game.global.UI.updateArrowCount();
        }
    }
};

// helper function for checking the hitboxs, updates the players direction
Player.prototype.getDirection = function() {
    if(this.player.movingUp && this.player.movingRight) { // Northeast
        this.player.direction = "NE";
    } else if(this.player.movingDown && this.player.movingRight) { // Southeast
        this.player.direction = "SE";
    } else if(this.player.movingDown && this.player.movingLeft) { // Southwest
        this.player.direction = "SW";
    } else if(this.player.movingUp && this.player.movingLeft) { // Northwest
        this.player.direction = "NW";
    } else if(this.player.movingUp) { // North
        this.player.direction = "N";
    } else if(this.player.movingRight) { // East
        this.player.direction = "E";
    } else if(this.player.movingDown) { // South
        this.player.direction = "S";
    } else if(this.player.movingLeft) { // West
        this.player.direction = "W";
    }
};

// helper function to detemine which direction the arrow was shot
Player.prototype.shootDirection = function(bullet) {
    // update the direction of the player to where the arrow was shot
    this.getDirection();

    // determine the velocity of the bullet according to the direction
    if(this.player.direction == "N") {
        bullet.reset(this.player.x, this.player.y);
        bullet.body.velocity.setTo(0, -707);
        bullet.angle -= 90;
		bullet.body.offset.y = -115;
        bullet.body.offset.x = 45;
        return true;
    } else if(this.player.direction == "E") {
        bullet.reset(this.player.x, this.player.y);
        bullet.body.velocity.setTo(707, 0);
        bullet.body.offset.x = 160;
        return true;
    } else if(this.player.direction == "S") {
        bullet.reset(this.player.x, this.player.y);
        bullet.body.velocity.setTo(0, 707);
        bullet.angle = 90;
		bullet.body.offset.y = 115;
        bullet.body.offset.x = 45;
        return true;
    } else if(this.player.direction == "W") {
        bullet.reset(this.player.x, this.player.y);
        bullet.body.velocity.setTo(-707, 0); 
        bullet.angle += 180;
        bullet.body.offset.x = -70;
        return true;
    }
    return false;
};

// function to kill player when the player runs out of health
Player.prototype.kill = function() {
	// Set death variables
	this.player.alive = false;
	this.player.body.velocity.setTo(0);
	
	// Play death animation
	this.player.animations.stop();
	this.player.animations.play("death");
	this.player.events.onAnimationComplete.addOnce(function() {
		game.camera.fade('#CD3333');
		game.camera.onFadeComplete.add(function() {
			game.sound.stopAll();
			game.state.start("EndState");
		},this);
	}, this);
	return this;
};
