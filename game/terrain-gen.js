var genRules = require('./gen-rules.js');

var WIDTH = 32;
var HEIGHT = 32;

/*
   1,0   3,0
0,0   2,0   4,0
   1,1   3,1
 ____
|_|_|
|_|_|
*/
var generateBorder = function(x1, y1, x2, y2) {
  var game = Phaser.GAMES[0];
  game.rnd.sow([[x1,y1], [x2,y2]].sort());
  var border = [];
  for (var i = 0; i < WIDTH; i++) {
    border[i] = game.rnd.integerInRange(0,1);
  }
  return border;
}

var do2d = function(tiles, cb) {
  var i,j;
  for(i=0; i<tiles.length; i++) {
    for(j=0; j<tiles[0].length; j++) {
      cb(tiles, i, j);
    }
  }
}

var neighbors = function(tiles, x, y) {
  var offs = [[-1,-1],[0,-1],[1,-1],
             [-1, 0],      ,[1, 0],
             [-1, 1],[0, 1],[1, 1]];
  var count = 0;
  offs.forEach(function(offset) {
    var offx = Math.min(tiles[0].length-1, Math.max(0, x+offset[0]));
    var offy = Math.min(tiles.length-1, Math.max(0, y+offset[1]));
    count += tiles[offx][offy] > 0 ? 1 : 0;
  });
  return count;
}

var stepAutomata = function(tiles, rules) {
  do2d(tiles, function(arr, i, j) {
    var n = neighbors(tiles, i, j);
    if(rules.born[n]) {
      tiles[i][j] = 1;
    }
    if(rules.live[n]) {
      tiles[i][j] = arr[i][j];
    } else {
      tiles[i][j] = 0;
    }
  });
}


var make2dArray = function(w, h) {
  var arr = [];
  for (var i = 0; i < h; i++) {
    arr[i] = [];
    for (var j = 0; j < w; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}

var caveGenerator = function(map, x, y) {
  var tiles = make2dArray(WIDTH, HEIGHT);
  do2d(tiles, function(arr, i, j) {
    tiles[i][j] = Math.floor(Math.random()*2);
  });
  [[-1,0],[0,-1],[1,0],[0,1]].forEach(function(offset) {
    var border = generateBorder(x, y, x+offset[0], y+offset[1]);
    var dir = [Math.abs(offset[1]), Math.abs(offset[0])];
    var startx = offset.x > 0 ? WIDTH : 0;
    var starty = offset.y > 0 ? HEIGHT : 0;
    console.log(dir);
    for (var i = 0; i < border.length; i++) {
      tiles[startx+dir[0]*i][starty+dir[1]*i] = border[i];
    }
  })

  for(i=0; i<1; i++) {
    stepAutomata(tiles, {
      born: {5:1, 6:1, 7:1, 8:1},
      live: {4:1, 5:1, 6:1, 7:1, 8:1}
    });
  }

  do2d(tiles, function(arr, i, j) {
    map.putTile(arr[i][j] === 1 ? 7 : -1, i, j, 'terrain');
  });
}


var decorator = function(rules) {
  return function(map, x, y) {
    map.forEach(function(tile) {
      var totalChance = 0.0;
      rules.some(function(rule) {
        if(rule.filter(map, tile)) {
          totalChance += rule.chance;
          var chance = Math.random();
          if(chance < totalChance) {
            rule.result(map, tile.x, tile.y);
            return true;
          }
          return false;
        }
      });
    })
  };
}

var fgDecorator = decorator(genRules.fg);
var bgDecorator = decorator(genRules.bg);

exports.generateArea = function(map, x, y) {
  caveGenerator(map, x, y);
  bgDecorator(map, x, y);
  fgDecorator(map, x, y);
}
