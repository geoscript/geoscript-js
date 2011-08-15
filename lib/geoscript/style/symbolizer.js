var UTIL = require("../util");
var GeoObject = require("../object").GeoObject;
var Filter = require("../filter").Filter;
var Brush = require("./brush").Brush;
var Expression = require("../filter").Expression;

/** api: (define)
 *  module = style
 *  class = Symbolizer
 */

var Symbolizer = exports.Symbolizer = UTIL.extend(GeoObject, {
    
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
    constructor: function Symbolizer(config) {
        this.cache = {};
        if (config) {
            UTIL.apply(this, config);
        }
    },

    /** api: property[opacity]
     *  ``Number``
     *  The opacity value (0 - 1).  Default is ``1``.
     */
    set opacity(expression) {
        if (typeof expression === "number") {
            if (expression < 0 || expression > 1) {
                throw new Error("Opacity must be a number between 0 and 1 (inclusive)");
            }
            expression = Expression.literal(expression);
        } else if (!(expression instanceof Expression)) {
            throw new Error("Color opacity must be a number or an expression");
        }
        this.cache.opacity = expression;
    },
    get opacity() {
        if (!("opacity" in this.cache)) {
            this.opacity = 1;
        }
        return this.cache.opacity;
    },

    /** api: property[brush]
     *  ``Brush``
     */
    set brush(brush) {
        if (!(brush instanceof Brush)) {
            brush = new Brush(brush);
        }
        this.cache.brush = brush;
    },
    get brush() {
        return this.cache.brush;
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
