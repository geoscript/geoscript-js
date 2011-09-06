var Geometry = require("./geom").Geometry;
var Feature = require("./feature").Feature;
var Layer = require("./layer").Layer;
var Map = require("./map").Map;
var UTIL = require("./util");

var JMapPane = Packages.org.geotools.swing.JMapPane;

var bound = false;
var cache = {};

exports.bind = function() {
    bound = true;
}
exports.unbind = function() {
    bound = false;
}

exports.drawIfBound = function() {
    if (bound) {
        draw.apply(null, arguments);
    }
}

function getFrame() {
    return bound && cache.frame || new javax.swing.JFrame();
}

function getTempName() {
    return "temp" + Date.now() + Math.random();
}

function drawGeometries(geometries, options) {
    var layer = new Layer({
        name: getTempName(),
        fields: [{name: "geom", type: "Geometry"}]
    });
    for (var i=0, ii=geometries.length; i<ii; ++i) {
        layer.add({geom: geometries[i]});
    }
    drawLayer(layer, options);
}

function drawFeatures(features, options) {
    var layer = new Layer({
        schema: features[0].schema.clone({name: getTempName()})
    });
    for (var i=0, ii=features.length; i<ii; ++i) {
        layer.add(features[i]);
    }
    drawLayer(layer, options);
}

function drawLayer(layer, options) {
    drawMap(new Map([layer]), options);
}

function drawMap(map, options) {
    options = UTIL.applyIf(options, {
        size: [350, 350],
        buffer: 50
    });
    
    var width = options.size[0];
    var height = options.size[1];
    var frame = bound && cache.frame || new javax.swing.JFrame();
    var parts = map.getRendererAndContext();
    var renderer = parts[0];
    var context = parts[1];
    var mapPane = new JMapPane(renderer, context);
    mapPane.setPreferredSize(new java.awt.Dimension(
        java.lang.Integer(width + 2 * options.buffer),
        java.lang.Integer(height + 2 * options.buffer)
    ));
    mapPane.setBorder(javax.swing.BorderFactory.createEmptyBorder(10, 10, 10, 10));
    
    var bounds = context.getViewport().getBounds();
    bounds.expandBy(bounds.getWidth() * 0.1);
    if (bounds.getWidth() > 0) {
        mapPane.setDisplayArea(bounds);
    }

    var frame = getFrame();
    frame.setTitle(options.title);
    frame.setContentPane(mapPane);
    frame.pack();
    frame.repaint();
    frame.setVisible(true);
    
    cache.frame = frame;
}

var draw = exports.draw = function(obj, options) {
    options = options || {};
    if (!options.title) {
        options.title = obj.toString(false);
    }
    if (obj instanceof Array) {
        var first = obj[0];
        if (first instanceof Geometry) {
            drawGeometries(obj, options);
        } else if (first instanceof Feature) {
            drawFeatures(obj, options);
        }
    } else if (obj instanceof Geometry) {
        drawGeometries([obj], options);
    } else if (obj instanceof Feature) {
        drawFeatures([obj], options);
    } else if (obj instanceof Layer) {
        drawLayer(obj, options);
    } else if (obj instanceof Map) {
        drawMap(obj, options)
    }
};
