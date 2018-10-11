let Player = function() {};

Player.prototype.preload = function() {};

Player.prototype.create = function(x, y, cam) {
    // construct sprite for the player
    this.player = game.add.sprite(x, y, "murph");

    // initialize all needed player variabels
    this.player.anchor.setTo(0.5, 0.5);
    this.player.health = 10;
    this.player.ammo = 0;
    this.player.speed = 2;
    this.player.damage = 1;
    this.player.x = x;
    this.player.y = y;
    this.player.movingRight = false;
    this.player.movingLeft = false;
    this.player.movingUp = false;
    this.player.movingDown = false;
    this.player.direction = "S";
    this.player.attacking = 0;
    this.player.camera = cam;
    this.player.timer = 0;
    this.player.clock = 0;

    // add in animations for the player
    this.player.animations.add("left", [0, 1, 2, 3], 10, true);
    this.player.animations.add("right", [5, 6, 7, 8], 10, true);

    // set up player physics
    this.player.inputEnabled = true;
    game.physics.arcade.enable(this.player);
};

Player.prototype.update = function() {
    game.input.activePointer.leftButton.onUp.add(this.shoot, this, 0);
    this.movement();
};

// function to check collision hit box and call attack() or takeDamage() accordingly
    // will be called from wherever collisions between player and group of enemies is checked
Player.prototype.checkHitBox = function(target) {
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

// function to do processing for attacking an enemy 
Player.prototype.attack = function(target) {
    // play player attack animation
    this.player.animations.play("attack");
    
    // take health from target
    target.damage(this.player.damage);

    // knockback target
    target.body.bounce.setTo(0.4, 0.4);
};

// function to do processing for being attacked by an enemy
Player.prototype.takeDamage = function(target) {
    // take health from player by target.damage
    this.player.health -= target.damage;

    // knockback player
    this.player.body.bounce.setTo(0.4, 0.4);

    // flash effect on player
    this.player.animations.stop();
    this.player.frame = 4; // play frame that has white fill of sprite
};

// player movement function to be called in update
Player.prototype.movement = function() {
    // if the left mouse button is being held down
    let touch = game.input.activePointer.leftButton;
    let touch_x = game.input.mousePointer.worldX/3;
    let touch_y = game.input.mousePointer.worldY/3;

    // reinitialize all movement direction to false
    this.player.movingLeft = false;
    this.player.movingRight = false;
    this.player.movingUp = false;
    this.player.movingDown = false;

    // check for if the left mouse button is being held down
    if(touch.isDown) {
        // movement adjustment for the x coordinate of the player
        if((touch_x - 4.5) > (this.player.x + 4.5)) { // click is to left of player
            this.player.x += this.player.speed;
            this.player.body.velocity.x = this.speed;
            this.player.movingRight = true;
        } else if((touch_x - 4.5) < (this.player.x - 4.5)) { // click is to right of player
            this.player.x -= this.player.speed;
            this.player.body.velocity.x = -this.speed;
            this.player.movingLeft = true;
        } else {
            this.player.body.velocity.x = 0;
        }

        // movement adjustment for the y coordinate of the player
        if((touch_y - 4.5) > (this.player.y + 4.5)) { // click is below player
            this.player.y += this.player.speed;
            this.player.body.velocity.y = this.speed;
            this.player.movingDown = true;
        } else if((touch_y - 4.5) < (this.player.y - 4.5)) { // click is above player
            this.player.y -= this.player.speed;
            this.player.body.velocity.y = -this.speed;
            this.player.movingUp = true;
        } else {
            this.player.body.velocity.y = 0;
        }
    }

    // decide what animation to play
    if(this.player.movingRight) {
        this.player.animations.play("right");
    } else if(this.player.movingLeft) {
        this.player.animations.play("left");
    } else {
        this.player.animations.stop();
        this.player.frame = 4;
    }
};

// function to use arrow powerup if the player has available arrows
Player.prototype.shoot = function() {
    if(this.player.ammo > 0) {
        // shoot arrow and lose an arrow
        this.bullet = game.add.sprite(this.player.x, this.player.y, "murph");
        this.bullet.inputEnabled = true;
        this.bullet.anchor.setTo(0.5, 0.5);
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

// helper function for checking the hitboxs, determines if player is attacking or being attacked
Player.prototype.isAttacking = function(target) {
    // update the direction of the player when the collision occured
    this.getDirection();

    // conditionals to determine if the player successfully attacked
    if(this.player.x < target.x) { // all the east checks
        if((this.player.y < target.y) && (this.player.direction == "SE")) {
            this.player.attacking = true;
        } else if((this.player.y > target.y) && (this.player.direction == "NE")) {
            this.player.attacking = true;
        } else if((this.player.y == target.y) && (this.player.direction == "E")) {
            this.player.attacking = true;
        }
    } else if(this.player.x > target.x) { // all the west checks
        if((this.player.y < target.y) && (this.player.direction == "SW")) {
            this.player.attacking = true;
        } else if((this.player.y > target.y) && (this.player.direction == "NW")) {
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
    }
};

Player.prototype.shootDirection = function(bullet) {
    // update the direction of the player to where the arrow was shot
    this.getDirection();

    // determine the velocity of the bullet according to the direction
    if(this.player.direction == "NE") { bullet.body.velocity.setTo(500, -500); }
    else if(this.player.direction == "SE") { bullet.body.velocity.setTo(500, 500); }
    else if(this.player.direction == "SW") { bullet.body.velocity.setTo(-500, 500); }
    else if(this.player.direction == "NW") { bullet.body.velocity.setTo(-500, -500); }
    else if(this.player.direction == "N") { bullet.body.velocity.setTo(0, -500); }
    else if(this.player.direction == "E") { bullet.body.velocity.setTo(500, 0); }
    else if(this.player.direction == "S") { bullet.body.velocity.setTo(0, 500); }
    else if(this.player.direction == "W") { bullet.body.velocity.setTo(-500, 0); }
};