var game = new Phaser.Game(300, 300, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload(){
    game.stage.backgroundColor = '#fff';
    game.load.spritesheet('beaker', 'beaker.png', 50, 50, 3);
}

function create(){
    function Tile(x, y){
        this.x = x;
        this.y = y;
        this.sprite = game.add.sprite(this.x, this.y, 'beaker');
        this.sprite.frame = 0;
        this.delay = 1;
        this.text = game.add.text(this.x + 5, this.y + 5, this.delay, {font: '18px Helvetica', fill: 'black'});
    }

    Tile.prototype.drop = function(){
        this.y -= 50;
    }

    Tile.prototype.dilute = function(){
        this.delay += 1;
    }

    Tile.prototype.change = function(){
        if (this.sprite.frame === 0){
            this.sprite.frame = 1;
        } else {
            this.sprite.frame = 2;
        }
    }

    tile00 = new Tile(0, 0);
    tile01 = new Tile(0, 50);
    tile02 = new Tile(0, 100);
    tile03 = new Tile(0, 150);
    tile04 = new Tile(0, 200);
    tile05 = new Tile(0, 250);
    tile10 = new Tile(50, 0);
    tile11 = new Tile(50, 50);
    tile12 = new Tile(50, 100);
    tile13 = new Tile(50, 150);
    tile14 = new Tile(50, 200);
    tile15 = new Tile(50, 250);
    tile20 = new Tile(100, 0);
    tile21 = new Tile(100, 50);
    tile22 = new Tile(100, 100);
    tile23 = new Tile(100, 150);
    tile24 = new Tile(100, 200);
    tile25 = new Tile(100, 250);
    tile30 = new Tile(150, 0);
    tile31 = new Tile(150, 50);
    tile32 = new Tile(150, 100);
    tile33 = new Tile(150, 150);
    tile34 = new Tile(150, 200);
    tile35 = new Tile(150, 250);
    tile40 = new Tile(200, 0);
    tile41 = new Tile(200, 50);
    tile42 = new Tile(200, 100);
    tile43 = new Tile(200, 150);
    tile44 = new Tile(200, 200);
    tile45 = new Tile(200, 250);
    tile50 = new Tile(250, 0);
    tile51 = new Tile(250, 50);
    tile52 = new Tile(250, 100);
    tile53 = new Tile(250, 150);
    tile54 = new Tile(250, 200);
    tile55 = new Tile(250, 250);
}

function update(){

}