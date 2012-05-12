var extend = require("./util").extend;

/** api: (define)
 *  module = object
 *  class = GeoObject
 */
exports.GeoObject = extend(Object, {

    constructor: function GeoObject() {},
    
    /** private: property[config]
     *  ``Object``
     */
    get config() {
        return {};
    },
    
    /** api: property[json]
     *  ``String``
     *  The JSON representation of the object.
     */
    get json() {
        return JSON.stringify(this.config);
    },

    /** private: method[toFullString]
     *  :returns: ``String``
     *  
     *  Returns a short string representation of the object.
     */
    toFullString: function() {
        return "";
    },
    
    /** private: method[toString]
     *  :arg draw: ``Boolean`` Try drawing the geometry.
     *  :returns: ``String``
     *  
     *  Returns a string representation of the object.
     */
    toString: function(draw) {
        var str = this.toFullString();
        if (str && str.length > 60) {
            str = str.substring(0, 60) + "...";
        }
        if (draw !== false) {
            try {
                require("./viewer").drawIfBound(this);
            } catch (err) {
                // pass
            }
        }
        return "<" + this.constructor.name + (str ? " " + str : "") + ">";
    }
    
});
