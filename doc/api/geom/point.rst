
.. currentmodule:: geom




:class:`geom.Point`
================================================================================

.. class:: Point

    :arg coords: ``Array`` Coordinates array.

    Create a new point.





Example Use
-----------

Sample code to create a new point:

.. code-block:: javascript

    js> var point = new GEOM.Point([-180, 90]);
    js> point.x;
    -180
    js> point.y;
    90

    




Properties
----------


.. attribute:: Point.area

    ``Number``
    The geometry area.

.. attribute:: Point.bounds

    :class:`geom.Bounds`
    The bounds defined by minimum and maximum x and y values in this geometry.

.. attribute:: Point.centroid

    ``geom.Point``
    The centroid of this geometry.

.. attribute:: Point.coordinates

    ``Array``
    The geometry's coordinates array.

.. attribute:: Point.dimension

    ``Number``
    The dimension of this geometry.

.. attribute:: Point.empty

    ``Boolean``
    The geometry is empty.

.. attribute:: Point.json

    ``String``
    The JSON representation of the geometry (see http://geojson.org).

.. attribute:: Point.length

    ``Number``
    The geometry length.

.. attribute:: Point.prepared

    ``Boolean``
    This is a prepared geometry.  See :meth:`prepare`.

.. attribute:: Point.projection

    :class:`proj.Projection`
    Optional projection for the geometry.  If this is set, it is assumed
    that the geometry coordinates are in the corresponding coordinate
    reference system.  Use the :meth:`transform` method to transform a
    geometry from one coordinate reference system to another.

.. attribute:: Point.rectangle

    ``Boolean``
    This geometry is a rectangle.

.. attribute:: Point.simple

    ``Boolean``
    The geometry is simple.

.. attribute:: Point.valid

    ``Boolean``
    The geometry is valid.

.. attribute:: Point.x

    ``Number``
    The first coordinate value.

.. attribute:: Point.y

    ``Number``
    The second coordinate value.

.. attribute:: Point.z

    ``Number``
    The third coordinate value (or NaN if none).




Methods
-------


.. method:: Point.buffer

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

.. method:: Point.clone

    :returns: :class:`geom.Geometry`
    
    Creates a complete copy of this geometry.

.. method:: Point.contains

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry contains the other geometry (without boundaries
    touching).

.. method:: Point.convexHull

    :returns: :class:`geom.Geometry`
    
    Computes the smallest convex :class:`Polygon` that contains this
    geometry.

.. method:: Point.coveredBy

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is covered by other geometry.

.. method:: Point.covers

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry covers the other geometry.

.. method:: Point.crosses

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry crosses the other geometry.

.. method:: Point.difference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry made up of all the points in this geometry that are
    not in the other geometry.

.. method:: Point.disjoint

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is disjoint to the other geometry.

.. method:: Point.distance

    :arg geometry: :class:`geom.Geometry`
    :returns: ``Number``
    
    Returns the minimum distance between this and the supplied geometry.

.. method:: Point.equals

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Geometries are considered equal if they share at least one point in
    common and if no point of either geometry lies in the exterior of the
    other.

.. method:: Point.equalsExact

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is exactly equal to the other geometry.

.. method:: Point.getBoundary

    :returns: :class:`geom.Geometry`
    
    Returns the boundary, or an empty geometry of appropriate dimension if
    this geometry is empty.

.. method:: Point.getEnvelope

    :returns: :class:`geom.Geometry`
    
    Returns this geometry's bounding box.

.. method:: Point.intersection

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points shared by this geometry
    and the other.

.. method:: Point.intersects

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry intersects the other geometry.

.. method:: Point.overlaps

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry overlaps the other geometry.

.. method:: Point.prepare

    :returns: :class:`geom.Geometry`
    
    Prepare a geometry for multiple spatial operations.  Preparing optimizes
    the geometry for multiple calls to :meth:`contains`, :meth:`coveredBy`,
    :meth:`covers`, :meth:`crosses`, :meth:`disjoint`, :meth:`intersects`,
    :meth:`overlaps`, :meth:`touches`, and :meth:`within`.

.. method:: Point.simplify

    :arg tolerance: ``Number`` The distance tolerance for the simplification.
        All vertices in the simplified geometry will be within this distance
        of the original geometry. The tolerance value must be non-negative.
    :returns: :class:`geom.Geometry`
    
    Simplify the geometry using the standard Douglas-Peucker algorithm.
    Returns a new geometry.

.. method:: Point.symDifference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points in this geometry but not
    in the other plus all the points in the other but not in this geometry.

.. method:: Point.touches

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry `only` touches the other geometry.

.. method:: Point.transform

    :arg to: :class:`proj.Projection`
    :returns: :class:`geom.Geometry`
    
    Transform coordinates of this geometry to the given projection.  The
    :attr:`projection` of this geometry must be set before calling this
    method.  Returns a new geometry.

.. method:: Point.within

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is within the other geometry.  This is the
    inverse of :meth:`contains`.







