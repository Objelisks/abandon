var getLaserOffset = function(x, y, dir) {
  switch(dir) {
    case 0: return {x:x+2, y:y+8};
    case 1: return {x:x+2, y:y-4};
    case 2: return {x:x+8, y:y+2};
    case 3: return {x:x-4, y:y+2};
  }
}


var getOffset = function(x, y, offx, offy, dir) {
  switch(dir) {
    case 0: return {x:x, y:y-offy};
    case 1: return {x:x, y:y+offy};
    case 2: return {x:x-offx, y:y};
    case 3: return {x:x+offx, y:y};
  }
}

var createBeam = function(game, laser) {
  var dir = laser.direction;
  var beam = [];
  var start = getLaserOffset(laser.x, laser.y, dir);
  var off = getOffset(start.x, start.y, 4, 4, dir);
  var solid = game.tilemap.getTileWorldXY(off.x, off.y) !== null;
  while(!solid) {
    var newBeam = game.add.sprite(0, 0, 'beam', Math.floor(dir/2));
    newBeam.x = off.x;
    newBeam.y = off.y;
    var frame = Math.floor(dir/2);
    newBeam.animations.add('active', [frame, frame+2], 20, true);
    newBeam.animations.play('active');
    beam.push(newBeam);
    //newBeam.bringToTop();

    off = getOffset(off.x, off.y, 4, 4, dir);
    solid = game.tilemap.getTileWorldXY(off.x, off.y) !== null;
  }
  return beam;
}

exports.createLaser = function(game, obj) {
  var direction = 0;
  switch(obj.properties.dir) {
    case 'n': direction = 0; break;
    case 's': direction = 1; break;
    case 'w': direction = 2; break;
    case 'e': direction = 3; break;
  }

  var laser = game.add.sprite(obj.x, obj.y-8, 'laser', direction*2);
  laser.direction = direction;
  laser.active = true;

  laser.toggle = function() {
    laser.active = !laser.active;
    if(laser.beam) {
      laser.beam.forEach(function(beam) {
        beam.exists = !beam.exists;
      })
    }
    laser.emitter.on = laser.active;
  }

  laser.beam = createBeam(game, laser);
  laser.bringToTop();

  laser.emitter = game.add.emitter(laser.beam[laser.beam.length-1].x+2, laser.beam[laser.beam.length-1].y+2, 20);
  laser.emitter.makeParticles('spark', 0);
  laser.emitter.start(false, 20, 30);

  return laser;
}
