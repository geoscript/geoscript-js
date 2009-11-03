var geom = require("geoscript/geom");

var drawGeometry = function(geometry, options) {

    options = options || {};
    var size = options.size || [500, 500];
    var buf = (buf in options) ? options.buf : 50;
    
    var awt = java.awt;
    var AffineTransform = java.awt.geom.AffineTransform;
    var swing = javax.swing;
    var LiteShape = Packages.org.geotools.geometry.jts.LiteShape;

    var e = geometry._geometry.getEnvelopeInternal();
    var scx = size[0] / e.width;
    var scy = size[1] / e.height;

    var tx = -1 * e.minX;
    var ty = -1 * e.minY;

    var at = new AffineTransform();

    // scale to size of canvas (inverting the y axis)
    at.scale(scx, -scy);

    // translate to the origin
    at.translate(tx, ty);

    // translate to account for invert
    at.translate(0, -size[1] / scy);

    // buffer
    at.translate(buf / scx, -buf / scy);

    var shp = LiteShape(geometry._geometry, at, false);

    var panel = new JavaAdapter(swing.JPanel, {
        paintComponent: function(g) {
            g.draw(shp);
        }
    });
    
    var s = new awt.Dimension(
        (size[0] + 2 * buf) | 0,
        (size[1] + 2 * buf) | 0
    );
    panel.setPreferredSize(s);
    var frame = new swing.JFrame();
    frame.contentPane = panel;
    frame.setSize(s);
    frame.visible = true;
    
};

var draw = function(obj, options) {
    if (obj instanceof geom.Geometry) {
        drawGeometry(obj, options);
    }
};

exports.draw = draw;

