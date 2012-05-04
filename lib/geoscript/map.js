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
var GeoObject = require("./object").GeoObject;
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

/** api: class = Map */
var Map = UTIL.extend(GeoObject, {
    
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
        if (UTIL.isArray(config)) {
            config = {layers: config};
        }
        
        UTIL.apply(this, config);
        this.renderOptions = UTIL.applyIf(
            this.renderOptions, renderDefaults
        );

    },
    
    /** api: config[projection]
     *  :class:`proj.Projection`
     *  Optional projection for the map.  If set, calls to :meth:`render` will
     *  result in a map image in this projection.  If not set, the projection
     *  of the first layer will be used.
     */
    set projection(projection) {
        if (!(projection instanceof Projection)) {
            projection = new Projection(projection);
        }
        this.cache.projection = projection;
    },
    /** api: property[projection]
     *  :class:`proj.Projection`
     *  The projection for rendering layers.
     */
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
                this.bounds = layer.bounds.clone();
            }
        }
        var bounds = this.cache.bounds;
        if (this.projection) {
            if (!bounds.projection) {
                bounds.projection = this.projection;
            } else {
                bounds = bounds.transform(this.projection);
                this.bounds = bounds;
            }
        }
        return bounds;
    },
    
    /** api: config[layers]
     *  ``Array``
     *  List of :class:`layer.Layer` objects making up this map.
     */
    set layers(layers) {
        this.cache.layers = [];
        layers.forEach(this.add, this);
    },
    get layers() {
        return this.cache.layers;
    },
    
    /** api: method[add]
     *  :arg layer: :class:`layer.Layer`
     *
     *  Add a layer to the map.
     */
    add: function(layer) {
        if (!(layer instanceof Layer)) {
            layer = new Layer(layer);
        }
        this.cache.layers.push(layer);
    },
    
    getRendererAndContext: function() {
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
        this.layers.forEach(function(layer) {
            _context.addLayer(
                new DefaultMapLayer(layer._source, layer.style._style)
            );
        });
        if (this.projection) {
            _context.setCoordinateReferenceSystem(this.projection._projection);
        }
        return [_renderer, _context];
    },
    
    /** api: method[render]
     *  Render the map's collection of layers as an image.
     *
     *  TODO: document render options
     */
    render: function(options) {
        options = options || {};
        if (typeof options === "string") {
            options = {path: options};
        }
        
        var parts = this.getRendererAndContext();
        var _renderer = parts[0];
        var _context = parts[1];

        _renderer.setContext(_context);

        if (!options.imageType && options.path) {
            options.imageType = UTIL.getImageType(options.path);
        }
        options = UTIL.applyIf(options, this.renderOptions);
        if (!(options.imageType in UTIL.imageTypes)) {
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
        if (this.projection) {
            if (!bounds.projection) {
                bounds.projection = this.projection;
            } else {
                bounds = bounds.transform(this.projection);
            }
        }
        if (options.fixAspectRatio) {
            bounds = this.adjustBounds(bounds, width, height);
        }
        var _graphics = _image.createGraphics();
        if (options.backgroundColor) {
            var hex = STYLE_UTIL.getHexColor(options.backgroundColor);
            if (hex) {
                _graphics.setColor(java.awt.Color.decode(hex));
                _graphics.fillRect(0, 0, width, height);
            } else {
                throw new Error("Can't determine hex color from backgroundColor '" + color + "'.");
            }
        }
        _renderer.paint(
            _graphics, 
            new java.awt.Rectangle(0, 0, width, height), 
            bounds._bounds
        );
        _context.dispose();

        var result, _stream;
        if (options.path) {
            _stream = new java.io.FileOutputStream(options.path);
            javax.imageio.ImageIO.write(_image, options.imageType, _stream);
            _stream.close();
        } else if (options.output) {
            javax.imageio.ImageIO.write(_image, options.imageType, options.output);            
        } else {
            _stream = new java.io.ByteArrayOutputStream();
            javax.imageio.ImageIO.write(_image, options.imageType, _stream);
            // TODO: wrap this or come up with an alternative
            result = _stream.toByteArray();
            // result = new ByteArray(_stream.toByteArray());
        }
        return result;
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
        return "layers: " + this.layers.map(function(l) {return l.name}).join(", ");
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
