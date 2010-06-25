var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Factory = require("../factory").Factory;
var Filter = require("../filter").Filter
var Symbolizer = require("./symbolizer").Symbolizer;

/** api: (define)
 *  module = style
 *  class = Rule
 */

var Rule = UTIL.extend(Object, {
    
    /** private: property[defaultSymbolizerType]
     *  ``String``
     */
    defaultSymbolizerType: null,

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
    
    /** api: method[clone]
     *
     */
    clone: function(config) {
        config = UTIL.applyIf(config, this.config);
        delete config.type;
        return new Rule(config);
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
        if (filter) {
            if (!(filter instanceof Filter)) {
                filter = new Filter(filter);
            }
            this.cache.filter = filter;
        }
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
        var item;
        for (var i=0, ii=list.length; i<ii; ++i) {
            item = list[i];
            if (!(item instanceof Symbolizer)) {
                if (!item.defaultSymbolizerType) {
                    item.defaultSymbolizerType = this.defaultSymbolizerType;
                }
                list[i] = STYLE_UTIL.create(item);
            }
        }
        this.cache.symbolizers = list;
    },
    get symbolizers() {
        return this.cache.symbolizers || [];
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
    maxScaleDenominator: null,

    /** private: property[config]
     */
    get config() {
        return {
            minScaleDenominator: this.minScaleDenominator,
            maxScaleDenominator: this.maxScaleDenominator,
            symbolizers: this.symbolizers.map(function(symbolizer) {
                return symbolizer.config;
            }),
            filter: this.filter && this.filter.config
        };
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of this rule.
     */
    get json() {
        return JSON.stringify(this.config);
    },
    
    /** private: property[_rule]
     *  ``org.geotools.styling.Rule``
     *  A flattened representation of the rule - ignoring zIndex.  This should
     *  only be used for rules where all symbolizers have the same zIndex.
     */
    get _rule() {
        var _symbolizers = this.symbolizers.map(function(symbolizer) {
            return symbolizer._symbolizer;
        });
        var _rule = STYLE_UTIL._builder.createRule(_symbolizers);
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

    /** private: method[toFullString]
     */
    toFullString: function() {
        return "";
    }
    
});

exports.Rule = Rule;

// register a rule factory for the module
STYLE_UTIL.register(new Factory(Rule, {
    handles: function(config) {
        return (
            "filter" in config ||
            "symbolizers" in config ||
            "minScaleDenominator" in config ||
            "maxScaleDenominator" in config
        );
    }
}));
