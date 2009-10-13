var Layer = require("geoscript/layer").Layer;
var util = require("geoscript/util");
var ShapefileDataStore = Packages.org.geotools.data.shapefile.ShapefileDataStore;

var ShapefileLayer = util.extend(Layer, {
    
    constructor: function(file) {
        var shp = new ShapefileDataStore(
            util.toURL(file), 
            new java.net.URI("http://geoscript.org")
        );
        Layer.prototype.constructor.apply(this, shp.featureSource);
    }
    
});

