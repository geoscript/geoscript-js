var Layer = require("geoscript/layer").Layer;
var Schema = require("geoscript/feature").Schema;
var util = require("geoscript/util");
var ShapefileDataStore = Packages.org.geotools.data.shapefile.ShapefileDataStore;

var ShapefileLayer = util.extend(Layer, {
    
    constructor: function(file) {
        print(file);
        var store = new ShapefileDataStore(
            util.toURL(file), 
            new java.net.URI("http://geoscript.org")
        );
        this._source = store.getFeatureSource();
        this.schema = Schema.from_(this._source.getSchema());
        this.name = this._source.getName().getLocalPart();
        Layer.prototype.constructor.apply(this, []);
    }
    
});

exports.ShapefileLayer = ShapefileLayer;

