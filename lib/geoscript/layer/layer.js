var Feature = require("geoscript/feature").Feature;
var Schema = require("geoscript/feature").Schema;
var util = require("geoscript/util");

var geotools = Packages.org.geotools;
var DefaultQuery = geotools.data.DefaultQuery;
var Query = geotools.data.Query;
var Transaction = geotools.data.Transaction;
var FeatureCollections = geotools.feature.FeatureCollections;
var CQL = geotools.filter.text.cgl2.CQL;
var Filter = Packages.org.opengis.filter.Filter

var Layer = util.extend(Object, {
    
    constructor: function Layer(config) {
        if (config) {
            this.setSchema(config);
        }
    },
    
    setSchema: function(config) {
        if (config.schema) {
            this.schema = config.schema;
        } else {
            // require name and atts
            this.schema = new Schema({
                name: config.name,
                atts: config.atts
            });
        }
        if (!this._source) {
            this._source = this._create(config);
        }
        this.name = this._source.getName().getLocalPart();
    },
    
    /** private: method[_create]
     *  :arg hmm: ``Something``
     *
     *  Create the underlying source for this layer.
     */
    _create: function(config) {
        throw new Error("Layer subclass must implement _create.");
    },
    
    count: function() {
        return this._source.getCount(Query.ALL);
    },
    
    bounds: function() {
        return this._source.bounds;
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
        var results = this._source.dataStore.getFeatureReader(query, Transaction.AUTO_COMMIT);
        while (results.hasNext()) {
            features.push(new Feature({schema: this.schema, f: results.next()}));
        }
        results.close();
        return features;
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
        this._source.addFeatures(collection);
    },
    
    toFullString: function() {
        return "name: " + this.name + ", count: " + this.count();
    }
    
});


exports.Layer = Layer;
