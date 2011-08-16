var UTIL = require("../util");
var Symbolizer = require("./symbolizer").Symbolizer;

/** api: (define)
 *  module = style
 *  class = Composite
 */

/** api: (extends)
 *  style/symbolizer.js
 */
var Composite = UTIL.extend(Symbolizer, {
    
    /** api: constructor
     *  .. class:: Composite
     *
     *      Instances of the symbolizer base class are not created directly.  
     *      See the constructor details for one of the symbolizer subclasses.
     */
    constructor: function Composite(parts) {
        this.parts = parts;
    },
    
    /** api: method[and]
     *  :arg symbolizer: ``Symbolizer``
     *  :returns: ``style.Composite``
     *
     *  Generate a composite symbolizer from this symbolizer and the provided
     *  symbolizer.
     */
    and: function(symbolizer) {
        this.parts.push(symbolizer);
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
        var symbolizer;
        for (var i=0, ii=this.parts.length; i<ii; ++i) {
            symbolizer = this.parts[i];
            if (symbolizer.filter) {
                symbolizer.filter = filter.and(symbolizer.filter);
            } else {
                symbolizer.filter = filter;
            }
        }
    },
    
    /** api: property[minScaleDenominator]
     *  ``Number``
     *  Optional minimum scale denominator at which this symbolizer applies.
     */
    set minScaleDenominator(min) {
        for (var i=0, ii=this.parts.length; i<ii; ++i) {
            this.parts[i].minScaleDenominator = min;
        }
    },

    /** api: property[maxScaleDenominator]
     *  ``Number``
     *  Optional maximum scale denominator at which this symbolizer applies.
     */
    set maxScaleDenominator(min) {
        for (var i=0, ii=this.parts.length; i<ii; ++i) {
            this.parts[i].maxScaleDenominator = min;
        }
    },
    
    
    /** api: property[zIndex]
     *  ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
     *  with higher zIndex values will be drawn over symbolizers with lower
     *  values.  By default, symbolizers have a zIndex of ``0``.
     */
    set zIndex(index) {
        for (var i=0, ii=this.parts.length; i<ii; ++i) {
            this.parts[i].zIndex = index;
        }
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

exports.Composite = Composite;
