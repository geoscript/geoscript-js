

.. currentmodule:: geom

:class:`geom.Point`
================================================================================

.. class:: Point

    :arg coords: ``Array`` Coordinates array.

    Create a new point.



Example Use
-----------

Sample code to new point:

.. code-block:: javascript

    var point = new geom.Point([-180, 90]);
    point.x;  // -180
    point.y;  // 90

    


Properties
----------


.. attribute:: Point.coordinates

    ``Array``
    The geometry's coordinates array.

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
    :arg segs: ``Number`` Integer number of quadrant segments for circular
        arcs.  Default is 8.
    :arg caps: ``Number`` One of Geometry.BUFFER_CAP_ROUND,
        Geometry.BUFFER_CAP_BUTT, or Geometry.BUFFER_CAP_SQUARE.  Default
        is Geometry.BUFFER_CAP_ROUND.
    :returns: :class:`geom.Geometry`
    
    Construct a goemetry that buffers this geometry by the given width.

.. method:: Point.clone

    :returns: :class:`geom.Geometry`
    
    Creates a full copy of this geometry.

.. method:: Point.contains

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry contains the other geometry (without boundaries
    touching).

.. method:: Point.convexHull

    :returns: :class:`geom.Geometry`
    
    Computes the smallest convex :class:`geom.Polygon` that contains this
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

    :arg geometry: :class:`Geometry`
    :returns: ``Number``
    
    Returns the minimum distance between this and the supplied geometry.

.. method:: Point.draw

    Draw the geometry onto a frame.

.. method:: Point.equals

    :arg other: :class:`Geometry`
    :returns: ``Boolean``
    
    Geometries are considered equal if they share at least one point in
    common and if no point of either geometry lies in the exterior of the
    other.

.. method:: Point.equalsExact

    :arg other: :class:`Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is exactly equal to the other geometry.

.. method:: Point.getArea

    :returns: ``Number``
    The geometry area.

.. method:: Point.getBoundary

    :returns: :class:`geom.Geometry`
    
    Returns the boundary, or an empty geometry of appropriate dimension if
    this geometry is empty.

.. method:: Point.getEnvelope

    :returns: :class:`geom.Geometry`
    
    Returns this geometry's bounding box.

.. method:: Point.getLength

    :returns: ``Number``
    The geometry length.

.. method:: Point.intersection

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points shared by this geometry
    and the other.

.. method:: Point.isEmpty

    :returns: ``Boolean``
    
    Tests if this geometry is empty.

.. method:: Point.isRectangle

    :returns: ``Boolean``
    
    Tests if this geometry is a rectangle.

.. method:: Point.isSimple

    :returns: ``Boolean``
    
    Tests if this geometry is simple.

.. method:: Point.isValid

    :returns: ``Boolean``
    
    Tests if this geometry is valid.

.. method:: Point.overlaps

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry overlaps the other geometry.

.. method:: Point.symDifference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points in this geometry but not
    in the other plus all the points in the other but not in this geometry.

.. method:: Point.toString

    :returns: ``String``
    Generate the Well-Known Text representation of the geometry.

.. method:: Point.touches

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry `only` touches the other geometry.

.. method:: Point.within

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is within the other geometry.  This is the
    inverse of :meth:`contains`.

