var util = require("geoscript/util");
util.createRegistry(exports);

var _Filter = Packages.org.opengis.filter.Filter;
var CQL = Packages.org.geotools.filter.text.cql2.CQL;
var Parser = Packages.org.geotools.xml.Parser;
var Encoder = Packages.org.geotools.xml.Encoder;
var _factory = Packages.org.geotools.factory;
var FilterFactory2 = _factory.CommonFactoryFinder.getFilterFactory2(_factory.GeoTools.getDefaultHints());

var OGC = {
    "1.0": {
        OGC: Packages.org.geotools.filter.v1_0.OGC,
        OGCConfiguration: Packages.org.geotools.filter.v1_0.OGCConfiguration
    },
    "1.1": {
        OGC: Packages.org.geotools.filter.v1_1.OGC,
        OGCConfiguration: Packages.org.geotools.filter.v1_1.OGCConfiguration
    }
};

var Filter = util.extend(Object, {
    
    constructor: function Filter(cql) {
        if (cql) {
            this._filter = CQL.toFilter(cql);
        }
    },
    
    evaluate: function(feature) {
        return Boolean(this._filter.evaluate(feature._feature));
    },

    get not() {
        return Filter.from_(FilterFactory2.not(this._filter));
    },
    
    get cql() {
        return CQL.toCQL(this._filter);
    },
    
    get config() {
        return {
            type: "Filter",
            cql: this.cql
        };
    },
    
    get json() {
        return JSON.encode(this.config);
    },
    
    toXML: function(version, pretty) {
        version = version || "1.0";
        var _config = new OGC[version].OGCConfiguration();
        var ogc = OGC[version].OGC.getInstance();
        var encoder = new Encoder(_config);
        encoder.setIndenting(!!pretty);
        encoder.setEmitXMLDeclaration(true);
        var out = new java.io.ByteArrayOutputStream();
        encoder.encode(this._filter, ogc.Filter, out);
        return String(java.lang.String(out.toByteArray()));
    },
    
    toFullString: function() {
        return this.cql;
    }
    
});

Filter.fromXML = function(xml, version) {
    version = version || "1.0";
    var _config = new OGC[config.version].OGCConfiguration();
    var parser = new Parser(_config);
    var filter = new Filter();
    filter._filter = parser.parse(new java.io.StringReader(config.xml));
    return filter;
};

Filter.from_ = function(_filter) {
    var filter = new Filter();
    filter._filter = _filter;
    return filter;
};

Filter.PASS = Filter.from_(_Filter.INCLUDE);
Filter.FAIL = Filter.from_(_Filter.EXCLUDE);

// logical operators

var getArrayList = function(filters) {
    var len = filters.length;
    var list = new java.util.ArrayList(len);
    for (var i=0; i<len; ++i) {
        list.add(filters[i]._filter);
    }
    return list;
};

var and = function(filters) {
    return Filter.from_(FilterFactory2.and(getArrayList(filters)));    
};

var or = function(filters) {
    return Filter.from_(FilterFactory2.or(getArrayList(filters)));
};

var not = function(filter) {
    return Filter.from_(FilterFactory2.not(filter._filter));
};

exports.Filter = Filter;
exports.and = and;
exports.or = or;
exports.not = not;

// register a layer factory for the module
var Factory = require("geoscript/factory").Factory;

exports.register(new Factory(Filter, {
    handles: function(config) {
        return true;
    }
}));
