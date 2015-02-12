:class:`geom.Geometry`
======================

.. class:: geom.Geometry

    All geometry subclasses extend from the base Geometry class.  The base
    Geometry constructor is not used, but properties and method documented here
    are shared by all geometry types. 

Common Geometry Properties
--------------------------

.. attribute:: Geometry.area

    ``Number``
    The geometry area.

.. attribute:: Geometry.bounds

    :class:`geom.Bounds`
    The bounds defined by minimum and maximum x and y values in this geometry.

.. attribute:: Geometry.centroid

    ``geom.Point``
    The centroid of this geometry.

.. attribute:: Geometry.coordinates

    ``Array``
    The geometry's coordinates array.

.. attribute:: Geometry.dimension

    ``Number``
    The dimension of this geometry.

.. attribute:: Geometry.empty

    ``Boolean``
    The geometry is empty.

.. attribute:: Geometry.json

    ``String``
    The JSON representation of the geometry (see http://geojson.org).

.. attribute:: Geometry.length

    ``Number``
    The geometry length.

.. attribute:: Geometry.projection

    :class:`proj.Projection`
    Optional projection for the geometry.  If this is set, it is assumed
    that the geometry coordinates are in the corresponding coordinate
    reference system.  Use the :func:`transform` method to transform a
    geometry from one coordinate reference system to another.

.. attribute:: Geometry.rectangle

    ``Boolean``
    This geometry is a rectangle.

.. attribute:: Geometry.simple

    ``Boolean``
    The geometry is simple.

.. attribute:: Geometry.valid

    ``Boolean``
    The geometry is valid.




Common Geometry Methods
-----------------------

.. function:: Geometry.buffer

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

.. function:: Geometry.clone

    :returns: :class:`geom.Geometry`
    
    Creates a complete copy of this geometry.

.. function:: Geometry.contains

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry contains the other geometry (without boundaries
    touching).

.. function:: Geometry.convexHull

    :returns: :class:`geom.Geometry`
    
    Computes the smallest convex :class:`geom.Polygon` that contains this
    geometry.

.. function:: Geometry.coveredBy

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is covered by other geometry.

.. function:: Geometry.covers

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry covers the other geometry.

.. function:: Geometry.crosses

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry crosses the other geometry.

.. function:: Geometry.densify

    :arg tolerance: ``Number`` The distance tolerance for the densification.
        All line segments in the densified geometry will be no longer than the distance tolereance.
        The tolerance value must be non-negative.
    :returns: :class:`geom.Geometry`

     Densifies a geometry object adding vertices along the line segments of the
     geometry.

.. function:: Geometry.difference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry made up of all the points in this geometry that are
    not in the other geometry.

.. function:: Geometry.disjoint

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is disjoint to the other geometry.

.. function:: Geometry.distance

    :arg geometry: :class:`geom.Geometry`
    :returns: ``Number``
    
    Returns the minimum distance between this and the supplied geometry.

.. function:: Geometry.equals

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Geometries are considered equal if they share at least one point in
    common and if no point of either geometry lies in the exterior of the
    other.

.. function:: Geometry.equalsExact

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is exactly equal to the other geometry.

.. function:: Geometry.getBoundary

    :returns: :class:`geom.Geometry`
    
    Returns the boundary, or an empty geometry of appropriate dimension if
    this geometry is empty.

.. function:: Geometry.getEnvelope

    :returns: :class:`geom.Geometry`
    
    Returns this geometry's bounding box.

.. function:: Geometry.intersection

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points shared by this geometry
    and the other.

.. function:: Geometry.intersects

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry intersects the other geometry.

.. function:: Geometry.overlaps

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry overlaps the other geometry.

.. function:: Geometry.simplify

    :arg tolerance: ``Number`` The distance tolerance for the simplification.
        All vertices in the simplified geometry will be within this distance
        of the original geometry. The tolerance value must be non-negative.
    :returns: :class:`geom.Geometry`
    
    Simplify the geometry using the standard Douglas-Peucker algorithm.
    Returns a new geometry.

.. function:: Geometry.symDifference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points in this geometry but not
    in the other plus all the points in the other but not in this geometry.

.. function:: Geometry.touches

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry `only` touches the other geometry.

.. function:: Geometry.transform

    :arg to: :class:`proj.Projection`
    :returns: :class:`geom.Geometry`
    
    Transform coordinates of this geometry to the given projection.  The
    :attr:`projection` of this geometry must be set before calling this
    method.  Returns a new geometry.

.. function:: Geometry.within

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is within the other geometry.  This is the
    inverse of :func:`contains`.







