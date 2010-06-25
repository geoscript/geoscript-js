/** api: module = map */

/** api: synopsis
 *  Map rendering functionality.
 */

/** api: summary
 *  The :mod:`map` module provides map rendering functionality.
 *
 *  .. code-block:: javascript
 *  
 *      js> var MAP = require("geoscript/map");
 */
 
var STYLE_UTIL = require("./style/util");
var Bounds = require("./geom").Bounds;

var RenderingHints = java.awt.RenderingHints;

var geotools = Packages.org.geotools;
var DefaultMapContext = geotools.map.DefaultMapContext;
var DefaultMapLayer = geotools.map.DefaultMapLayer;
var MapContext = geotools.map.MapContext;
var MapLayer = geotools.map.MapLayer;
var GTRenderer = geotools.renderer.GTRenderer;
var StreamingRenderer = geotools.renderer.lite.StreamingRenderer;
var LabelCacheImpl = geotools.renderer.label.LabelCacheImpl;


var UTIL = require("./util");

var renderDefaults = {
    width: 256,
    height: 256,
    imageType: "png",
    fixAspectRatio: true
};

/** api: class = Map */
var Map = UTIL.extend(Object, {
    
    /** api: constructor
     *  .. class:: Map
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a rule for rendering features.
     */
    constructor: function Map(config) {

        this._context = new DefaultMapContext();

        this._renderer = new StreamingRenderer();
        var hints = new RenderingHints(
            RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON
        );
        hints.add(new RenderingHints(
            RenderingHints.KEY_TEXT_ANTIALIASING, 
            RenderingHints.VALUE_TEXT_ANTIALIAS_ON
        ));
        this._renderer.setJava2DHints(hints);
        
        // TODO: more hints
        
        this._renderer.setContext(this._context);

        UTIL.apply(this, config);
        this.renderOptions = UTIL.applyIf(
            this.renderOptions, renderDefaults
        );

    },
    
    set projection(projection) {
        this._context.setCoordinateReferenceSystem(projection._projection);
    },
    
    get bounds() {
        var _bounds = this._context.getLayerBounds();
        return Bounds.from_(_bounds);
    },
    
    add: function(layer) {
        var _style = layer.style && layer.style._style || STYLE_UTIL._builder.createStyle();
        var _layer = new DefaultMapLayer(layer._source, _style);
        this._context.addLayer(_layer);
    },
    
    /** api: method[render]
     */
    render: function(options) {
        options = UTIL.applyIf(options, this.renderOptions);
        var bounds = options.bounds || this.bounds;
        var path = options.path || "out." + options.imageType;
        var width = options.width;
        var height = options.height;
        var image = new java.awt.image.BufferedImage(
            width, height, java.awt.image.BufferedImage.TYPE_INT_ARGB
        );
        var graphics = image.createGraphics();
        if (options.fixAspectRatio) {
            bounds = this.adjustBounds(bounds, width, height);
        }
        this._renderer.paint(
            graphics, 
            new java.awt.Rectangle(0, 0, width, height), 
            bounds._bounds
        );
        var out = new java.io.FileOutputStream(path);
        javax.imageio.ImageIO.write(image, options.imageType, out);
        out.close();
    },
    
    adjustBounds: function(bounds, width, height) {
        var requestWidth = bounds.width;
        var requestHeight = bounds.height;
        var scale = Math.min(width / requestWidth, height / requestHeight);
        var deltaX = width / scale - requestWidth;
        var deltaY = height / scale - requestHeight;
        return new Bounds({
            minx: bounds.minx - deltaX / 2, 
            miny: bounds.miny - deltaY / 2, 
            maxx: bounds.maxx + deltaX / 2, 
            maxy: bounds.maxy + deltaY / 2, 
            projection: bounds.projection
        });
    },
        
    /** private: method[toFullString]
     */
    toFullString: function() {
        return "";
    }
    
});

exports.Map = Map;
