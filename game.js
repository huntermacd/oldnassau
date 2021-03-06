var game = new Phaser.Game(300, 325, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var tileArray = [];
var topRowArray = [];
var spillMeter = 0;
var mopMeter = 0;
var score = 0;
var spillText, mopText, scoreText;
var gameover;

function preload(){
    game.stage.backgroundColor = '#fff';
    game.load.spritesheet('beaker', 'beaker.png', 50, 50, 3);
    game.load.image('gameover', 'gameover.png', 275, 179)
}

function create(){
    function Tile(x, y, coords){
        this.x = x;
        this.y = y;
        this.coords = coords;
        this.sprite = game.add.sprite(this.x, this.y, 'beaker');
        this.sprite.frame = 0;
        this.delay = 1;
        this.maxDelay = 1;
        this.text = game.add.text(this.x + 5, this.y + 5, this.delay + '/' + this.maxDelay, {font: '18px Helvetica', fill: 'black'});
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.dilute, this);
        tileArray.push(this);
    }

    Tile.prototype.dilute = function(){
        this.delay += 1;
        this.maxDelay += 1;

        game.time.events.add(500, countdown, this).autoDestroy = true;
    }

    Tile.prototype.change = function(){
        if (this.sprite.frame === 0){
            this.sprite.frame = 1;
            this.delay = this.maxDelay;
            this.text.setText(this.delay + '/' + this.maxDelay);
        } else {
            this.sprite.frame = 2;
        }
    }

    tile00 = new Tile(0, 0, [0, 0]);
    topRowArray.push(tile00);
    tile01 = new Tile(0, 50, [0, 1]);
    tile02 = new Tile(0, 100, [0, 2]);
    tile03 = new Tile(0, 150, [0, 3]);
    tile04 = new Tile(0, 200, [0, 4]);
    tile05 = new Tile(0, 250, [0, 5]);
    tile10 = new Tile(50, 0, [1, 0]);
    topRowArray.push(tile10);
    tile11 = new Tile(50, 50, [1, 1]);
    tile12 = new Tile(50, 100, [1, 2]);
    tile13 = new Tile(50, 150, [1, 3]);
    tile14 = new Tile(50, 200, [1, 4]);
    tile15 = new Tile(50, 250, [1, 5]);
    tile20 = new Tile(100, 0, [2, 0]);
    topRowArray.push(tile20);
    tile21 = new Tile(100, 50, [2, 1]);
    tile22 = new Tile(100, 100, [2, 2]);
    tile23 = new Tile(100, 150, [2, 3]);
    tile24 = new Tile(100, 200, [2, 4]);
    tile25 = new Tile(100, 250, [2, 5]);
    tile30 = new Tile(150, 0, [3, 0]);
    topRowArray.push(tile30);
    tile31 = new Tile(150, 50, [3, 1]);
    tile32 = new Tile(150, 100, [3, 2]);
    tile33 = new Tile(150, 150, [3, 3]);
    tile34 = new Tile(150, 200, [3, 4]);
    tile35 = new Tile(150, 250, [3, 5]);
    tile40 = new Tile(200, 0, [4, 0]);
    topRowArray.push(tile40);
    tile41 = new Tile(200, 50, [4, 1]);
    tile42 = new Tile(200, 100, [4, 2]);
    tile43 = new Tile(200, 150, [4, 3]);
    tile44 = new Tile(200, 200, [4, 4]);
    tile45 = new Tile(200, 250, [4, 5]);
    tile50 = new Tile(250, 0, [5, 0]);
    topRowArray.push(tile50);
    tile51 = new Tile(250, 50, [5, 1]);
    tile52 = new Tile(250, 100, [5, 2]);
    tile53 = new Tile(250, 150, [5, 3]);
    tile54 = new Tile(250, 200, [5, 4]);
    tile55 = new Tile(250, 250, [5, 5]);

    fontStyle = {font: '18px Helvetica', fill: 'black'};
    scoreText = game.add.text(5, 305, 'Score: ' + score, fontStyle);
    mopText = game.add.text(110, 305, 'Mop: ' + mopMeter, fontStyle);
    spillText = game.add.text(210, 305, 'Spill: ' + spillMeter, fontStyle);

    // randomize game start
    for (var i = 0; i < tileArray.length; i++) {
        if (Math.round(Math.random()) === 0){
            tileArray[i].sprite.frame = 1;
        }
    };
}

function update(){
    for (var i = 0; i < tileArray.length; i++) {
        tileArray[i].text.setText(tileArray[i].delay + '/' + tileArray[i].maxDelay);
    };
    scoreText.setText('Score: ' + score);
    mopText.setText('Mop: ' + mopMeter);
    spillText.setText('Spill: ' + spillMeter);
}

function countdown(){
    // loop through all beakers and reduce
    // remaining delay by 1
    for (var i = 0; i < tileArray.length; i++) {
        tileArray[i].delay -= 1;
        tileArray[i].text.setText(tileArray[i].delay);
    };

    game.time.events.add(500, changeColor, this).autoDestroy = true;
}

function changeColor(){
    // loop through all beakers and change
    // color of those at 0 delay
    for (var i = 0; i < tileArray.length; i++) {
        if (tileArray[i].delay === 0){
            tileArray[i].change();
        }
    };

    game.time.events.add(500, filterOutBlack, this).autoDestroy = true;
}

function filterOutBlack(){
    // loop through all beakers and return array
    // of beakers that are black
    var filterOutBlackArray = [];
    for (var i = 0; i < tileArray.length; i++) {
        if (tileArray[i].sprite.frame === 2){
            filterOutBlackArray.push(tileArray[i]);
        }
    };

    game.time.events.add(500, hasNeighbors, this, filterOutBlackArray).autoDestroy = true;

    return filterOutBlackArray;
}

function hasNeighbors(blackBeakers){
    // loop through black beakers and return array
    // of beakers where their N, E, S, W neighbors also black
    var hasNeighborsArray = [];
    var isSolitaryArray = [];
    for (var i = 0; i < blackBeakers.length; i++) {
        var n = tileFromCoords([blackBeakers[i].coords[0], blackBeakers[i].coords[1] - 1]);
        var e = tileFromCoords([blackBeakers[i].coords[0] + 1, blackBeakers[i].coords[1]]);
        var s = tileFromCoords([blackBeakers[i].coords[0], blackBeakers[i].coords[1] + 1]);
        var w = tileFromCoords([blackBeakers[i].coords[0] - 1, blackBeakers[i].coords[1]]);
        if (n !== undefined){
            // if N tile exists AND beaker is black
            if (n.sprite.frame === 2){
                hasNeighborsArray.push(blackBeakers[i]);
                continue;
            }
        }
        if (e !== undefined){
            // if E tile exists AND beaker is black
            if (e.sprite.frame === 2){
                hasNeighborsArray.push(blackBeakers[i]);
                continue;
            }
        }
        if (s !== undefined){
            // if S tile exists AND beaker is black
            if (s.sprite.frame === 2){
                hasNeighborsArray.push(blackBeakers[i]);
                continue;
            }
        }
        if (w !== undefined){
            // if W tile exists AND beaker is black
            if (w.sprite.frame === 2){
                hasNeighborsArray.push(blackBeakers[i]);
                continue;
            }
        }
        // if beaker has no neighbors
        isSolitaryArray.push(blackBeakers[i]);
    };
    addToSpill(isSolitaryArray);
    addToMop(hasNeighborsArray);
    game.time.events.add(500, resetBeakers, this, blackBeakers).autoDestroy = true;
    return hasNeighborsArray;
}

function addToSpill(solitaryBlackBeakers){
    // add 1 to spill meter for every
    // solitary black beaker
    for (var i = 0; i < solitaryBlackBeakers.length; i++) {
        spillMeter += 1;
    };
}

function addToMop(blackBeakersWithNeighbors){
    // add 1 to mop meter for every
    // black beaker with a neighboring black beaker
    for (var i = 0; i < blackBeakersWithNeighbors.length; i++) {
        mopMeter += 1;
        score += 1;
    };
}

function resetBeakers(blackBeakers){
    // loop through all beakers marked for removal
    // and turn them clear, reset their delay to 1
    for (var i = 0; i < blackBeakers.length; i++) {
        blackBeakers[i].sprite.frame = 0;
        blackBeakers[i].delay = 1;
        blackBeakers[i].maxDelay = 1;
        blackBeakers[i].text.setText(blackBeakers[i].delay);
    };
    checkMopMeter();
    checkSpillMeter();

    game.time.events.add(500, shift, this).autoDestroy = true;
}

function checkMopMeter(){
    // if mopMeter >= 36, reduce spillMeter by 1
    // reset mopMeter to 0
    if (mopMeter >= 36){
        spillMeter -= 1;
        mopMeter = 0;
    }
}

function checkSpillMeter(){
    // if spillMeter >= 6, trigger gameEnd
    if (spillMeter >= 6){
        gameEnd();
    }
}

function shift(){
    // loop through ALL beakers backwards
    // if beaker is orange,
    // and beaker below is not undefined,
    // make beaker below orange and beaker clear
    for (var i = tileArray.length - 1; i > 0; i--) {
        var beaker = tileArray[i];
        var beakerBelow = tileFromCoords([tileArray[i].coords[0], tileArray[i].coords[1] + 1]);
        if (beaker.sprite.frame === 1){
            if (beakerBelow !== undefined){
                beaker.sprite.frame = 0;
                beaker.delay = 1;
                beaker.maxDelay = 1;

                beakerBelow.sprite.frame = 1;
            }
        }
    };
    newTopRow();
}

function newTopRow(){
    // loop through all top row beakers
    // randomly set them to orange
    for (var i = 0; i < topRowArray.length; i++) {
        if (Math.round(Math.random()) === 0){
            topRowArray[i].sprite.frame = 1;
        }
    };
}

function gameStart(){
    // setup new game
    gameover.destroy();
    for (var i = 0; i < tileArray.length; i++) {
        tileArray[i].delay = 1;
        tileArray[i].maxDelay = 1;
        tileArray[i].sprite.frame = 0;
        spillMeter = 0;
        mopMeter = 0;
        score = 0;
        if (Math.round(Math.random()) === 0){
            tileArray[i].sprite.frame = 1;
        }
    };
    game.paused = false;
}

function gameEnd(){
    // clean up game, prompt to replay
    game.paused = true;
    gameover = game.add.sprite(15, 15, 'gameover');

}

function tileFromCoords(coords){
    // take coords (as two-item list) and
    // return tile at those coords
    for (var i = 0; i < tileArray.length; i++) {
        if (tileArray[i].coords[0] === coords[0] && tileArray[i].coords[1] === coords[1]){
            return tileArray[i];
        }
    };
}
