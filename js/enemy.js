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
	
		
	// Set to center
	this.anchor.setTo(0.5, 0.5);
	
	// Setup physics
    game.physics.arcade.enable(this);
	this.body.maxVelocity.set(100,100);
	this.body.bounce.setTo(0.2, 0,2);
	
	// Setup AI
	this.fsm = new FSM(this, this.idle);
	this.activated = false;
	
	// Idle
	this.idleTimer = 0;
	// Chase
	this.target = this.game.global.player.player;
	// Path
	this.path = [new Phaser.Point(0,0), new Phaser.Point(300,300), new Phaser.Point(300,0)];
	this.pathcount = 0;
	
	game.add.existing(this);
	
	/* EXTRA
	cursors = game.input.keyboard.createCursorKeys();
	cursors.left.isDown
	*/
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// For each frame
Enemy.prototype.update = function() {
	// TEMP CODE
	//this.fsm.update();
	this.patrol(this);
	
	if (this.game.input.keyboard.isDown(Phaser.KeyCode.A)) {
		console.log(this.body.x);
	}
}

// When the enemy takes damage
Enemy.prototype.damage = function(amount) {
	this.health -= amount;
	
	if (this.health <= 0) {
		this.kill();
		return true;
	}
	// this.animations.play("damage");	
	return false;
}

// When the enemy dies, play death animation
Enemy.prototype.kill = function() {
	this.alive = false;
	this.body.velocity.setTo(0,0);
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

// Move around while on idle state
Enemy.prototype.idle = function(ref) {
	if (ref.activated) {
		ref.fsm.activeState = ref.chase;
	} else if (ref.idleTimer <= 0) {
		let direction = new Phaser.Point(Phaser.Math.random(-10,10), Phaser.Math.random(-10,10));
		direction = Phaser.Point.multiply(direction.normalize(), ref.body.maxVelocity)
		ref.body.velocity.set(direction.x, direction.y);
		ref.game.time.events.add(1000 * Phaser.Math.random(0.1,0.4), function() {
			ref.body.velocity.set(0, 0);
		}, this);
		ref.idleTimer = Phaser.Math.random(2,5) * 1000;
	} else {
		ref.idleTimer -= ref.game.time.elapsedMS;
	}
}

// Chase the player
Enemy.prototype.chase = function(ref) {
	if (ref.activated) {
		let direction = Phaser.Point.subtract(ref.target.body.center, ref.body.center);
		direction = Phaser.Point.multiply(direction.normalize(), ref.body.maxVelocity)
		ref.body.velocity.set(direction.x, direction.y);
	} else {
		ref.fsm.activeState = ref.idle;
	}
}

// Patrol an area
Enemy.prototype.patrol = function(ref) {
	if (ref.pathcount >= ref.path.length) {
		ref.pathcount = 0;
	} else if (Phaser.Point.distance(ref.path[ref.pathcount], ref.body.center) > 1) {
		let direction = Phaser.Point.subtract(ref.path[ref.pathcount], ref.body.center);
		direction = Phaser.Point.multiply(direction.normalize(), ref.body.maxVelocity)
		ref.body.velocity.set(direction.x, direction.y);
	} else {
		ref.pathcount++;
	}
}
