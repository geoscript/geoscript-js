var UTIL = require("../util");

/** api: (define)
 *  module = style
 *  class = Brush
 */

var Brush = UTIL.extend(Object, {
    
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
    }

});

exports.Brush = Brush;
