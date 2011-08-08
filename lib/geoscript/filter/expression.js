var UTIL = require("../util");

var CQL = Packages.org.geotools.filter.text.cql2.CQL;
var ECQL = Packages.org.geotools.filter.text.ecql.ECQL;


/** api: (define)
 *  module = filter
 *  class = Expression
 */

var Expression = exports.Expression = UTIL.extend(Object, {
    
    /** api: constructor
     *  .. class:: Expression
     *
     *      Base expression class for generating style values from features.
     */
    constructor: function Expression(config) {
        if (config) {
            if (typeof config == "string" || typeof config == "number") {
                config = {text: config};
            }
            this.text = config.text;
        }
    },
    
    set text(val) {
        var _expression;
        try {
            _expression = ECQL.toExpression(val);
        } catch (err) {
            try {
                _expression = CQL.toExpression(val);
            } catch (err2) {
                throw new Error("Unable to parse expression: " + err.message);
            }
        }
        this._expression = _expression;
    },
    get text() {
        var text;
        if (this._expression instanceof Packages.org.geotools.filter.LiteralExpressionImpl) {
            text = this._expression.getLiteral();
            if ((text instanceof java.lang.String) || typeof text === "string") {
                text = "'" + String(text) + "'";
            } else {
                text = String(text);
            }
        } else {
            text = String(this._expression.toString());
        }
        return text;
    },
    
    get config() {
        return {
            type: "Expression",
            text: this.text
        };
    },

    /** api: property[json]
     *  ``String``
     *  The JSON representation of this schema.
     */
    get json() {
        return JSON.stringify(this.config);
    },

    toFullString: function() {
        return this.text;
    }

});

Expression.literal = function(value) {
    if (typeof value === "string") {
        value = "'" + value + "'";
    }
    return new Expression({text: value});
};
