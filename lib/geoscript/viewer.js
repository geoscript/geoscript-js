var geom = require("geoscript/geom");
var feature = require("geoscript/feature");
var util = require("geoscript/util");

var drawGeometries = function(geometries, options) {
    options = util.applyIf(options, {
        size: [500, 500],
        fill: true,
        strokeWidth: 1,
        buffer: 50
    });
    
    var width = options.size[0];
    var height = options.size[1];
    
    var len = geometries.length;
    var _geometries = new Array(len);
    for (var i=0; i<len; ++i) {
        _geometries[i] = geometries[i]._geometry;
    }
    var _collection = geom.Geometry._factory.createGeometryCollection(_geometries);
    
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
            gc.setRenderingHint(
                java.awt.RenderingHints.KEY_ANTIALIASING, 
                java.awt.RenderingHints.VALUE_ANTIALIAS_ON
            );
            gc.setStroke(java.awt.BasicStroke(options.strokeWidth))
            var opaque = gc.getComposite();
            
            for (var i=0; i<len; ++i) {
                var shp = new LiteShape(_geometries[i], transform, false);
                if (options.fill) {
                    gc.setColor(java.awt.Color.WHITE);
                    gc.setComposite(
                        java.awt.AlphaComposite.getInstance(
                            java.awt.AlphaComposite.SRC_OVER, 0.5
                        )
                    );
                    gc.fill(shp);
                }
                gc.setColor(java.awt.Color.BLACK);
                gc.setComposite(opaque)
                gc.draw(shp);
            }
        }
    });
    panel.setPreferredSize(new java.awt.Dimension(
        java.lang.Integer(width + 2 * options.buffer),
        java.lang.Integer(height + 2 * options.buffer)
    ));

    var frame = new javax.swing.JFrame(options.title);
    frame.setContentPane(panel);
    frame.pack();
    frame.setVisible(true);
    
};

var draw = function(obj, options) {
    var geometries;
    if (obj instanceof Array) {
        var first = obj[0];
        if (first instanceof geom.Geometry) {
            geometries = obj;
        } else if (first instanceof feature.Feature) {
            var len = obj.length;
            geometries = new Array(len);
            for (var i=0; i<len; ++i) {
                geometries[i] = obj[i].geometry;
            }
        }
    } else if (obj instanceof geom.Geometry) {
        geometries = [obj];
    } else if (obj instanceof feature.Feature) {
        geometries = [obj.geometry];
    }
    drawGeometries(geometries, util.applyIf(options, {title: obj.toString()}));
};

exports.draw = draw;
