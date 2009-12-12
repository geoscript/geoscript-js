var geom = require("geoscript/geom");
var feature = require("geoscript/feature");
var util = require("geoscript/util");

var drawGeometry = function(geometry, options) {
    options = util.applyIf(options, {
        size: [500, 500],
        fill: true,
        strokeWidth: 1,
        buffer: 50,
        title: geometry.toString()
    });
    
    var width = options.size[0];
    var height = options.size[1];
    
    var envelope = geometry._geometry.getEnvelopeInternal();
    var shapeWidth = envelope.getWidth();
    var shapeHeight = envelope.getHeight();

    var transform = new java.awt.geom.AffineTransform();

    // scale to size of canvas (inverting the y axis)
    var scale = Math.min(width / shapeWidth, height / shapeHeight);
    transform.scale(scale, -scale);

    // center the shape using scaled offsets
    transform.translate(
        (options.buffer / scale) - envelope.getMinX() + (((width / scale) - shapeWidth) / 2), 
        (-options.buffer / scale) - envelope.getMaxY() - (((height / scale) - shapeHeight) / 2)
    );

    var LiteShape = Packages.org.geotools.geometry.jts.LiteShape;
    var shp = new LiteShape(geometry._geometry, transform, false);

    var panel = new JavaAdapter(javax.swing.JPanel, {
        paintComponent: function(g) {
            if (options.fill) {
                g.setColor(java.awt.Color.WHITE);
                g.fill(shp);
            }
            g.setRenderingHint(
                java.awt.RenderingHints.KEY_ANTIALIASING, 
                java.awt.RenderingHints.VALUE_ANTIALIAS_ON
            );
            g.setStroke(java.awt.BasicStroke(options.strokeWidth))
            g.setColor(java.awt.Color.BLACK);
            g.draw(shp);
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
    if (obj instanceof geom.Geometry) {
        drawGeometry(obj, options);
    } else if (obj instanceof feature.Feature) {
        drawGeometry(
            obj.geometry, 
            util.applyIf(options, {title: obj.toString()})
        );
    }
};

exports.draw = draw;
