var io = require('../node_modules/socket.io-client/socket.io.js');
var socket = io('http://localhost/');
socket.on('connect', function() {
  socket.send('hi');
  socket.on('message', function(msg) {
    console.log('rcv', msg);
    //echo

  });
});

var tilemap, cursors;
var p;

var preload = function() {
  game.load.spritesheet('tiles', '../assets/tiles.png', 8, 8);
  game.load.spritesheet('astro', '../assets/astro.png', 10, 10);
  game.load.tilemap('level', '../maps/level.json', null, Phaser.Tilemap.TILED_JSON);
}

var create = function() {
  //game.stage.backgroundColor = '#2d2d2d';
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.scale.setUserScale(2, 2);
  game.antialias = false;

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 100;

  tilemap = game.add.tilemap('level');
  tilemap.addTilesetImage('tiles', 'tiles');
  tilemap.bg = tilemap.createLayer('bg');
  tilemap.fg = tilemap.createLayer('fg');
  tilemap.setLayer(tilemap.fg);
  tilemap.fg.resizeWorld();
  tilemap.setCollisionBetween(1, 256);

  p = game.add.sprite(10, 10, 'astro');
  p.x = 1024;
  p.y = 512;
  game.physics.enable(p, Phaser.Physics.ARCADE);

  /*
  movement mechanics:

  */

  //p.body.drag.set(100, 50);
  //p.body.maxVelocity.y = 500;
  p.body.setSize(10, 10, 0, 0);
  //p.body.tilePadding.set(16, 16);
  p.body.collideWorldBounds = true;
  //p.body.allowRotation = false;

  game.camera.follow(p, Phaser.Camera.FOLLOW_PLATFORMER);

  cursors = game.input.keyboard.createCursorKeys();
}

var update = function() {
  game.physics.arcade.collide(p, tilemap.fg);

  p.body.velocity.x = 0;
  if(cursors.up.isDown && p.body.onFloor()) {
    p.body.velocity.y = -80;
  }

  if(cursors.left.isDown) {
    if(p.body.blocked.left && tilemap.getTileWorldXY(p.body.x+5-8, p.body.y-6) === null) {
      // clamber
      p.body.velocity.y = -40;
    }

    // move left
    p.body.velocity.x = -30;
  }
  if(cursors.right.isDown) {
    if(p.body.blocked.right && tilemap.getTileWorldXY(p.body.x+5+8, p.body.y-6) === null) {
      // clamber
      p.body.velocity.y = -40;
    }

    p.body.velocity.x = 30;
  }

  //game.physics.arcade.collide(p, tilemap.fg);
    //downLastFrame = p.body.onFloor();

/*
  if(p.body.right < game.world.bounds.x) {
    p.body.x += game.world.bounds.width;
    tilemap.bg.destroy();
    tilemap.terrain.destroy();
    tilemap.fg.destroy();
    tilemap.destroy();
    tilemap = createTilesection(-1, 0);
  }
*/

  //tilemap.bg.sendToBack();
  //tilemap.fg.bringToTop();
}

var render = function() {
  game.debug.bodyInfo(p, 32, 32);
}

var game = new Phaser.Game(512, 512, Phaser.AUTO, 'thing', {
  preload: preload, create: create, update: update, render: render });
