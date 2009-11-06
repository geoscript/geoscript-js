var Geometry = require("geoscript/geom/geometry").Geometry;
var util = require("geoscript/util");

/** api: (define)
 *  module = geom
 *  class = Collection
 */

/** api: (extends)
 *  geom/geometry.js
 */
var Collection = util.extend(Geometry, {
    
    /** private: property[cache]
     *  ``Object``
     */
    cache: null,
    
    /** private: property[TYPES]
     *  ``Array``
     *  Array of allowed geometry types for the collection.
     */
    TYPES: [function() {
        throw new Error("Collection subclasses must define a TYPES array.");
    }],
    
    /** private: property[_Type]
     *  ``Class``
     *  The jts geometry constructor for this collection.
     */
    _Type: function() {
        throw new Error("Collection subclasses must define a _Type");
    },
    
    /** api: constructor
     *  .. class:: Collection
     *  
     *      :arg coords: ``Array`` Coordinates array.
     *
     *      A collection should not be created directly.  Use one of the 
     *      collection subclasses instead.
     */
    constructor: function Collection(coords) {
        this.cache = {};
        Geometry.prototype.constructor.apply(this, [coords]);
    },
    
    /** private: method[_create]
     *  :arg coords: ``Array`` Array of geometry coordinates.
     */
    _create: function(coords) {
        var item, geometry, components = [], _components = [], coordinates = [];
        var Type = this.TYPES[0];
        for (var i=0, len=coords.length; i<len; ++i) {
            item = coords[i];
            if (item instanceof Geometry) {
                if (this.allowedType(item)) {
                    geometry = item;
                } else {
                    throw new Error("Geometry type not allowed in collection: " + item);
                }
            } else {
                geometry = new Type(item);
            }
            components[i] = geometry;
            coordinates[i] = geometry.coordinates;
            _components[i] = geometry._geometry;
        }
        this.cache.components = components;
        return new this._Type(_components, Geometry._factory);
    },
    
    /** private: method[allowedType]
     *  :arg geometry: :class:`geom.Geometry`
     *  :returns: ``Boolean`` The supplied geometry type is allowed.
     *
     *  Determine if the supplied geometry type is allowed in this collection.
     */
    allowedType: function(geometry) {
        var type, allowed = false;
        for(var i=0, len=this.TYPES.length; i<len; ++i) {
            type = this.TYPES[i];
            if (geometry instanceof type) {
                allowed = true;
                break;
            }
        }
        return allowed;
    },

    /** api: property[components]
     *  ``Array`` 
     *  The component :class:`geom.Geometry` objects that make up this collection.
     */
    get components() {
        var num = this._geometry.getNumGeometries();
        var geometries = this.cache.components || [];
        var dirty = false;
        if (geometries.length !== num) {
            geometries = new Array(num);
            dirty = true;
        }
        var geometry;
        for (var i=0; i<num; ++i) {
            geometry = geometries[i];
            if (!(geometry instanceof Geometry)) {
                geometries[i] = Geometry.from_(this._geometry.getGeometryN(i));
                dirty = true;
            }
        }
        if (dirty) {
            this.cache.components = geometries;
        }
        return this.cache.components.slice();
    },
    
    /** api: property[coordinates]
     *  :returns: ``Array`` An array of coordinates.
     *
     *  An array of coordinates for the geometry.
     */
    get coordinates() {
        return this.components.map(function(geometry) {
            return geometry.coordinates;
        });
    }
        
});

exports.Collection = Collection;
