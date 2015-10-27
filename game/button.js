exports.createButton = function(game, obj) {
  var button = game.add.sprite(obj.x, obj.y-4, 'button', 0);
  button.bringToTop();
  game.physics.enable(button, Phaser.Physics.ARCADE);
  button.body.allowGravity = false;
  button.body.immovable = true;
  button.pressTimer = 0;
  button.update = function() {
    if(this.pressTimer > 0) {
      this.pressTimer -= 1;
      if(this.pressTimer <= 0) {
        this.frame = 0;
      }
    }

    var colliding = this.game.physics.arcade.collide(this, this.game.player);
    if(this.frame === 0 && this.body.touching.up) {
      this.frame = 1;
      this.pressTimer = 60;

      var targets = JSON.parse(obj.properties.targets);
      targets.forEach(function(id) {
        game.ids[id].toggle();
      });
    }
    this.wasColliding = colliding;
  }

  return button;
}
