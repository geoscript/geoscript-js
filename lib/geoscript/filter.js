var util = require("geoscript/util");

var _Filter = Packages.org.opengis.filter.Filter;
var CQL = Packages.org.geotools.filter.text.cql2.CQL;
var Parser = Packages.org.geotools.xml.Parser;
var Encoder = Packages.org.geotools.xml.Encoder;

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
    
    defaults: {
        version: "1.0"
    },
    
    constructor: function Filter(config) {
        if (config) {
            var config = util.applyIf({}, config, this.defaults);
            var _filter;
            if (config.cql) {
                _filter = CQL.toFilter(config.cql);
            }
            if (config.xml) {
                var _config = new OGC[config.version].OGCConfiguration();
                var parser = new Parser(_config);
                _filter = parser.parse(new java.io.StringReader(config.xml));
            }
            if (!_filter) {
                throw "Filter config must include cql or xml property.";
            }
            this._filter = _filter;
        }
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
        version = version || this.defaults.version;
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

Filter.from_ = function(_filter) {
    var filter = new Filter();
    filter._filter = _filter;
    return filter;
};

Filter.PASS = Filter.from_(_Filter.INCLUDE);
Filter.FAIL = Filter.from_(_Filter.EXCLUDE);

exports.Filter = Filter;
