

.. currentmodule:: geom

:class:`geom.LineString`
================================================================================

.. class:: LineString

    :arg coords: ``Array`` Coordinates array.

    Create a new linestring.



Example Use
-----------

Sample code to new linestring:

.. code-block:: javascript

    var line = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    line.coordinates.length;  // 3
    line.length;  // 402.49223594996215

    


Properties
----------


.. attribute:: LineString.coordinates

    ``Array``
    The geometry's coordinates array.

.. attribute:: LineString.length

    ``Number``
    The linestring length.




Methods
-------


.. method:: LineString.buffer

    :arg dist: ``Number`` Width of buffer.  May be positive, negative, or
        zero.
    :arg segs: ``Number`` Integer number of quadrant segments for circular
        arcs.  Default is 8.
    :arg caps: ``Number`` One of Geometry.BUFFER_CAP_ROUND,
        Geometry.BUFFER_CAP_BUTT, or Geometry.BUFFER_CAP_SQUARE.  Default
        is Geometry.BUFFER_CAP_ROUND.
    :returns: :class:`geom.Geometry`
    
    Construct a goemetry that buffers this geometry by the given width.

.. method:: LineString.clone

    :returns: :class:`geom.Geometry`
    
    Creates a full copy of this geometry.

.. method:: LineString.contains

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry contains the other geometry (without boundaries
    touching).

.. method:: LineString.convexHull

    :returns: :class:`geom.Geometry`
    
    Computes the smallest convex :class:`geom.Polygon` that contains this
    geometry.

.. method:: LineString.coveredBy

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is covered by other geometry.

.. method:: LineString.covers

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry covers the other geometry.

.. method:: LineString.crosses

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry crosses the other geometry.

.. method:: LineString.difference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry made up of all the points in this geometry that are
    not in the other geometry.

.. method:: LineString.disjoint

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is disjoint to the other geometry.

.. method:: LineString.distance

    :arg geometry: :class:`Geometry`
    :returns: ``Number``
    
    Returns the minimum distance between this and the supplied geometry.

.. method:: LineString.draw

    Draw the geometry onto a frame.

.. method:: LineString.equals

    :arg other: :class:`Geometry`
    :returns: ``Boolean``
    
    Geometries are considered equal if they share at least one point in
    common and if no point of either geometry lies in the exterior of the
    other.

.. method:: LineString.equalsExact

    :arg other: :class:`Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is exactly equal to the other geometry.

.. method:: LineString.getArea

    :returns: ``Number``
    The geometry area.

.. method:: LineString.getBoundary

    :returns: :class:`geom.Geometry`
    
    Returns the boundary, or an empty geometry of appropriate dimension if
    this geometry is empty.

.. method:: LineString.getEnvelope

    :returns: :class:`geom.Geometry`
    
    Returns this geometry's bounding box.

.. method:: LineString.getLength

    :returns: ``Number``
    The geometry length.

.. method:: LineString.intersection

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points shared by this geometry
    and the other.

.. method:: LineString.isEmpty

    :returns: ``Boolean``
    
    Tests if this geometry is empty.

.. method:: LineString.isRectangle

    :returns: ``Boolean``
    
    Tests if this geometry is a rectangle.

.. method:: LineString.isSimple

    :returns: ``Boolean``
    
    Tests if this geometry is simple.

.. method:: LineString.isValid

    :returns: ``Boolean``
    
    Tests if this geometry is valid.

.. method:: LineString.overlaps

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry overlaps the other geometry.

.. method:: LineString.symDifference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points in this geometry but not
    in the other plus all the points in the other but not in this geometry.

.. method:: LineString.toString

    :returns: ``String``
    Generate the Well-Known Text representation of the geometry.

.. method:: LineString.touches

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry `only` touches the other geometry.

.. method:: LineString.within

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is within the other geometry.  This is the
    inverse of :meth:`contains`.

