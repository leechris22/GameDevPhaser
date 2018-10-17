// Enemy constructor
let Enemy = function(game, x, y, key = "Enemy", frame = 0) {
	// Extend sprite object
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	// Set up animations
	//this.animations.add("left", [8,9], 10, true);
    //this.animations.add("right", [1,2], 10, true);
    //this.animations.add("up", [11,12,13], 10, true);
    //this.animations.add("down", [4,5,6], 10, true);
	this.animations.add("damage", [0,1,0,1,0], 5, false);
	this.animations.add("death", [0,1,0,1,0], 5, false);
	
	// Set variables
	this.game = game;
	this.player = game.global.player.player;
	this.scaling = game.global.scale;
	this.maxHealth = 2;
	this.power = 1;
	this.anchor.setTo(0.5);
	this.active = true;
	
	// Setup physics
    game.physics.arcade.enable(this);
	this.body.setSize(this.width*this.scaling, this.height*this.scaling, -this.width/this.scaling, -this.height/this.scaling);
	this.body.maxVelocity.setTo(100);
	this.body.bounce.setTo(0.5);
	
	// Setup AI
	this.activeState = this.chase;
	this.idleTimer = 0;
	this.target = this.game.global.player.player;
	this.path = [];
	this.pathcount = 0;
	
	game.add.existing(this);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// For each frame
Enemy.prototype.update = function() {
	if (this.active) {
		this.activeState();
	}
}

// When the enemy takes damage, reduce hp by amount
// At 0 hp, call kill function
Enemy.prototype.damage = function(amount) {
	// Apply invulnerability frames
	this.active = false;
	this.x += Phaser.Math.sign(this.body.x - this.player.body.x) * 50;
    this.y += Phaser.Math.sign(this.body.y - this.player.body.y) * 50;
	this.body.velocity.setTo(0);
		
	// Take damage
	this.health -= amount;
	if (this.health <= 0) {
		this.kill();
		return true;
	}
	
	// Play damaged animation
	this.animations.play("damage");
	this.events.onAnimationComplete.addOnce(function() {
		this.active = true;
	}, this);
	return false;
}

// When this dies, play death animation
Enemy.prototype.kill = function() {
	// Set death variables
	this.alive = false;
	this.body.velocity.setTo(0);
	this.body.checkCollision.none = true;
	
	// Play death animation
	this.animations.stop();
	this.animations.play("death");
	this.events.onAnimationComplete.addOnce(function() {
		this.exists = false;
		this.visible = false;
	}, this);
	if (this.events) {
		this.events.onKilled$dispatch(this);
	}
	return this;
};

// When the enemy moves out of the bounds, remove it
Enemy.prototype.remove = function() {
	this.alive = false;
	this.exists = false;
	this.visible = false;
	return this;
};

// Resets the enemy properties and position to x,y
Enemy.prototype.reset = function(x, y) {
	this.position.setTo(x, y);
	this.world.setTo(x, y);
	this.fresh = true;
	this.exists = true;
	this.visible = true;
	this.alive = true;
	this.health = this.maxHealth;
	this.active = true;
	this.body.checkCollision.none = false;
	this.body.reset(x, y, false, false);
	return this;
};

// Add point to the path
Enemy.prototype.addPath = function(point) {
	this.path.push(point);
}

// Move around while on idle state
Enemy.prototype.idle = function() {
	if (this.idleTimer <= 0) {
		let direction = new Phaser.Point(Phaser.Math.random(-10, 10), Phaser.Math.random(-10, 10));
		direction = Phaser.Point.multiply(direction.normalize(), this.body.maxVelocity)
		this.body.velocity.set(direction.x, direction.y);
		this.game.time.events.add(1000 * Phaser.Math.random(0.1, 0.4), function() {
			this.body.velocity.set(0);
		}, this);
		this.idleTimer = Phaser.Math.random(2, 5) * 1000;
	} else {
		this.idleTimer -= this.game.time.elapsedMS;
	}
}

// Chase the player
Enemy.prototype.chase = function() {
	if (this.target.body.center.distance(this.body.center) > 5) {
		let direction = Phaser.Point.subtract(this.target.body.center, this.body.center);
		direction = Phaser.Point.multiply(direction.normalize(), this.body.maxVelocity)
		this.body.velocity.set(direction.x, direction.y);
	} else {
		this.body.velocity.set(0);
	}
}

// Patrol an area
Enemy.prototype.patrol = function() {
	if (this.pathcount >= this.path.length) {
		this.pathcount = 0;
	} else if (this.path[this.pathcount].distance(new Phaser.Point(this.centerX, this.centerY)) > 5) {
		let direction = Phaser.Point.subtract(this.path[this.pathcount], new Phaser.Point(this.centerX, this.centerY));
		direction = Phaser.Point.multiply(direction.normalize(), this.body.maxVelocity)
		this.body.velocity.setTo(direction.x, direction.y);
	} else {
		this.pathcount++;
	}
}
