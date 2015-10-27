exports.createPlayer = function(game) {
  var player = game.add.sprite(10, 10, 'astro');
  player.x = 1152;
  player.y = 620;

  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.setSize(10, 10, 0, 0);
  player.body.collideWorldBounds = true;

  player.update = function() {
    game.physics.arcade.collide(this, game.tilemap.fg);

    this.body.velocity.x = 0;
    if(game.cursors.up.isDown && this.body.onFloor()) {
      this.body.velocity.y = -80;
    }

    if(game.cursors.left.isDown) {
      if(this.body.blocked.left && game.tilemap.getTileWorldXY(this.body.x+5-8, this.body.y-6) === null) {
        // clamber
        this.body.velocity.y = -40;
      }
      // move left
      this.body.velocity.x = -30;
    }

    if(game.cursors.right.isDown) {
      if(this.body.blocked.right && game.tilemap.getTileWorldXY(this.body.x+5+8, this.body.y-6) === null) {
        // clamber
        this.body.velocity.y = -40;
      }
      this.body.velocity.x = 30;
    }
  }
  return player;
}
