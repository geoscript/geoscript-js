var FILTER_UTIL = require("./util");
var Factory = require("../factory").Factory;
var _Filter = Packages.org.opengis.filter.Filter;

/** api: (define)
 *  module = filter
 *  class = Filter
 */
Packages.org.geoscript.js.filter.Module.init(this);
var Filter = exports.Filter = this["org.geoscript.js.filter.Filter"];

/** api: constructor
 *  .. class:: Filter
 *
 *    :arg cql: `String` A CQL string representing filter constraints.
 *
 *    Create a new filter to express constraints.  Filters are typically
 *    used when querying features from a layer.  A feature will be
 *    returned in a query if the filter's :func:`evaluate` method returns
 *    `true` for the given feature.
 *
 *    Filters are created using Common Query Language (CQL).
 */

/** api: method[evaluate]
 *  :arg feature: :class:`feature.Feature` A feature.
 *  :returns: ``Boolean``  The feature matches the filter.
 *
 *  Determine whether a feature matches the constraints of the filter.
 */


/** api: property[not]
 *  :class:`filter.Filter`
 *  A filter that represents the negation of the constraints in this filter.
 */


/** api: method[and]
 *  :arg filter: :class:`filter.Filter` Input filter.
 *  :returns: :class:`filter.Filter`
 *  Returns a new filter that is the logical AND of this filter and the
 *  input filter.  Provide multiple arguments to AND multiple filters.
 */

/** api: method[or]
 *  :arg filter: :class:`filter.Filter` Input filter.
 *  :returns: :class:`filter.Filter`
 *  Returns a new filter that is the logical OR of this filter and the
 *  input filter.  Provide multiple arguments to OR multiple filters.
 */


/** api: property[cql]
 *  ``String``
 *  The CQL string that represents constraints in this filter.
 */

/** private: method[toXML]
 *  :arg version: ``String`` Filter Encoding specification version
 *    (default is `"1.0"`).
 *  :arg pretty: ``Boolean`` Use whitespace to indent document elements
 *    (default is `false`).
 *  :returns: ``String``
 *
 *  Generate an XML document string following the Filter Encoding
 *  specification.
 */

Filter.PASS = Filter.from_(_Filter.INCLUDE);
Filter.FAIL = Filter.from_(_Filter.EXCLUDE);

/** api: example
 *  Examples of filters that represent various simple constraints:
 *
 *  .. code-block:: javascript
 *
 *    js> var namedFoo = new FILTER.Filter("name = 'foo'");
 *    js> var oneThing = new FILTER.Filter("thing = 1");
 *    js> var few = new FILTER.Filter("count < 4");
 *    js> var many = new FILTER.Filter("count > 36");
 *    js> var teens = new FILTER.Filter("age BETWEEN 13 AND 19");
 *
 *  Examples of filters representing spatial constraints:
 *
 *  .. code-block:: javascript
 *
 *    js> var box = new FILTER.Filter("BBOX(the_geom, -10, -10, 10, 10)");
 *    js> var close = new FILTER.Filter("DWITHIN(the_geom, POINT(1 0), 3, kilometers)");
 *    js> var has = new FILTER.Filter("CONTAINS(the_geom, POINT(1 0))");
 *    js> var hit = new FILTER.Filter("INTERSECTS(the_geom, LINESTRING(0 0, 1 1))");
 */

// register a filter factory for the module
FILTER_UTIL.register(new Factory(Filter, {
  handles: function(config) {
    return true;
  }
}));
