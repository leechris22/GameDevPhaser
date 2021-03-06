let BubbleSpawner = function() {
    this.totalElapsed = 0;
    this.timeCutoffs = [5, 25, 45, 60];
    this.spawnTimeConstant = [1, 1, 1, 1];
    this.appearTimeConstant = [5, 5, 5, 5];
    //2436, 1125
    this.spawnBoxes = [
                       [[0, 0, 300, 1125], [2100, 0, 2436, 1125]],
                       [[300, 0, 600, 1125], [1800, 0, 2100, 1125]],
                       [[0, 800, 2100, 1125]],
                       [[0, 0, 2100, 300]],
                       [[0, 0, 2100, 300], [0, 800, 2100, 1125], [0, 0, 300, 1125], [2100, 0, 2436, 1125]]
                       ];
    this.timeForNextSpawn = this.timeCutoffs[0];
    this.cutoffIndex = 0;
    this.spawnedBubbles = 0;
    this.maxBubbles = 150;
    
    this.normalLines = [
                        'Billy…',
                        'He must be here, right?',
                        'Why can’t I see you, Billy?',
                        'He told me to wake up.',
                        'He said, “Kill them all.”',
                        'He wants to tear the walls down.',
                        'What do you mean, “they can’t stop me”?',
                        'How can I hear him, but not see him?',
                        'Why are you hiding?',
                        'You’re not… one of them, are you Billy?',
                        'Billy!?'
                        ];
    
    this.insaneLines = [
                        'Don’t stop moving.',
                        'DON’T STOP… KILLING!',
                        'Kill or be killed, just like the rest of them.',
                        'This is… exhilarating.',
                        'More… more blood.',
                        'All I see is red.',
                        'Kill them ALL.',
                        'Wake UP.',
                        'TEAR THE WALLS DOWN.',
                        'THEY CAN’T STOP ME.'
                        ];
    this.nodistorted = game.add.audio('mainsoundtrack', .75, false);
    this.softdistorted = game.add.audio('softdistorted', .80, false);
    this.superdistorted = game.add.audio('superdistorted', .85, false);
    this.hyperdistorted = game.add.audio('hyperdistorted', .90, false);
    this.audioTime = game.time.now;
    this.nodistorted.play();
    this.soundtrackLength = 63.6;
    game.global.insanityState = this.cutoffIndex;
}

BubbleSpawner.prototype.getText = function() {
    if (this.cutoffIndex < 1)
    {
        let randIndex = Math.floor(this.normalLines.length * Math.random());
        return this.normalLines[randIndex];
    }
    else
    {
        let randIndex = Math.floor(this.insaneLines.length * Math.random());
        return this.insaneLines[randIndex];
    }
};


BubbleSpawner.prototype.update = function() {
    game.global.insanityState = this.cutoffIndex;
    if (!game.global.player.player.movingLeft && !game.global.player.player.movingUp &&
        !game.global.player.player.movingDown && !game.global.player.player.movingRight) {
        this.totalElapsed += game.time.elapsedMS / 1000.0;
    }
    
    //this.audioTime += game.time.elapsedMS / 1000.0;
    if (game.time.now - this.audioTime > this.soundtrackLength * 1000)
    {
        this.audioTime = game.time.now;//this.soundtrackLength;
        this.nodistorted.stop();
        this.softdistorted.stop();
        this.superdistorted.stop();
        this.hyperdistorted.stop();
        
        if (this.cutoffIndex == 0) {
            this.nodistorted.play();
        }
        else if (this.cutoffIndex == 1) {
            this.softdistorted.play();
        }
        else if (this.cutoffIndex == 2) {
            this.superdistorted.play();
        }
        else {
            this.hyperdistorted.play();
        }
    }
    
    
    if (this.totalElapsed > this.timeForNextSpawn && this.spawnedBubbles < this.maxBubbles) {
        let spawnBoxIndex = Math.floor(this.spawnBoxes[this.cutoffIndex].length * Math.random());
        let randX = Math.random();
        let randY = Math.random();
        let posx = (randX * this.spawnBoxes[this.cutoffIndex][spawnBoxIndex][0]) + ((1 - randX) * this.spawnBoxes[this.cutoffIndex][spawnBoxIndex][2]);
        let posy = (randY * this.spawnBoxes[this.cutoffIndex][spawnBoxIndex][1]) + ((1 - randY) * this.spawnBoxes[this.cutoffIndex][spawnBoxIndex][3]);
            
        game.global.bubbles.push(new Bubble(this.appearTimeConstant[this.cutoffIndex], this.getText(), posx, posy));
        this.spawnedBubbles++;
        
        if (this.cutoffIndex < this.timeCutoffs.length &&
            this.timeForNextSpawn > this.timeCutoffs[this.cutoffIndex + 1]) {
            this.cutoffIndex++;
        }
        this.timeForNextSpawn += this.spawnTimeConstant[this.cutoffIndex];
    }
    
};
