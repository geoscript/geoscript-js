/** api: module = proj */

/** api: synopsis
 *  Projection related functionality.
 */

/** api: summary
 *  The :mod:`proj` module exports a Projection constructor and methods for
 *  transforming geometries between coordinate reference systems.
 *
 *  .. code-block:: javascript
 *  
 *      js> var PROJ = require("geoscript/proj");
 */

/** api: classes[] = projection */
var Projection = require("./proj/projection").Projection;

/** api: method[transform]
 *  :arg geometry: :class:`geom.Geometry`
 *  :arg from: :class:`proj.Projection` or ``String``
 *  :arg to: :class:`proj.Projection` or ``String``
 *  :returns: :class:`geom.Geometry`
 *  
 *  Tranform a geometry from one coordinate reference system to another.
 *  Returns a new geometry.  The ``from`` and ``to`` arguments can be
 *  :class:`proj.Projection` instances or the string values used to construct
 *  them.
 *
 *  Example use:
 *
 *  .. code-block:: javascript
 *  
 *      js> var GEOM = require("geoscript/geom");
 *      js> var p1 = new GEOM.Point([-111.0, 45.7]);
 *      js> var p2 = PROJ.transform(p1, "epsg:4326", "epsg:26912");
 *      js> Math.floor(p2.x)
 *      499999
 *      js> Math.floor(p2.y)
 *      5060716
 */
var transform = function(geometry, from, to) {
    if (!(from instanceof Projection)) {
        from = new Projection(from);
    }
    geometry.projection = from;
    return geometry.transform(to);
};

exports.transform = transform;
exports.Projection = Projection;

