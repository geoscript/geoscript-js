var jts = Packages.com.vividsolutions.jts;

/** api: (geom.Geometry) */

/** api: module = geom */

/** api: constructor
 *  .. class:: Geometry()
 *
 *      A Geometry instance should not be created directly.  
 *      Create an instance of a Geometry subclass instead.
 */
var Geometry = function() {
};
Geometry.prototype = {

    /** api: property[coordinates]
     *  ``Array``
     *  The geometry's coordinates array.
     */
    coordinates: undefined,

    /** private: property[_geometry]
     *  ``jts.geom.Geometry``
     */
    _geometry: undefined,

    /** private: property[_factory]
     *  ``jts.geom.GeometryFactory``
     *  A jts geometry factory.
     */
    _factory: new jts.geom.GeometryFactory()
    
};

exports.Geometry = Geometry;
