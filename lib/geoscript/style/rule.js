var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Filter = require("../filter").Filter
var Symbolizer = require("./symbolizer").Symbolizer;

/** api: (define)
 *  module = style
 *  class = Rule
 */

var Rule = UTIL.extend(Object, {
    
    /** api: constructor
     *  .. class:: Rule
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a rule for rendering features.
     */
    constructor: function Rule(config) {
        this.cache = {};
        UTIL.apply(this, config);
    },
    
    /** api: config[filter]
     *  :class:`filter.Filter`
     *  Optional filter for the rule.
     */
    /** api: property[filter]
     *  :class:`feature.Filter`
     *  Optional filter for the rule.
     */
    set filter(filter) {
        if (!(filter instanceof Filter)) {
            filter = new Filter(filter);
        }
        this.cache.filter = filter;
    },
    get filter() {
        return this.cache.filter;
    },
    
    /** api: config[symbolizers]
     *  ``Array`` List of :class:`style.Symbolizer` objects for the rule.
     */
    /** api: property[symbolizers]
     *  ``Array`` List of :class:`style.Symbolizer` objects for the rule.
     */
    set symbolizers(list) {
        for (var i=0, ii=list.length; i<ii; ++i) {
            if (!(list[i] instanceof Symbolizer)) {
                list[i] = STYLE_UTIL.create(list[i]);
            }
        }
        this.cache.symbolizers = list;
    },
    get symbolizers() {
        return this.cache.symbolizers;
    },
    
    /** api: config[minScaleDenominator]
     *  ``Number`` Optional minimum scale denominator threshold for the rule.
     */
    /** api: property[minScaleDenominator]
     *  ``Number`` Optional minimum scale denominator threshold for the rule.
     */
    minScaleDenominator: null,

    /** api: config[maxScaleDenominator]
     *  ``Number`` Optional maximum scale denominator threshold for the rule.
     */
    /** api: property[maxScaleDenominator]
     *  ``Number`` Optional maximum scale denominator threshold for the rule.
     */
    maxScaleDenominator: null
    
});

exports.Rule = Rule;
