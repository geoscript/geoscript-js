var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Factory = require("../factory").Factory;
var Rule = require("./rule").Rule;
var Symbolizer = require("./symbolizer").Symbolizer;

var geotools = Packages.org.geotools;

/** api: (define)
 *  module = style
 *  class = Style
 */

var Style = UTIL.extend(Object, {
    
    /** private: property[defaultSymbolizerType]
     *  ``String``
     */
    defaultSymbolizerType: null,
    
    /** api: constructor
     *  .. class:: Style
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a rule for rendering features.
     */
    constructor: function Style(config) {
        this.cache = {};
        if (!("rules" in config)) {
            // single rule, single symbolizer, or array of either
            if (!(config instanceof Array)) {
                config = [config];
            }
            var items = config.map(function(item) {
                var instance;
                if (!item.defaultSymbolizerType) {
                    item.defaultSymbolizerType = config.defaultSymbolizerType;
                }
                try {
                    instance = STYLE_UTIL.create(item);
                } catch (err) {
                    instance = item;
                }
                return instance;
            });
            if (items[0] instanceof Rule) {
                config = {
                    rules: items
                };
            } else if (items[0] instanceof Symbolizer) {
                config = {
                    rules: [{
                        symbolizers: items
                    }]
                };
            } else {
                throw new Error("Invalid Style config.");
            }
        }
        UTIL.apply(this, config);
    },
    
    /** api: config[rules]
     *  ``Array`` List of :class:`style.Rule` objects for the style.
     */
    /** api: property[symbolizers]
     *  ``Array`` List of :class:`style.Rule` objects for the style.
     */
    set rules(list) {
        var item;
        for (var i=0, ii=list.length; i<ii; ++i) {
            item = list[i];
            if (!(item instanceof Rule)) {
                if (!item.defaultSymbolizerType) {
                    item.defaultSymbolizerType = this.defaultSymbolizerType;
                }
                list[i] = new Rule(item);
            }
        }
        this.cache.rules = list;
    },
    get rules() {
        return this.cache.rules || [];
    },
    
    /** private: property[_style]
     *  ``org.geotools.styling.Style``
     */
    get _style() {
        var zIndexes = [];
        var lookup = {};
        this.rules.forEach(function(rule) {
            var symbolizers = rule.symbolizers;
            var ruleMap = {};
            rule.symbolizers.forEach(function(symbolizer) {
                var z = symbolizer.zIndex;
                if (!(z in ruleMap)) {
                    ruleMap[z] = rule.clone({symbolizers: []});
                }
                ruleMap[z].symbolizers.push(symbolizer.clone())
            });
            for (var z in ruleMap) {
                if (!(z in lookup)) {
                    zIndexes.push(z);
                    lookup[z] = [];
                }
                lookup[z].push(ruleMap[z]);
            }
        });
        var _featureTypeStyles = new java.util.ArrayList();
        zIndexes.sort().forEach(function(z) {
            var rules = lookup[z];
            var _rules = java.lang.reflect.Array.newInstance(geotools.styling.Rule, rules.length);
            rules.forEach(function(rule, j) {
                // all rules now have symbolizers with one zIndex
                _rules[j] = rule._rule;
            });
            _featureTypeStyles.add(
                STYLE_UTIL._builder.createFeatureTypeStyle("Feature", _rules)
            );
        });
        var _style = STYLE_UTIL._builder.createStyle();
        _style.featureTypeStyles().addAll(_featureTypeStyles);
        return _style;
    },
    
    /** private: method[toFullString]
     */
    toFullString: function() {
        return "";
    }
    
});

exports.Style = Style;

// register a style factory for the module
STYLE_UTIL.register(new Factory(Style, {
    handles: function(config) {
        return ("rules" in config);
    }
}));
