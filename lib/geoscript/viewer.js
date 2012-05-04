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

var drawGeometries = function(geometries, options) {
    
    var width = options.size[0];
    var height = options.size[1];
    
    var len = geometries.length;
    var _geometries = new Array(len);
    for (var i=0; i<len; ++i) {
        _geometries[i] = geometries[i]._geometry;
    }
    var _collection = Geometry._factory.createGeometryCollection(_geometries);
    
    var envelope = _collection.getEnvelopeInternal();
    var shapeWidth = envelope.getWidth();
    var shapeHeight = envelope.getHeight();

    var transform = new java.awt.geom.AffineTransform();

    // scale to size of canvas (inverting the y axis)
    var scale = (shapeWidth || shapeHeight) ? Math.min(width / shapeWidth, height / shapeHeight) : 1;
    transform.scale(scale, -scale);

    // center the shape using scaled offsets
    transform.translate(
        (options.buffer / scale) - envelope.getMinX() + (((width / scale) - shapeWidth) / 2), 
        (-options.buffer / scale) - envelope.getMaxY() - (((height / scale) - shapeHeight) / 2)
    );

    var LiteShape = Packages.org.geotools.geometry.jts.LiteShape;

    var panel = new JavaAdapter(javax.swing.JPanel, {
        paintComponent: function(gc) {
            gc.setStroke(java.awt.BasicStroke(1));
            var _geometry;
            for (var i=0; i<len; ++i) {
                _geometry = _geometries[i];
                var shp = new LiteShape(_geometry, transform, false);
                if (_geometry.getDimension() > 1) {
                    gc.setColor(new java.awt.Color(1.0, 1.0, 239/255));
                    gc.fill(shp);
                }
                gc.setColor(java.awt.Color(80/255, 70/255, 115/255));
                gc.draw(shp);
            }
        }
    });
    panel.setPreferredSize(new java.awt.Dimension(
        java.lang.Integer(width + 2 * options.buffer),
        java.lang.Integer(height + 2 * options.buffer)
    ));
    
    render(panel, options.title);
};


function drawMap(map, options) {
    var width = options.size[0];
    var height = options.size[1];
    var frame = bound && cache.frame || new javax.swing.JFrame();
    var parts = map.getRendererAndContext();
    var context = parts[1];
    var mapPane = new JMapPane(context);
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
    render(mapPane, options.title);
}

function render(panel, title) {
    var frame = bound && cache.frame || new javax.swing.JFrame();
    frame.setTitle(title);
    frame.setContentPane(panel);
    frame.pack();
    frame.repaint();
    frame.setVisible(true);
    
    cache.frame = frame;    
}

var draw = exports.draw = function(obj, options) {
    options = UTIL.applyIf(options, {
        size: [350, 350],
        buffer: 50,
        title: obj.toString(false)
    });

    if (UTIL.isArray(obj)) {
        var first = obj[0];
        if (first instanceof Geometry) {
            drawGeometries(obj, options);
        } else if (first instanceof Feature) {
            drawGeometries(obj.map(function(feature) {
                return feature.geometry;
            }), options);
        }
    } else if (obj instanceof Geometry) {
        drawGeometries([obj], options);
    } else if (obj instanceof Feature) {
        drawGeometries([obj.geometry], options);
    } else if (obj instanceof Layer) {
        drawMap(new Map([obj]), options);
    } else if (obj instanceof Map) {
        drawMap(obj, options)
    }
};
