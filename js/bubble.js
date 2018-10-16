let Bubble = function(timeToFade, textToDisplay, spawnX, spawnY) {
    
    this.bubblex = spawnX;
    this.bubbley = spawnY;
    this.timeToFade = timeToFade;
    this.totalElapsed = 0;
    this.bubbleSprite = game.add.sprite(this.bubblex, this.bubbley, "bubble");
    this.bubbleSprite.fixedToCamera = true;
    this.bubbleSprite.scale.setTo(1 / game.global.scale);
    game.physics.arcade.enable(this.bubbleSprite);
    let style = {
        font: "bold 30pt Arial",
        fill: "#ff0000",
        align: "left"
    };
    this.textSprite = game.add.text(this.bubblex + 50, this.bubbley + 50, textToDisplay, style);
    this.textSprite.fixedToCamera = true;
    //this.textSprite.setTextBounds(0, 0, 50, 50);
    this.textSprite.scale.setTo(1 / game.global.scale);
    this.bubbleSprite.alpha = 0;
    this.textSprite.alpha = 0;
    this.bubbleSprite.anchor.setTo(0.5);
    this.textSprite.anchor.setTo(1.0);
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
    /*
    let randAngle = 6.28 * Math.random();
    //this.bubbleSprite.x = this.bubblex + 100 * Math.cos(randAngle);
    //this.bubbleSprite.y = this.bubbley + 100 * Math.sin(randAngle);
    this.bubbleSprite.x += (100 * Math.cos(randAngle));
    this.bubbleSprite.y += (100 * Math.sin(randAngle));
     */
};