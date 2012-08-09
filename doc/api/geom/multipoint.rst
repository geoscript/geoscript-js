
.. currentmodule:: geom




:class:`geom.MultiPoint`
================================================================================

.. class:: MultiPoint

    :arg coords: ``Array`` Coordinates array.

    Create a new multi-point geometry.  The items in the coords array
    may be point coordinates or :class:`Point` objects.





Example Use
-----------

Sample code to new multi-point:

.. code-block:: javascript

    js> var p1 = new GEOM.Point([-180, 90]);
    js> var p2 = new GEOM.Point([-45, 45]);
    js> var mp = new GEOM.MultiPoint([p1, p2]);

Alternate method to create the same geometry as above:

.. code-block:: javascript

    js> var mp = new GEOM.MultiPoint([
      >     [-180, 90], [-45, 45]
      > ]);

    




Properties
----------


.. attribute:: MultiPoint.area

    ``Number``
    The geometry area.

.. attribute:: MultiPoint.bounds

    :class:`geom.Bounds`
    The bounds defined by minimum and maximum x and y values in this geometry.

.. attribute:: MultiPoint.centroid

    ``geom.Point``
    The centroid of this geometry.

.. attribute:: MultiPoint.components

    ``Array``
    The component :class:`geom.Geometry` objects that make up this collection.

.. attribute:: MultiPoint.coordinates

    :returns: ``Array`` An array of coordinates.
    
    An array of coordinates for the geometry.

.. attribute:: MultiPoint.dimension

    ``Number``
    The dimension of this geometry.

.. attribute:: MultiPoint.empty

    ``Boolean``
    The geometry is empty.

.. attribute:: MultiPoint.json

    ``String``
    The JSON representation of the geometry (see http://geojson.org).

.. attribute:: MultiPoint.length

    ``Number``
    The geometry length.

.. attribute:: MultiPoint.prepared

    ``Boolean``
    This is a prepared geometry.  See :meth:`prepare`.

.. attribute:: MultiPoint.projection

    :class:`proj.Projection`
    Optional projection for the geometry.  If this is set, it is assumed
    that the geometry coordinates are in the corresponding coordinate
    reference system.  Use the :meth:`transform` method to transform a
    geometry from one coordinate reference system to another.

.. attribute:: MultiPoint.rectangle

    ``Boolean``
    This geometry is a rectangle.

.. attribute:: MultiPoint.simple

    ``Boolean``
    The geometry is simple.

.. attribute:: MultiPoint.valid

    ``Boolean``
    The geometry is valid.




Methods
-------


.. method:: MultiPoint.buffer

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

.. method:: MultiPoint.clone

    :returns: :class:`geom.Geometry`
    
    Creates a complete copy of this geometry.

.. method:: MultiPoint.contains

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry contains the other geometry (without boundaries
    touching).

.. method:: MultiPoint.convexHull

    :returns: :class:`geom.Geometry`
    
    Computes the smallest convex :class:`Polygon` that contains this
    geometry.

.. method:: MultiPoint.coveredBy

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is covered by other geometry.

.. method:: MultiPoint.covers

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry covers the other geometry.

.. method:: MultiPoint.crosses

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry crosses the other geometry.

.. method:: MultiPoint.difference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry made up of all the points in this geometry that are
    not in the other geometry.

.. method:: MultiPoint.disjoint

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is disjoint to the other geometry.

.. method:: MultiPoint.distance

    :arg geometry: :class:`geom.Geometry`
    :returns: ``Number``
    
    Returns the minimum distance between this and the supplied geometry.

.. method:: MultiPoint.equals

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Geometries are considered equal if they share at least one point in
    common and if no point of either geometry lies in the exterior of the
    other.

.. method:: MultiPoint.equalsExact

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is exactly equal to the other geometry.

.. method:: MultiPoint.getBoundary

    :returns: :class:`geom.Geometry`
    
    Returns the boundary, or an empty geometry of appropriate dimension if
    this geometry is empty.

.. method:: MultiPoint.getEnvelope

    :returns: :class:`geom.Geometry`
    
    Returns this geometry's bounding box.

.. method:: MultiPoint.intersection

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points shared by this geometry
    and the other.

.. method:: MultiPoint.intersects

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry intersects the other geometry.

.. method:: MultiPoint.overlaps

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry overlaps the other geometry.

.. method:: MultiPoint.prepare

    :returns: :class:`geom.Geometry`
    
    Prepare a geometry for multiple spatial operations.  Preparing optimizes
    the geometry for multiple calls to :meth:`contains`, :meth:`coveredBy`,
    :meth:`covers`, :meth:`crosses`, :meth:`disjoint`, :meth:`intersects`,
    :meth:`overlaps`, :meth:`touches`, and :meth:`within`.

.. method:: MultiPoint.simplify

    :arg tolerance: ``Number`` The distance tolerance for the simplification.
        All vertices in the simplified geometry will be within this distance
        of the original geometry. The tolerance value must be non-negative.
    :returns: :class:`geom.Geometry`
    
    Simplify the geometry using the standard Douglas-Peucker algorithm.
    Returns a new geometry.

.. method:: MultiPoint.symDifference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points in this geometry but not
    in the other plus all the points in the other but not in this geometry.

.. method:: MultiPoint.touches

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry `only` touches the other geometry.

.. method:: MultiPoint.transform

    :arg to: :class:`proj.Projection`
    :returns: :class:`geom.Geometry`
    
    Transform coordinates of this geometry to the given projection.  The
    :attr:`projection` of this geometry must be set before calling this
    method.  Returns a new geometry.

.. method:: MultiPoint.within

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is within the other geometry.  This is the
    inverse of :meth:`contains`.







