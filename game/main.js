var gen = require('./terrain-gen.js');

var io = require('../node_modules/socket.io-client/socket.io.js');
var socket = io('http://localhost/');
socket.on('connect', function() {
  socket.send('hi');
  socket.on('message', function(msg) {
    console.log('rcv', msg);
    //echo

  });
});

var tilemap, terrain, fg, bg, cursors;
var p;

// nine tilemaps, always collide with maps[4]
var maps = [];

var setupTileCollision = function(map) {
  map.setCollisionBetween(1, 128);
}

var createTilesection = function(x, y) {
  var section = game.add.tilemap();
  section.addTilesetImage('tiles', undefined, 8, 8);
  setupTileCollision(section);

  resetTilemap(section);
  gen.generateArea(section, x, y);

  return section;
}

var resetTilemap = function(map) {
  map.removeAllLayers();
  map.bg = map.create('bg', 32, 32, 8, 8);
  map.terrain = map.createBlankLayer('terrain', 32, 32, 8, 8);
  map.fg = map.createBlankLayer('fg', 32, 32, 8, 8);
  map.setLayer(map.terrain);
}

var preload = function() {
  game.load.spritesheet('tiles', '../assets/tiles.png', 8, 8);
  game.load.spritesheet('astro', '../assets/astro.png', 10, 10);
}

var create = function() {
  //game.stage.backgroundColor = '#2d2d2d';
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.scale.setUserScale(3, 3);
  game.antialias = false;

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 250;

  tilemap = createTilesection(0, 0);
  tilemap.terrain.resizeWorld();

  p = game.add.sprite(10, 10, 'astro');
  game.physics.enable(p);

  //p.body.bounce.set(0.1);
  p.body.drag.set(400, 50);
  p.body.maxVelocity.set(60, 120);
  p.body.setSize(3, 8, 3, 2);
  //p.body.collideWorldBounds = true;
  game.camera.follow(p);

  cursors = game.input.keyboard.createCursorKeys();
}

var update = function() {
  game.physics.arcade.collide(p, tilemap.terrain);

  if(cursors.up.isDown && p.body.onFloor()) {
    p.body.velocity.y = -120;
  }

  if(cursors.left.isDown) {
    p.body.velocity.x -= 20;
  }
  if(cursors.right.isDown) {
    p.body.velocity.x += 20;
  }

  if(p.body.right < game.world.bounds.x) {
    p.body.x += game.world.bounds.width;
    tilemap.bg.destroy();
    tilemap.terrain.destroy();
    tilemap.fg.destroy();
    tilemap.destroy();
    tilemap = createTilesection(-1, 0);
  }


  tilemap.bg.sendToBack();
  tilemap.fg.bringToTop();
}

var render = function() {
}

var game = new Phaser.Game(256, 256, Phaser.AUTO, 'game', {
  preload: preload, create: create, update: update, render: render });
