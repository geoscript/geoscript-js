var FILTER_UTIL = require("./util");
var Factory = require("../factory").Factory;
var UTIL = require("../util");
var GeoObject = require("../object").GeoObject;

var _Filter = Packages.org.opengis.filter.Filter;
var CQL = Packages.org.geotools.filter.text.cql2.CQL;
var ECQL = Packages.org.geotools.filter.text.ecql.ECQL;
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


/** api: (define)
 *  module = filter
 *  class = Filter
 */
var Filter = exports.Filter = UTIL.extend(GeoObject, {
    
    /** api: constructor
     *  .. class:: Filter
     *
     *      :arg cql: `String` A CQL string representing filter constraints.
     *
     *      Create a new filter to express constraints.  Filters are typically
     *      used when querying features from a layer.  A feature will be
     *      returned in a query if the filter's :meth:`evaluate` method returns
     *      `true` for the given feature.
     *
     *      Filters are created using Common Query Language (CQL).
     */
    constructor: function Filter(cql) {
        if (cql) {
            if (typeof cql !== "string") {
                cql = cql.cql;
            }
            var _filter;
            try {
                _filter = ECQL.toFilter(cql);
            } catch (err) {
                try {
                    _filter = CQL.toFilter(cql);
                } catch (err2) {
                    throw err;
                }
            }
            this._filter = _filter;
        }
    },
    
    /** api: method[evaluate]
     *  :arg feature: :class:`feature.Feature` A feature.
     *  :returns: ``Boolean``  The feature matches the filter.
     *
     *  Determine whether a feature matches the constraints of the filter.
     */
    evaluate: function(feature) {
        return Boolean(this._filter.evaluate(feature._feature));
    },
    
    /** api: property[not]
     *  :class:`filter.Filter`
     *  A filter that represents the negation of the constraints in this filter.
     */
    get not() {
        return Filter.from_(FilterFactory2.not(this._filter));
    },

    /** api: method[and]
     *  :arg filter: :class:`filter.Filter` Input filter.
     *  :returns: :class:`filter.Filter`
     *  Returns a new filter that is the logical AND of this filter and the 
     *  input filter.  Provide multiple arguments to AND multiple filters.
     */
    and: function(filter) {
        var filters = Array.prototype.slice.call(arguments);
        filters.push(this);
        return Filter.and(filters);
    },
    
    /** api: method[or]
     *  :arg filter: :class:`filter.Filter` Input filter.
     *  :returns: :class:`filter.Filter`
     *  Returns a new filter that is the logical OR of this filter and the 
     *  input filter.  Provide multiple arguments to OR multiple filters.
     */
    or: function(filter) {
        var filters = Array.prototype.slice.call(arguments);
        filters.push(this);
        return Filter.or(filters);
    },
    
    /** api: property[cql]
     *  ``String``
     *  The CQL string that represents constraints in this filter.
     */
    get cql() {
        var string;
        try {
            string = ECQL.toECQL(this._filter);
        } catch (err) {
            string = CQL.toCQL(this._filter);
        }
        return String(string);
    },
    
    get config() {
        return {
            type: "Filter",
            cql: this.cql
        };
    },
    
    /** private: method[toXML]
     *  :arg version: ``String`` Filter Encoding specification version
     *      (default is `"1.0"`).
     *  :arg pretty: ``Boolean`` Use whitespace to indent document elements
     *      (default is `false`).
     *  :returns: ``String``
     *
     *  Generate an XML document string following the Filter Encoding
     *  specification.
     */
    toXML: function(version, pretty) {
        version = version || "1.0";
        var _config = new OGC[version].OGCConfiguration();
        var ogc = OGC[version].OGC.getInstance();
        var encoder = new Encoder(_config);
        encoder.setIndenting(!!pretty);
        encoder.setOmitXMLDeclaration(true);
        var out = new java.io.ByteArrayOutputStream();
        encoder.encode(this._filter, ogc.Filter, out);
        return String(java.lang.String(out.toByteArray()));
    },
    
    toFullString: function() {
        var str;
        try {
            str = this.cql;
        } catch (err) {
            str = String(this._filter);
        }
        return str;
    }
    
});

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
    var filter;
    for (var i=0; i<len; ++i) {
        filter = filters[i];
        if (!(filter instanceof Filter)) {
            filter = new Filter(filter);
        }
        list.add(filter._filter);
    }
    return list;
};

Filter.and = function(filters) {
    return Filter.from_(FilterFactory2.and(getArrayList(filters)));    
};

Filter.or = function(filters) {
    return Filter.from_(FilterFactory2.or(getArrayList(filters)));
};

Filter.not = function(filter) {
    if (!(filter instanceof Filter)) {
        filter = new Filter(filter);
    }
    return Filter.from_(FilterFactory2.not(filter._filter));
};

Filter.fids = function(fids) {
    var _filter = FilterFactory2.createFidFilter();
    for (var i=0, len=fids.length; i<len; ++i) {
        _filter.addFid(fids[i]);
    }
    return Filter.from_(_filter);
};

/** api: example
 *  Examples of filters that represent various simple constraints:
 * 
 *  .. code-block:: javascript
 * 
 *      js> var namedFoo = new FILTER.Filter("name = 'foo'");
 *      js> var oneThing = new FILTER.Filter("thing = 1");
 *      js> var few = new FILTER.Filter("count < 4");
 *      js> var many = new FILTER.Filter("count > 36");
 *      js> var teens = new FILTER.Filter("age BETWEEN 13 AND 19");
 *
 *  Examples of filters representing spatial constraints:
 *
 *  .. code-block:: javascript
 *  
 *      js> var box = new FILTER.Filter("BBOX(the_geom, -10, -10, 10, 10)");
 *      js> var close = new FILTER.Filter("DWITHIN(the_geom, POINT(1 0), 3, kilometers)");
 *      js> var has = new FILTER.Filter("CONTAINS(the_geom, POINT(1 0))");
 *      js> var hit = new FILTER.Filter("INTERSECTS(the_geom, LINESTRING(0 0, 1 1))");
 */

// register a filter factory for the module
FILTER_UTIL.register(new Factory(Filter, {
    handles: function(config) {
        return true;
    }
}));
