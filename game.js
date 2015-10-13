var game = new Phaser.Game(300, 325, Phaser.AUTO, '', {preload: preload, create: create, update: update});

var tileArray = [];
var spillMeter = 0;
var mopMeter = 0;
var score = 0;
var spillText, mopText, scoreText;

function preload(){
    game.stage.backgroundColor = '#fff';
    game.load.spritesheet('beaker', 'beaker.png', 50, 50, 3);
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
    tile01 = new Tile(0, 50, [0, 1]);
    tile02 = new Tile(0, 100, [0, 2]);
    tile03 = new Tile(0, 150, [0, 3]);
    tile04 = new Tile(0, 200, [0, 4]);
    tile05 = new Tile(0, 250, [0, 5]);
    tile10 = new Tile(50, 0, [1, 0]);
    tile11 = new Tile(50, 50, [1, 1]);
    tile12 = new Tile(50, 100, [1, 2]);
    tile13 = new Tile(50, 150, [1, 3]);
    tile14 = new Tile(50, 200, [1, 4]);
    tile15 = new Tile(50, 250, [1, 5]);
    tile20 = new Tile(100, 0, [2, 0]);
    tile21 = new Tile(100, 50, [2, 1]);
    tile22 = new Tile(100, 100, [2, 2]);
    tile23 = new Tile(100, 150, [2, 3]);
    tile24 = new Tile(100, 200, [2, 4]);
    tile25 = new Tile(100, 250, [2, 5]);
    tile30 = new Tile(150, 0, [3, 0]);
    tile31 = new Tile(150, 50, [3, 1]);
    tile32 = new Tile(150, 100, [3, 2]);
    tile33 = new Tile(150, 150, [3, 3]);
    tile34 = new Tile(150, 200, [3, 4]);
    tile35 = new Tile(150, 250, [3, 5]);
    tile40 = new Tile(200, 0, [4, 0]);
    tile41 = new Tile(200, 50, [4, 1]);
    tile42 = new Tile(200, 100, [4, 2]);
    tile43 = new Tile(200, 150, [4, 3]);
    tile44 = new Tile(200, 200, [4, 4]);
    tile45 = new Tile(200, 250, [4, 5]);
    tile50 = new Tile(250, 0, [5, 0]);
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
        if (tileFromCoords([blackBeakers[i].coords[0], blackBeakers[i].coords[1] - 1]) !== undefined){
            // if N tile exists AND beaker is black
            if (tileFromCoords([blackBeakers[i].coords[0], blackBeakers[i].coords[1] - 1]).sprite.frame === 2){
                hasNeighborsArray.push(blackBeakers[i]);
                continue;
            } else {
                isSolitaryArray.push(blackBeakers[i]);
                continue;
            }
        }
        if (tileFromCoords([blackBeakers[i].coords[0] + 1, blackBeakers[i].coords[1]]) !== undefined){
            // if E tile exists AND beaker is black
            if (tileFromCoords([blackBeakers[i].coords[0] + 1, blackBeakers[i].coords[1]]).sprite.frame === 2){
                hasNeighborsArray.push(blackBeakers[i]);
                continue;
            } else {
                isSolitaryArray.push(blackBeakers[i]);
                continue;
            }
        }
        if (tileFromCoords([blackBeakers[i].coords[0], blackBeakers[i].coords[1] + 1]) !== undefined){
            // if S tile exists AND beaker is black
            if (tileFromCoords([blackBeakers[i].coords[0], blackBeakers[i].coords[1] + 1]).sprite.frame === 2){
                hasNeighborsArray.push(blackBeakers[i]);
                continue;
            } else {
                isSolitaryArray.push(blackBeakers[i]);
                continue;
            }
        }
        if (tileFromCoords([blackBeakers[i].coords[0] - 1, blackBeakers[i].coords[1]]) !== undefined){
            // if W tile exists AND beaker is black
            if (tileFromCoords([blackBeakers[i].coords[0] - 1, blackBeakers[i].coords[1]]).sprite.frame === 2){
                hasNeighborsArray.push(blackBeakers[i]);
                continue;
            } else {
                isSolitaryArray.push(blackBeakers[i]);
                continue;
            }
        }
    };
    addToSpill(isSolitaryArray);
    addToMop(hasNeighborsArray);
    // game.time.events.add(500, resetBeakers, this, blackBeakers).autoDestroy = true;
    return hasNeighborsArray;
}

function debugFunc(array){
    for (var i = 0; i < array.length; i++) {
        console.log(array[i].coords);
    };
    console.log('=-=-=-=-=-=-=-=');
}

function addToSpill(solitaryBlackBeakers){
    // add 1 to spill meter for every
    // solitary black beaker
    console.log(solitaryBlackBeakers);
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

/*
things that need to happen every turn:
• reduce delay of all beakers by one --> countdown()
• if beaker delay reaches zero, change its color --> changeColor()
• if color changes to orange, set delay to 1 --> part of Tile.prototype.change()
• if color changes to black, clear it and all adjacent black beakers
    • check ALL beakers, filter out all that aren't black --> filterOutBlack()
    • check all black beakers, all directions around it, flag it if it has a black beaker neighbor --> hasNeighbors()
    SO:
        If beaker is black, add to list of all black beakers
        If beaker +/-1x/y is black, add initial beaker to list of removable beakers
        Remove the beakers
• all beakers flagged for removal are turned clear and their delays are reset --> resetBeakers()

Loop:

1. Player clicks/taps a beaker
2. Delay on that beaker ticks up by 1 (max delay +1)
3. Delay on ALL beakers ticks down by 1
4. All clear beakers at 0 delay are changed to orange and delay is set to max delay (from clear stage)
5. All orange beakers at 0 delay are changed to black.
6. All black beakers with neighboring black beakers are totaled and added to score and mop meter(?)
    6a. If mop meter reaches 36, reduce spill meter by 1, reset mop meter to 0
7. All solitary black beakers are totaled and added to spill meter
    7a. If spill meter reaches 6, game over
8. All black beakers are reset to clear and delay to 1 (max delay to 1 also)
9. Player takes another turn

notes:

00 10 20 30 40 50
01 11 21 31 41 51
02 12 22 32 42 52
03 13 23 33 43 53
04 14 24 34 44 54
05 15 25 35 45 55

adjacent beakers are at -1y (N), +1x (E), +1y (S), and -1x (W)

*/