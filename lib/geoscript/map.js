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
 
var UTIL = require("./util");
var Registry = require("./registry").Registry;
var Factory = require("./factory").Factory;
var STYLE_UTIL = require("./style/util");
var Layer = require("./layer").Layer;
var Bounds = require("./geom").Bounds;
var Projection = require("./proj").Projection;

var geotools = Packages.org.geotools;
var DefaultMapContext = geotools.map.DefaultMapContext;
var DefaultMapLayer = geotools.map.DefaultMapLayer;
var GTRenderer = geotools.renderer.GTRenderer;
var StreamingRenderer = geotools.renderer.lite.StreamingRenderer;
var LabelCacheImpl = geotools.renderer.label.LabelCacheImpl;

var RenderingHints = java.awt.RenderingHints;

var renderDefaults = {
    width: 256,
    height: 256,
    imageType: "png",
    fixAspectRatio: true
};

// lookup for image types
var imageTypes = {};
javax.imageio.ImageIO.getWriterFormatNames().forEach(function(type) {
    imageTypes[String(type)] = true;
});

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

        this.cache = {
            layers: []
        };

        
        // apply config and set underlying context
        UTIL.apply(this, config);
        this.renderOptions = UTIL.applyIf(
            this.renderOptions, renderDefaults
        );

    },
    
    set projection(projection) {
        if (!(projection instanceof Projection)) {
            projection = new Projection(projection);
        }
        this.cache.projection = projection;
    },
    get projection() {
        if (!this.cache.projection) {
            var layer;
            for (var i=0, ii=this.layers.length; i<ii; ++i) {
                layer = this.layers[i];
                if (layer.projection) {
                    this.projection = layer.projection;
                    break;
                }
            }
        }
        return this.cache.projection;
    },
    
    set bounds(bounds) {
        if (!(bounds instanceof Bounds)) {
            bounds = new Bounds(bounds);
        }
        this.cache.bounds = bounds;
    },
    get bounds() {
        if (!this.cache.bounds) {
            // default to first layer bounds
            var layer = this.layers[0];
            if (layer) {
                this.cache.bounds = layer.bounds;
            }
        }
        return this.cache.bounds;
    },
    
    set layers(layers) {
        this.cache.layers = [];
        layers.forEach(this.add, this);
    },
    get layers() {
        return this.cache.layers;
    },
    
    add: function(layer) {
        if (!(layer instanceof Layer)) {
            layer = new Layer(layer);
        }
        this.cache.layers.push(layer);
    },
    
    /** api: method[render]
     *  TODO: document render options
     */
    render: function(options) {
        var _renderer = this._getRenderer();
        options = options || {};
        if (!options.imageType && options.path) {
            options.imageType = this.getImageType(options.path);
        }
        options = UTIL.applyIf(options, this.renderOptions);
        if (!(options.imageType in imageTypes)) {
            throw new Error("Image type '" + options.imageType + "' not supported.");
        }
        var width = options.width;
        var height = options.height;
        var _image = new java.awt.image.BufferedImage(
            width, height, java.awt.image.BufferedImage.TYPE_INT_ARGB
        );
        var bounds = options.bounds || this.bounds;
        if (!(bounds instanceof Bounds)) {
            bounds = new Bounds(bounds);
        }
        if (options.fixAspectRatio) {
            bounds = this.adjustBounds(bounds, width, height);
        }
        var _graphics = _image.createGraphics();
        _renderer.paint(
            _graphics, 
            new java.awt.Rectangle(0, 0, width, height), 
            bounds._bounds
        );
        if (options.output) {
            javax.imageio.ImageIO.write(_image, options.imageType, options.output);
        } else {
            var path = options.path || "out." + options.imageType;
            var output = new java.io.FileOutputStream(path);
            javax.imageio.ImageIO.write(_image, options.imageType, output);
            output.close();
        }
    },
    
    getImageType: function(path) {
        var extension = path.split(".").pop().toLowerCase();
        return (extension in imageTypes) ? extension : null;
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

    _getRenderer: function() {

        // set up underlying renderer
        var _renderer = new StreamingRenderer();
        var hints = new RenderingHints(
            RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON
        );
        hints.add(new RenderingHints(
            RenderingHints.KEY_TEXT_ANTIALIASING, 
            RenderingHints.VALUE_TEXT_ANTIALIAS_ON
        ));
        _renderer.setJava2DHints(hints);
        // TODO: more hints

        // set up underlying map context
        var _context = new DefaultMapContext();
        var projection = this.projection;
        this.layers.forEach(function(layer) {
            _context.addLayer(
                new DefaultMapLayer(layer._source, layer.style._style)
            );
        });
        if (this.projection) {
            _context.setCoordinateReferenceSystem(this.projection._projection);
        }
        _renderer.setContext(_context);

        return _renderer;
    },
    
    /** private: method[toFullString]
     */
    toFullString: function() {
        return "";
    }
    
});

exports.Map = Map;

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: :class:`map.Map`
 *
 *  Create a map given a configuration object.
 */
var registry = new Registry();
exports.create = registry.create;

// register a map factory for the module
registry.register(new Factory(Map, {
    handles: function(config) {
        return true;
    }
}));
