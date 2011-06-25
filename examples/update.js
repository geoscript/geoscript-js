
var Filter = require("geoscript/filter").Filter;
var Directory = require("geoscript/workspace").Directory;
var dir = new Directory("data/shapefiles");
var states = dir.get("states");

var isMT = new Filter("STATE_ABBR EQ 'MT'");
var mt = states.query(isMT).get();

// make geometry bigger
mt.geometry = mt.geometry.buffer(1);

var nearMT = new Filter("BBOX(the_geom, " + mt.geometry.bounds.toArray() + ")");

// subtract mt geometry from adjacent states
states.query(nearMT.and(isMT.not)).forEach(function(state) {
    state.geometry = state.geometry.difference(mt.geometry);
});

states.update();

require("geoscript/viewer").draw(states);