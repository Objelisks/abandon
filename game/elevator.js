exports.createElevator = function(game, obj) {
  var elevator = game.add.sprite(obj.x-8, obj.y-8, 'elevator');
  game.physics.enable(elevator, Phaser.Physics.ARCADE);
  elevator.body.immovable = true;
  elevator.body.allowGravity = false;

  var startX = obj.x-8;
  var startY = obj.y-8;
  var targetX = parseInt(obj.properties.targetx)-8;
  var targetY = parseInt(obj.properties.targety)-8;
  var speed = 5;

  elevator.toggle = false;

  elevator.update = function() {
    game.physics.arcade.collide(game.player, this);
    this.body.velocity.x = (targetX - startX) / Math.abs(targetX - startX) || 0;
    this.body.velocity.y = -1 * ((targetY - startY) / Math.abs(targetY - startY)) || 0;

    if(!this.toggle) {
        this.body.velocity.x *= -1;
        this.body.velocity.y *= -1;
    }

    this.body.velocity.x *= speed;
    this.body.velocity.y *= speed;

    if((this.toggle && game.math.distance(this.x, this.y, startX, startY) < 0.1) ||
       (!this.toggle && game.math.distance(this.x, this.y, targetX, targetY) < 0.1)) {
         this.toggle = !this.toggle;
    }
  }

  return elevator;
}
