var io = require('../node_modules/socket.io-client/socket.io.js');
var socket = io('http://localhost/');
socket.on('connect', function() {
  socket.send('hi');
  socket.on('message', function(msg) {
    console.log('rcv', msg);
    //echo

  });
});

var players = require('./player.js');
var lasers = require('./laser.js');
var buttons = require('./button.js');
var elevators = require('./elevator.js');

var cursors;
var p;

var objectsMap = {
  'laser': lasers.createLaser,
  'button': buttons.createButton,
  'elevator': elevators.createElevator
}

var preload = function() {
  game.load.image('elevator', '../assets/elevator.png', 24, 8);
  game.load.spritesheet('tiles', '../assets/tiles.png', 8, 8);
  game.load.spritesheet('astro', '../assets/astro.png', 10, 10);
  game.load.spritesheet('laser', '../assets/beamsocket.png', 8, 8);
  game.load.spritesheet('beam', '../assets/beam.png', 4, 4);
  game.load.spritesheet('button', '../assets/button.png', 6, 4);
  game.load.spritesheet('spark', '../assets/jet3.png', 4, 4);
  game.load.tilemap('level', '../maps/level.json', null, Phaser.Tilemap.TILED_JSON);
}

var create = function() {
  //game.stage.backgroundColor = '#2d2d2d';
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.scale.setUserScale(2, 2);
  game.antialias = false;
  game.ids = {};

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 100;

  var tilemap = game.add.tilemap('level');
  tilemap.addTilesetImage('tiles', 'tiles');
  tilemap.bg = tilemap.createLayer('bg');
  tilemap.fg = tilemap.createLayer('fg');
  tilemap.setLayer(tilemap.fg);
  tilemap.fg.resizeWorld();
  tilemap.setCollisionBetween(1, 256);

  game.tilemap = tilemap;
  game.player = players.createPlayer(game);
  game.cursors = game.input.keyboard.createCursorKeys();

  tilemap.objects.obj.forEach(function(obj) {
    if(obj.type) {
      game.ids[obj.name] = objectsMap[obj.type](game, obj);
    } else {
      game.ids[obj.name] = obj;
    }
  });

}

var update = function() {
  game.camera.x = Math.floor((game.player.x) / 256) * 256;
  game.camera.y = Math.floor((game.player.y) / 256) * 256;

  game.tilemap.bg.sendToBack();
  game.tilemap.fg.bringToTop();
}

var render = function() {
  //game.debug.bodyInfo(p, 32, 32);
}

var game = new Phaser.Game(256, 256, Phaser.AUTO, 'thing', {
  preload: preload, create: create, update: update, render: render });
