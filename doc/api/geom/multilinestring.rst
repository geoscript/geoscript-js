
.. currentmodule:: geom




:class:`geom.MultiLineString`
================================================================================

.. class:: MultiLineString

    :arg coords: ``Array`` Coordinates array.

    Create a new multi-linestring geometry.  The items in the coords array
    may be linestring coordinates or :class:`LineString` objects.





Example Use
-----------

Sample code to new multi-linestring:

.. code-block:: javascript

    js> var l1 = new GEOM.LineString([[-180, -90], [0, 0], [180, 90]]);
    js> var l2 = new GEOM.LineString([[180, -90], [0, 0], [-180, 90]]);
    js> var ml = new GEOM.MultiLineString([l1, l2]);

Alternate method to create the same geometry as above:

.. code-block:: javascript

    js> var ml = new GEOM.MultiLineString([
      >     [[-180, -90], [0, 0], [180, 90]],
      >     [[180, -90], [0, 0], [-180, 90]]
      > ]);

    




Properties
----------


.. attribute:: MultiLineString.area

    ``Number``
    The geometry area.

.. attribute:: MultiLineString.bounds

    :class:`geom.Bounds`
    The bounds defined by minimum and maximum x and y values in this geometry.

.. attribute:: MultiLineString.centroid

    ``geom.Point``
    The centroid of this geometry.

.. attribute:: MultiLineString.components

    ``Array``
    The component :class:`geom.Geometry` objects that make up this collection.

.. attribute:: MultiLineString.coordinates

    :returns: ``Array`` An array of coordinates.
    
    An array of coordinates for the geometry.

.. attribute:: MultiLineString.dimension

    ``Number``
    The dimension of this geometry.

.. attribute:: MultiLineString.empty

    ``Boolean``
    The geometry is empty.

.. attribute:: MultiLineString.endPoints

    ``Array``
    List all start and end points for all components.

.. attribute:: MultiLineString.json

    ``String``
    The JSON representation of the geometry (see http://geojson.org).

.. attribute:: MultiLineString.length

    ``Number``
    The geometry length.

.. attribute:: MultiLineString.prepared

    ``Boolean``
    This is a prepared geometry.  See :meth:`prepare`.

.. attribute:: MultiLineString.projection

    :class:`proj.Projection`
    Optional projection for the geometry.  If this is set, it is assumed
    that the geometry coordinates are in the corresponding coordinate
    reference system.  Use the :meth:`transform` method to transform a
    geometry from one coordinate reference system to another.

.. attribute:: MultiLineString.rectangle

    ``Boolean``
    This geometry is a rectangle.

.. attribute:: MultiLineString.simple

    ``Boolean``
    The geometry is simple.

.. attribute:: MultiLineString.valid

    ``Boolean``
    The geometry is valid.




Methods
-------


.. method:: MultiLineString.buffer

    :arg dist: ``Number`` Width of buffer.  May be positive, negative, or
        zero.
    :arg options: ``Object`` Options for the buffer operation.
    
    Options:
    * ``segs`` ``Number`` Integer number of quadrant segments for circular
        arcs.  Default is 8.
    * ``caps`` ``Number`` One of :data:`BUFFER_CAP_ROUND`,
        :data:`BUFFER_CAP_BUTT`, or :data:`BUFFER_CAP_SQUARE`.  Default
        is :data:`BUFFER_CAP_ROUND`.
    * ``single`` ``Boolean`` Create a single-sided buffer.  Default is
        ``false``.
    
    :returns: :class:`geom.Geometry`
    
    Construct a geometry that buffers this geometry by the given width.

.. method:: MultiLineString.clone

    :returns: :class:`geom.Geometry`
    
    Creates a complete copy of this geometry.

.. method:: MultiLineString.contains

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry contains the other geometry (without boundaries
    touching).

.. method:: MultiLineString.convexHull

    :returns: :class:`geom.Geometry`
    
    Computes the smallest convex :class:`Polygon` that contains this
    geometry.

.. method:: MultiLineString.coveredBy

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is covered by other geometry.

.. method:: MultiLineString.covers

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry covers the other geometry.

.. method:: MultiLineString.crosses

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry crosses the other geometry.

.. method:: MultiLineString.difference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry made up of all the points in this geometry that are
    not in the other geometry.

.. method:: MultiLineString.disjoint

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is disjoint to the other geometry.

.. method:: MultiLineString.distance

    :arg geometry: :class:`geom.Geometry`
    :returns: ``Number``
    
    Returns the minimum distance between this and the supplied geometry.

.. method:: MultiLineString.equals

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Geometries are considered equal if they share at least one point in
    common and if no point of either geometry lies in the exterior of the
    other.

.. method:: MultiLineString.equalsExact

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is exactly equal to the other geometry.

.. method:: MultiLineString.getBoundary

    :returns: :class:`geom.Geometry`
    
    Returns the boundary, or an empty geometry of appropriate dimension if
    this geometry is empty.

.. method:: MultiLineString.getEnvelope

    :returns: :class:`geom.Geometry`
    
    Returns this geometry's bounding box.

.. method:: MultiLineString.intersection

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points shared by this geometry
    and the other.

.. method:: MultiLineString.intersects

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry intersects the other geometry.

.. method:: MultiLineString.overlaps

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry overlaps the other geometry.

.. method:: MultiLineString.prepare

    :returns: :class:`geom.Geometry`
    
    Prepare a geometry for multiple spatial operations.  Preparing optimizes
    the geometry for multiple calls to :meth:`contains`, :meth:`coveredBy`,
    :meth:`covers`, :meth:`crosses`, :meth:`disjoint`, :meth:`intersects`,
    :meth:`overlaps`, :meth:`touches`, and :meth:`within`.

.. method:: MultiLineString.simplify

    :arg tolerance: ``Number`` The distance tolerance for the simplification.
        All vertices in the simplified geometry will be within this distance
        of the original geometry. The tolerance value must be non-negative.
    :returns: :class:`geom.Geometry`
    
    Simplify the geometry using the standard Douglas-Peucker algorithm.
    Returns a new geometry.

.. method:: MultiLineString.symDifference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points in this geometry but not
    in the other plus all the points in the other but not in this geometry.

.. method:: MultiLineString.touches

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry `only` touches the other geometry.

.. method:: MultiLineString.transform

    :arg to: :class:`proj.Projection`
    :returns: :class:`geom.Geometry`
    
    Transform coordinates of this geometry to the given projection.  The
    :attr:`projection` of this geometry must be set before calling this
    method.  Returns a new geometry.

.. method:: MultiLineString.within

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is within the other geometry.  This is the
    inverse of :meth:`contains`.







