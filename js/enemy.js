// Enemy constructor
let Enemy = function(game, x, y) {
	// Extend sprite object
	Phaser.Sprite.call(this, game, x, y, "Enemy");
	
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
	this.body.drag.set(25, 25);
	
	// Set properties
	this.body.bounce.setTo(0.2, 0,2);
	
	// Setup AI
	this.fsm = new FSM(this, this.idle);
	this.spotted = false;
	this.idleTimer = 0;
	this.target = this.game.global.player;
	
	
	
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
	// For testing
	//this.chase();
	/*
	if (this.game.input.keyboard.isDown(Phaser.KeyCode.A)) {
		this.damage(1);
		console.log(true);
	}*/
	// TEMP CODE
	/*
	this.fsm.update();
	*/
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

/*
// Move around while on idle state
Enemy.prototype.idle = function(ref) {
	if (ref.spotted) {
		ref.fsm.activeState = ref.chase;
	} else if (ref.idleTimer <= 0) {
		if (Phaser.Math.random() >= 0.5) {
			ref.body.velocity = new Phaser.Point(Phaser.Math.random(-100,100),Phaser.Math.random(-100,100));
		}
		ref.idleTimer = Phaser.Math.random(1, 4);
		console.log(ref.body.velocity);
		console.log(ref.body.facing);
	} else {
		ref.idleTimer -= ref.game.time.physicsElapsed;
	}
}
*/
// Chase the player while on chase state
Enemy.prototype.chase = function(ref) {
	if (!ref.spotted) {
		ref.fsm.activeState = ref.idle;
	} else {
		this.target;
	}
}
