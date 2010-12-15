/** 
 * This example demonstrates the creation of a new layer with features 
 * representing the centroids of geometries in another layer.  The new layer
 * has a similar schema to the original, with the exception of the default
 * geometry type.
 */

var FS = require("fs");

// import Directory and Layer constructors
var Directory = require("geoscript/workspace").Directory;
var Layer = require("geoscript/layer").Layer;

// create a directory workspace from an existing directory on disk
var path = FS.resolve(module.path, "data/shapefiles");
var dir = new Directory(path);

// create a layer based on an existing shapefile in the directory
var states = dir.get("states");

// create a new schema with a Point geometry type instead of MultiPolygon
var schema = states.schema.clone({
    // give the schema a new name
    name: "centroids", 
    fields: [
        // overwrite existing field named "the_geom"
        {name: "the_geom", type: "Point", projection: "EPSG:4326"}
    ]
});

// create a new temporary layer with the new schema
var centroids = new Layer({
    schema: schema
});

// add the layer to existing workspace (this creates a new shapefile on disk)
dir.add(centroids);

// iterate through the state features to create features with state centroids
states.features.forEach(function(state) {
    var centroid = state.clone({
        schema: schema,
        values: {
            // overwrite the geometry value with the state centroid
            the_geom: state.geometry.centroid
        }
    });
    // add the new feature to the layer (this writes to the shapefile)
    centroids.add(centroid);
});

// you can use the viewer module to draw collections of features or geometries
var draw = require("geoscript/viewer").draw;
var geometries = [];
// add all state geometries to the array
states.features.forEach(function(state) {
    geometries.push(state.geometry);
});
// add buffered centroids so they will be visible
centroids.features.forEach(function(centroid) {
    geometries.push(centroid.geometry.buffer(0.5));
});
// draw all geometries
draw(geometries);
