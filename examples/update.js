/** 
 * This example demonstrates how to persist changes to a layer after modifying
 * features.  Layers keep track of all features that have been modified.
 * Calling layer.update() persists modifications to all features changed since
 * the last update call.
 */

var Filter = require("geoscript/filter").Filter;
var Directory = require("geoscript/workspace").Directory;

// get the states layer
var dir = new Directory("data/shapefiles");
var states = dir.get("states");

// create a filter and get a single feature
var isMT = new Filter("STATE_ABBR EQ 'MT'");
var mt = states.query(isMT).get();

// make geometry bigger
mt.geometry = mt.geometry.buffer(1);

// create a bbox filter 
var nearMT = new Filter("BBOX(the_geom, " + mt.geometry.bounds.toArray() + ")");

// subtract mt geometry from adjacent states
states.query(nearMT.and(isMT.not)).forEach(function(state) {
    state.geometry = state.geometry.difference(mt.geometry);
});

// persist changes to all modified features
states.update();

// view the results
require("geoscript/viewer").draw(states);
