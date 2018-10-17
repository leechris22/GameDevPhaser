let Bubble = function(timeToFade, textToDisplay, spawnX, spawnY) {
    this.bubblex = spawnX;
    this.bubbley = spawnY;
    this.timeToFade = timeToFade;
    this.totalElapsed = 0;
    this.bubbleSprite = game.add.sprite(this.bubblex, this.bubbley, "bubble", game.global.insanityState);
    this.bubbleSprite.fixedToCamera = true;
    this.bubbleSprite.scale.setTo(1 / game.global.scale);
    game.physics.arcade.enable(this.bubbleSprite);
    let style = {
        font: "bold 25pt Arial",
        fill: "#ff0000",
        align: "center"
    };
    this.textSprite = game.add.text(this.bubblex, this.bubbley, textToDisplay, style);
    this.textSprite.fixedToCamera = true;
    this.textSprite.wordWrap = true;
    this.textSprite.wordWrapWidth = 250;
    this.textSprite.scale.setTo(1 / game.global.scale);
    this.bubbleSprite.alpha = 0;
    this.textSprite.alpha = 0;
    this.bubbleSprite.anchor.setTo(0.5);
    this.textSprite.anchor.setTo(0.5);
    this.moveCounter = 0;
};

Bubble.prototype = Object.create(Phaser.Sprite.prototype);
Bubble.prototype.constructor = Bubble;

Bubble.prototype.update = function() {
    this.totalElapsed += game.time.elapsedMS / 1000.0;
    let newAlpha = this.totalElapsed / this.timeToFade;
    if (newAlpha > 1)
    {
        newAlpha = 1;
    }
    this.bubbleSprite.alpha = newAlpha;
    this.textSprite.alpha = newAlpha;
    this.moveUp();
    this.moveUp();
    
    this.moveCounter++;
    if (this.moveCounter == 10)
    {
        this.bubbleSprite.fixedToCamera = false;
        this.textSprite.fixedToCamera = false;
        let randAngle = 6.28 * Math.random();
        this.bubbleSprite.x = this.bubblex + 10 * Math.cos(randAngle);
        this.bubbleSprite.y = this.bubbley + 10 * Math.sin(randAngle);
        this.textSprite.x = this.bubbleSprite.x;
        this.textSprite.y = this.bubbleSprite.y;
        this.bubbleSprite.fixedToCamera = true;
        this.textSprite.fixedToCamera = true;
        this.moveCounter = -1;
    }
    //this.bubbleSprite.x += (100 * Math.cos(randAngle));
    //this.bubbleSprite.y += (100 * Math.sin(randAngle));
    
};
