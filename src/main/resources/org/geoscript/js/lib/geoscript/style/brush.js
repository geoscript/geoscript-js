var UTIL = require("../util");
var GeoObject = require("../object").GeoObject;

/** api: (define)
 *  module = style
 *  class = Brush
 */
var Brush = UTIL.extend(GeoObject, {
    
    /** api: constructor
     *  .. class:: Brush
     *
     *      Instances of the brush base class are not created directly.  
     *      See the constructor details for one of the brush subclasses.
     */
    constructor: function Brush(config) {
        if (config) {
            UTIL.apply(this, config);
        }
    },
    
    get config() {
        return {};
    },

    toFullString: function() {
        var parts = [];
        var config = this.config;
        for (var property in config) {
            if (property !== "type") {
                parts.push(property + ": " + this[property].text);
            }
        }
        return parts.join(", ");
    }

});

exports.Brush = Brush;
