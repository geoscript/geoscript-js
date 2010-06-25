var UTIL = require("../util");
var STYLE_UTIL = require("./util");
var Rule = require("./rule").Rule;

var geotools = Packages.org.geotools;

/** api: (define)
 *  module = style
 *  class = Style
 */

var Style = UTIL.extend(Object, {
    
    /** api: constructor
     *  .. class:: Style
     *  
     *      :arg config: ``Object`` Configuration object.
     *
     *      Create a rule for rendering features.
     */
    constructor: function Style(config) {
        this.cache = {};
        UTIL.apply(this, config);
    },
    
    /** api: config[rules]
     *  ``Array`` List of :class:`style.Rule` objects for the style.
     */
    /** api: property[symbolizers]
     *  ``Array`` List of :class:`style.Rule` objects for the style.
     */
    set rules(list) {
        for (var i=0, ii=list.length; i<ii; ++i) {
            if (!(list[i] instanceof Rule)) {
                list[i] = new Rule(list[i]);
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
        _style.getFeatureTypeStyles().addAll(_featureTypeStyles);
        return _style;
    },
    
    /** private: method[toFullString]
     */
    toFullString: function() {
        return "";
    }
    
});

exports.Style = Style;
