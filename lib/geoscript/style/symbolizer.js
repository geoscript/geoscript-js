var UTIL = require("../util");
var Filter = require("../filter").Filter;

/** api: (define)
 *  module = style
 *  class = Symbolizer
 */

var Symbolizer = UTIL.extend(Object, {
    
    /** api: config[zIndex]
     *  ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
     *  with higher zIndex values will be drawn over symbolizers with lower
     *  values.  By default, symbolizers have a zIndex of ``0``.
     */
    zIndex: 0,

    /** api: constructor
     *  .. class:: Symbolizer
     *
     *      Instances of the symbolizer base class are not created directly.  
     *      See the constructor details for one of the symbolizer subclasses.
     */
    constructor: function Symbolizer() {
        this.cache = {};
    },

    /** api: method[clone]
     *  :arg config: ``Object`` Optional configuration object.
     *  :returns: :class:`style.Symbolizer` A symbolizer of the same type as 
     *      this one.
     *
     *  Create a copy of this symbolizer.  The optional ``config`` argument
     *  can be used to override any of this symbolizer's properties for the
     *  clone.
     */
    clone: function(config) {
        config = UTIL.applyIf(config, this.config);
        return new STYLE_UTIL.create(config);
    },
    
    /** api: method[where]
     *  :arg filter: ``filter.Filter or String`` A filter or CQL string that
     *      limits where this symbolizer applies.
     *  :returns: ``Symbolizer`` This symbolizer.
     */
    where: function(filter) {
        this.filter = filter;
        return this;
    },
    
    /** api: property[filter]
     *  ``filter.Filter``
     *  Filter that determines where this symbolizer applies.
     */
    set filter(filter) {
        if (typeof filter === "string") {
            filter = new Filter(filter);
        }
        this.cache.filter = filter;
    },
    get filter() {
        return this.cache.filter;
    },
    
    /** api: method[range]
     *  :arg config: ``Object`` An object with optional ``min`` and ``max`` 
     *      properties specifying the minimum and maximum scale denominators
     *      for applying this symbolizer.
     *  :returns: ``Symbolizer`` This symbolizer.
     */
    range: function(config) {
        this.minScaleDenominator = config.min;
        this.maxScaleDenominator = config.max;
        return this;
    },
    
    /** api: method[and]
     *  :arg symbolizer: ``Symbolizer``
     *  :returns: ``style.Composite``
     *
     *  Generate a composite symbolizer from this symbolizer and the provided
     *  symbolizer.
     */
    and: function(symbolizer) {
        var Composite = require("./composite").Composite;
        return new Composite([this, symbolizer]);
    },

    /** private: property[config]
     */
    get config() {
        return {};
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of this symbolizer.
     */
    get json() {
        return JSON.stringify(this.config);
    },

    /** private: method[toFullString]
     */
    toFullString: function() {
        var items = [];
        var config = this.config;
        var val;
        for (var key in config) {
            if (key !== "type") {
                val = config[key];
                if (typeof val === "string") {
                    val = '"' + val + '"';
                }
                items.push(key + ": " + val);
            }
        }
        return items.join(", ");
    }

});

exports.Symbolizer = Symbolizer;
