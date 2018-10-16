let Player = function() {};

Player.prototype.preload = function() {};

Player.prototype.create = function(x, y) {
    // construct sprite for the player
    this.player = game.add.sprite(x, y, "Player", 0);

    // initialize all needed player variabels
    this.player.anchor.setTo(0.5, 0.5);
    this.player.health = 10;
    this.player.ammo = 10;
    this.player.speed = 200;
    this.player.damage = 1;
    this.player.x = x;
    this.player.y = y;
    this.player.movingRight = false;
    this.player.movingLeft = false;
    this.player.movingUp = false;
    this.player.movingDown = false;
    this.player.direction = "S";
    this.player.attacking = 0;
    this.player.power = 5;
    offset = 35;

    // add in animations for the player
    this.player.animations.add("left", [6], 600, true);
    this.player.animations.add("right", [7], 600, true);
    this.player.animations.add("up", [5], 600, true);
    this.player.animations.add("down", [1,2,3,4], 600, true);

    // set up player physics
    this.player.inputEnabled = true;
    game.physics.arcade.enable(this.player);
    this.player.body.width = 66;
    this.player.body.height = 190;
};

Player.prototype.update = function() {
    this.movement();
    game.input.onTap.add(this.shoot, this);
	game.debug.body(this.player);
};

// function to check collision hit box and call attack() or takeDamage() accordingly
Player.prototype.checkHitBox = function(self, target) {
	// reinitialize everything that needs to be updated after actions
	this.player.body.bounce.setTo(0, 0);
    this.player.attacking = false;
	
	// determine if the player is attacking or if they have been attacked
	this.isAttacking(target);
	if(this.player.attacking) { // player successfully attacked so call attack
		this.attack(target);
	} else { // player was attacked so call takeDamage
		this.takeDamage(target);
	}
};

// helper function for checking the hitboxs, determines if player is attacking or being attacked
Player.prototype.isAttacking = function(target) {
    // update the direction of the player when the collision occured
    this.getDirection();

    // conditionals to determine if the player successfully attacked
    /*if(this.player.x < target.x) { // all the east checks
        if((this.player.y < target.y) && ((this.player.direction == "SE") || (this.player.direction == "S") || (this.player.direction == "E"))) {
            this.player.attacking = true;
        } else if((this.player.y > target.y) && ((this.player.direction == "NE") || (this.player.direction == "N") || (this.player.direction == "E"))) {
            this.player.attacking = true;
        } else if((this.player.y == target.y) && (this.player.direction == "E")) {
            this.player.attacking = true;
        }
    } else if(this.player.x > target.x - offset) { // all the west checks
        if((this.player.y < target.y) && ((this.player.direction == "SW") || (this.player.direction == "S") || (this.player.direction == "W"))) {
            this.player.attacking = true;
        } else if((this.player.y > target.y) && ((this.player.direction == "NW") || (this.player.direction == "N") || (this.player.direction == "W"))) {
            this.player.attacking = true;
        } else if((this.player.y == target.y) && (this.player.direction == "W")) {
            this.player.attacking = true;
        }
    } else if(this.player.x == target.x) { // north and south checks
        if((this.player.y < target.y) && (this.player.direction == "S")) {
            this.player.attacking = true;
        } else if((this.player.y > target.y) && (this.player.direction == "N")) {
            this.player.attacking = true;
        }
    }*/

    if(this.player.body.touching.left) {
        if((this.player.direction == "SW") || (this.player.direction == "W") || (this.player.direction == "NW")) {
            this.player.attacking = true;
        }
    } else if(this.player.body.touching.right) {
        if((this.player.direction == "SE") || (this.player.direction == "E") || (this.player.direction == "NE")) {
            this.player.attacking = true;
        }
    } else if(this.player.body.touching.up) {
        if((this.player.direction == "NE") || (this.player.direction == "N") || (this.player.direction == "NW")) {
            this.player.attacking = true;
        }
    } else if(this.player.body.touching.down) {
        if((this.player.direction == "SE") || (this.player.direction == "S") || (this.player.direction == "SW")) {
            this.player.attacking = true;
        }
    } else {
        this.player.attacking = false;
    }
};

// function to do processing for attacking an enemy 
Player.prototype.attack = function(target) {
    // play player attack animation
    //this.player.animations.play("attack");
    
    // take health from target
    //target.body.sprite.alpha = 0.25;
    target.damage(this.player.damage);
};

// function to do processing for being attacked by an enemy
Player.prototype.takeDamage = function(target) {
    // take health from player by target.damage
    this.player.health -= target.power;

    // knockback player
    this.knockback(target, this.player);
    //this.player.body.bounce.setTo(1, 1);

    // flash effect on player
    //this.player.tint = 0x000000;
    //this.player.tint = 0xffffff;
    //this.player.body.sprite.alpha = 0.25;

    // check for if player has been killed
    if(this.player.health <= 0) {
        this.kill();
    }
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
    } else {
        this.player.animations.stop();
        this.player.frame = 4;
    }
};

// function to use arrow powerup if the player has available arrows
Player.prototype.shoot = function() {
    if(this.player.ammo > 0) {
        // shoot arrow and lose an arrow
        this.bullet = game.add.sprite(this.player.x, this.player.y, "arrow");
        this.bullet.scale.setTo(0.5, 0.5);
        this.bullet.inputEnabled = true;
        this.bullet.anchor.setTo(0, 0);
        game.physics.arcade.enable(this.bullet);
        this.shootDirection(this.bullet);
        this.player.ammo -= 1;
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
    if(this.player.direction == "NE") {
        bullet.body.velocity.setTo(500, -500);
        bullet.angle -= 45;
    } else if(this.player.direction == "SE") {
        bullet.body.velocity.setTo(500, 500); 
        bullet.angle += 45;
    } else if(this.player.direction == "SW") {
        bullet.body.velocity.setTo(-500, 500);
        bullet.angle += 135;
    } else if(this.player.direction == "NW") {
        bullet.body.velocity.setTo(-500, -500);
        bullet.angle -= 135;
    } else if(this.player.direction == "N") {
        bullet.body.velocity.setTo(0, -707);
        bullet.angle -= 90;
    } else if(this.player.direction == "E") {
        bullet.body.velocity.setTo(707, 0);
    } else if(this.player.direction == "S") {
        bullet.body.velocity.setTo(0, 707);
        bullet.angle += 90;
    } else if(this.player.direction == "W") {
        bullet.body.velocity.setTo(-707, 0); 
        bullet.angle += 180;
    }
};

// function to kill player when the player runs out of health
Player.prototype.kill = function() {
    // determine functionality for when the player dies
    //this.player.destroy();
};

// function for collision between arrow and enemy
Player.prototype.arrowHit = function() {
    // determine functionality for when the arrow collides
};

// helper function to detemine which direction to knockback
Player.prototype.knockback = function(attacker, other) {
    // 
    if(attacker.body.velocity.x > 0) {
        if(attacker.body.velocity.y > 0) { // moving southeast
            other.body.x += 30;
            other.body.y += 30;
        } else if(attacker.body.velocity.y < 0) { // moving northeast
            other.body.x += 30;
            other.body.y -= 30;
        } else if(attacker.body.velocity.y == 0) { // moving east
            other.body.x += 42;
        }
    } else if(attacker.body.velocity.x < 0) {
        if(attacker.body.velocity.y > 0) { // moving southwest
            other.body.x -= 30;
            other.body.y += 30;
        } else if(attacker.body.velocity.y < 0) { // moving northwest
            other.body.x -= 30;
            other.body.y -= 30;
        } else if(attacker.body.velocity.y == 0) { // moving west
            other.body.x -= 42;
        }
    } else if(attacker.body.velocity.x == 0) {
        if(attacker.body.velocity.y > 0) { // moving south
            other.body.y += 42;
        } else if(attacker.body.velocity.y < 0) { // moving north
            other.body.y -= 42;
        }
    }
};