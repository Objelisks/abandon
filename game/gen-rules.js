exports.bg = [
  {
    filter: function(map, tile) {
      var above = map.getTile(tile.x, tile.y-1, 'terrain');
      if(tile.index === 7 && !above) {
        return true;
      }
      return false;
    },
    result: function(map, x, y) {
        map.putTile(44, x, y-1, 'bg');
    },
    chance: 0.20
  },
  {
    filter: function(map, tile) {
      var above = map.getTile(tile.x, tile.y-1, 'terrain');
      if(tile.index === 7 && !above) {
        return true;
      }
      return false;
    },
    result: function(map, x, y) {
        map.putTile(45, x, y-1, 'bg');
    },
    chance: 0.20
  }
];

exports.fg = [
  {
    filter: function(map, tile) {
      var below = map.getTile(tile.x, tile.y+1, 'terrain');
      if(tile.index === 7 && !below) {
        return true;
      }
      return false;
    },
    result: function(map, x, y) {
        map.putTile(12, x, y+1, 'fg');
    },
    chance: 0.10
  },
];
