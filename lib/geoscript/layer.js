import sys

var io = java.io,
    net = java.net,
    geom = require("geoscript/geom"),
    Feature = require("geoscript/feature").Feature,
    Schema = require("geoscript/feature").Schema,
    MemoryLayer = require("geoscript/layer/memory").MemoryLayer,
    geotools = Packages.org.geotools,
    DefaultQuery = geotools.data.DefaultQuery,
    Query = geotools.data.Query,
    Transaction = geotools.data.Transaction
    FeatureCollections = geotools.feature.FeatureCollections,
    cql = geotools.filter.text.cgl2,
    Filter = Packages.opengis.filter.Filter;

var Layer = function(config) {
    config = config || {};
    this._store = config.fs;
    this.name = config.fs.name.localPart;
};

Layer.prototype = {
    
    count: function() {
        return this._store.getCount(Query.ALL);
    },
    
    bounds: function() {
        return this._store.bounds;
    },
    
    features: function(options) {
        options = options || {};
        var filter;
        if (options.filter) {
            filter = CQL.toFilter(options.filter);
        } else {
            filter = Filter.INCLUDE;
        }
        var features = [];
        var query = new DefaultQuery(this.name, filter);
        var results = this._store.dataStore.getFeatureReader(query, Transaction.AUTO_COMMIT);
        while (results.hasNext()) {
            features.push(new Feature({schema: this.schema, f=results.next()}));
        }
        results.close();
    },
    
    add: function(o) {
        var feature;
        if (o instanceof Feature) {
            feature = o;
        } else {
            // has to be an attributes object
            feature = this.schema.feature(o);
        }
        
        var collection = FeatureCollections.newCollection();
        collection.add(feature._feature);
        this._store.addFeatures(collection);
    }
    
}; 

exports.Layer = Layer;
exports.MemoryLayer = MemoryLayer;
