// Enemy constructor
let Enemy = function(game, x, y, key = "Enemy", frame = 0) {
	// Extend sprite object
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	// Set up animations
	//this.animations.add("left", [8,9], 10, true);
    //this.animations.add("right", [1,2], 10, true);
    //this.animations.add("up", [11,12,13], 10, true);
    //this.animations.add("down", [4,5,6], 10, true);
	//this.animations.add("damage", [4,5,6], 10, true);
	//this.animations.add("death", [4,5,6], 10, true);
	
	// Set variables
	this.health = 1;
	this.power = 1;
	this.anchor.setTo(0.5);
	
	// Setup physics
    game.physics.arcade.enable(this);
	let scale = game.global.scale;
	this.body.setSize(this.width*scale, this.height*scale, -this.width/2, -this.height/2);
	this.body.maxVelocity.setTo(100);
	
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
	this.activeState();
}

// When the enemy takes damage, reduce hp by amount
// At 0 hp, call kill function
Enemy.prototype.damage = function(amount) {
	this.health -= amount;
	
	if (this.health <= 0) {
		console.log("KILL");
		this.kill();
		this.destroy();
		return true;
	}
	// this.animations.play("damage");	
	return false;
}

// When this dies, play death animation
Enemy.prototype.kill = function() {
	this.alive = false;
	this.body.velocity.setTo(0);
	this.animations.stop();
	//this.animations.play('death');
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
