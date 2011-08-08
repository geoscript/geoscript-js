var UTIL = require("../util");
var Brush = require("./brush").Brush;
var Expression = require("../filter").Expression;

/** api: (define)
 *  module = style
 *  class = Color
 */

/** api: (extends)
 *  style/brush.js
 */
var Shape = exports.Shape = UTIL.extend(Brush, {
    
    /** api: constructor
     *  .. class:: Shape
     *
     *      A brush that renders using a well-known shape.
     */
    constructor: function Shape(config) {
        this.cache = {};
        if (config) {
            if (typeof config === "string") {
                config = {name: config};
            }
        }
        Brush.prototype.constructor.apply(this, arguments);
    },

    /** api: config[name]
     *  ``String``
     *  The shape name.  Acceptable values include "circle", "square",
     *  "triangle", "star", "cross", and "x".  Default is "circle".
     */
    /** api: property[name]
     *  ``String``
     *  The shape name.
     */
    set name(expression) {
        if (typeof expression === "string") {
            expression = Expression.literal(expression);
        } else if (!(expression instanceof Expression)) {
            throw new Error("Shape name must be a string or an expression");
        }
        this.cache.name = expression;
    },
    get name() {
        if (!("name" in this.cache)) {
            this.name = "circle";
        }
        return this.cache.name;
    },
    
    /** api: config[size]
     *  ``Number``
     *  The shape pixel size.  Default is 6.
     */
    /** api: property[size]
     *  ``Number``
     *  The shape pixel size.
     */
    set size(expression) {
        if (typeof expression === "number") {
            expression = Expression.literal(expression);
        } else if (!(expression instanceof Expression)) {
            throw new Error("Shape size must be a number or an expression");
        }
        this.cache.size = expression;
    },
    get size() {
        if (!("size" in this.cache)) {
            this.size = 6;
        }
        return this.cache.size;
    },

    get config() {
        return {
            type: "Shape",
            name: this.name.config,
            size: this.size.config
        };
    }

});

