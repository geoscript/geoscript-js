var UTIL = require("../util");
var STYLE_UTIL = require("./util");
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

    /** api: method[where]
     *  :arg filter: :class:`filter.Filter` or ``String`` A filter or CQL string that
     *      limits where this symbolizer applies.
     *  :returns: :class:`Symbolizer` This symbolizer.
     */
    where: function(filter) {
        this.filter = filter;
        return this;
    },
    
    /** api: property[filter]
     *  :class:`filter.Filter`
     *  Optional filter that determines where this symbolizer applies.
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
     *  :returns: :class:`Symbolizer` This symbolizer.
     */
    range: function(config) {
        this.minScaleDenominator = config.min;
        this.maxScaleDenominator = config.max;
        return this;
    },
    
    /** api: method[and]
     *  :arg symbolizer: :class:`Symbolizer`
     *  :returns: :class:`style.Style`
     *
     *  Generate a composite style from this symbolizer and the provided
     *  symbolizer.
     */
    and: function(symbolizer) {
        var Style = require("./style").Style;
        return new Style({parts: [this, symbolizer]});
    },

    get _symbolizer() {
        throw new Error("Subclasses must implement a _symbolizer getter.");
    },

    /** private: property[_rule]
     *  ``org.geotools.styling.Rule``
     *  This symbolizer represented as a rule.
     */
    get _rule() {
        var _rule = STYLE_UTIL._builder.createRule([this._symbolizer]);
        if (this.filter) {
            _rule.setFilter(this.filter._filter);
        }
        if (this.minScaleDenominator) {
            _rule.setMinScaleDenominator(this.minScaleDenominator);
        }
        if (this.maxScaleDenominator) {
            _rule.setMaxScaleDenominator(this.maxScaleDenominator);
        }
        return _rule;
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
