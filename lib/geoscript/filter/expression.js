var UTIL = require("../util");
var GeoObject = require("../object").GeoObject;

var CQL = Packages.org.geotools.filter.text.cql2.CQL;
var ECQL = Packages.org.geotools.filter.text.ecql.ECQL;


/** api: (define)
 *  module = filter
 *  class = Expression
 */
var Expression = exports.Expression = UTIL.extend(GeoObject, {
    
    /** api: constructor
     *  .. class:: Expression
     *
     *      :arg text: ``String`` The expression text.
     *
     *      Expression class for generating values from features.
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
        if (this._expression) {
            if (this.literal) {
                text = this._expression.getLiteral();
                if ((text instanceof java.lang.String) || typeof text === "string") {
                    text = "'" + String(text) + "'";
                } else {
                    text = String(text);
                }
            } else {
                text = String(this._expression.toString());
            }
        }
        return text;
    },
    
    /** api: property[literal]
     *  ``Boolean``
     *  This expression is just a literal value.
     */
    get literal() {
        return Boolean(this._expression instanceof Packages.org.geotools.filter.LiteralExpressionImpl);
    },
    
    get config() {
        return {
            type: "Expression",
            text: this.text
        };
    },

    toFullString: function() {
        return this.text;
    }

});

Expression.from_ = function(_expression) {
    var expression = new Expression();
    expression._expression = _expression;
    return expression;
}

Expression.literal = function(value) {
    if (typeof value === "string") {
        value = "'" + value + "'";
    }
    return new Expression({text: value});
};
