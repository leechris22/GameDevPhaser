let BubbleSpawner = function() {
    this.totalElapsed = 0;
    this.timeCutoffs = [5, 25, 45, 60, 75];
    this.spawnTimeConstant = [1, 1, 1, 1, 1];
    this.appearTimeConstant = [5, 5, 5, 5, 5];
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
    this.maxBubbles = 500;
}

BubbleSpawner.prototype.getText = function() {
    return 'hello';
};


BubbleSpawner.prototype.update = function() {
    this.totalElapsed += game.time.elapsedMS / 1000.0;
    
    if (this.totalElapsed > this.timeForNextSpawn)
    {
        //spawn bubble
        if (this.spawnedBubbles < this.maxBubbles)
        {
            let spawnBoxIndex = Math.floor(this.spawnBoxes[this.cutoffIndex].length * Math.random());
            let randX = Math.random();
            let randY = Math.random();
            let posx = (randX * this.spawnBoxes[this.cutoffIndex][spawnBoxIndex][0]) + ((1 - randX) * this.spawnBoxes[this.cutoffIndex][spawnBoxIndex][2]);
            let posy = (randY * this.spawnBoxes[this.cutoffIndex][spawnBoxIndex][1]) + ((1 - randY) * this.spawnBoxes[this.cutoffIndex][spawnBoxIndex][3]);
            
            game.global.bubbles.push(new Bubble(this.appearTimeConstant[this.cutoffIndex], this.getText(), posx, posy));
            this.spawnedBubbles++;
        }
        
        
        
        
        if (this.cutoffIndex < this.timeCutoffs.length &&
            this.timeForNextSpawn > this.timeCutoffs[this.cutoffIndex + 1]) {
            this.cutoffIndex++;
        }
        this.timeForNextSpawn += this.spawnTimeConstant[this.cutoffIndex];
    }
    
    
};
