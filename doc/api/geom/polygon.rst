

.. currentmodule:: geom

:class:`geom.Polygon`
================================================================================

.. class:: Polygon

    :arg coords: ``Array`` Coordinates array.

    Create a new polygon.



Example Use
-----------

Sample code to new polygon:

.. code-block:: javascript

    var poly = new geom.Polygon([
        [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
        [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
    ]);

    


Properties
----------


.. attribute:: Polygon.coordinates

    ``Array``
    The geometry's coordinates array.




Methods
-------


.. method:: Polygon.buffer

    :arg dist: ``Number`` Width of buffer.  May be positive, negative, or
        zero.
    :arg segs: ``Number`` Integer number of quadrant segments for circular
        arcs.  Default is 8.
    :arg caps: ``Number`` One of Geometry.BUFFER_CAP_ROUND,
        Geometry.BUFFER_CAP_BUTT, or Geometry.BUFFER_CAP_SQUARE.  Default
        is Geometry.BUFFER_CAP_ROUND.
    :returns: :class:`geom.Geometry`
    
    Construct a goemetry that buffers this geometry by the given width.

.. method:: Polygon.clone

    :returns: :class:`geom.Geometry`
    
    Creates a full copy of this geometry.

.. method:: Polygon.contains

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry contains the other geometry (without boundaries
    touching).

.. method:: Polygon.convexHull

    :returns: :class:`geom.Geometry`
    
    Computes the smallest convex :class:`geom.Polygon` that contains this
    geometry.

.. method:: Polygon.coveredBy

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is covered by other geometry.

.. method:: Polygon.covers

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry covers the other geometry.

.. method:: Polygon.crosses

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry crosses the other geometry.

.. method:: Polygon.difference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry made up of all the points in this geometry that are
    not in the other geometry.

.. method:: Polygon.disjoint

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is disjoint to the other geometry.

.. method:: Polygon.distance

    :arg geometry: :class:`Geometry`
    :returns: ``Number``
    
    Returns the minimum distance between this and the supplied geometry.

.. method:: Polygon.draw

    Draw the geometry onto a frame.

.. method:: Polygon.equals

    :arg other: :class:`Geometry`
    :returns: ``Boolean``
    
    Geometries are considered equal if they share at least one point in
    common and if no point of either geometry lies in the exterior of the
    other.

.. method:: Polygon.equalsExact

    :arg other: :class:`Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is exactly equal to the other geometry.

.. method:: Polygon.getArea

    :returns: ``Number``
    The geometry area.

.. method:: Polygon.getBoundary

    :returns: :class:`geom.Geometry`
    
    Returns the boundary, or an empty geometry of appropriate dimension if
    this geometry is empty.

.. method:: Polygon.getEnvelope

    :returns: :class:`geom.Geometry`
    
    Returns this geometry's bounding box.

.. method:: Polygon.getLength

    :returns: ``Number``
    The geometry length.

.. method:: Polygon.intersection

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points shared by this geometry
    and the other.

.. method:: Polygon.isEmpty

    :returns: ``Boolean``
    
    Tests if this geometry is empty.

.. method:: Polygon.isRectangle

    :returns: ``Boolean``
    
    Tests if this geometry is a rectangle.

.. method:: Polygon.isSimple

    :returns: ``Boolean``
    
    Tests if this geometry is simple.

.. method:: Polygon.isValid

    :returns: ``Boolean``
    
    Tests if this geometry is valid.

.. method:: Polygon.overlaps

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry overlaps the other geometry.

.. method:: Polygon.symDifference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points in this geometry but not
    in the other plus all the points in the other but not in this geometry.

.. method:: Polygon.toString

    :returns: ``String``
    Generate the Well-Known Text representation of the geometry.

.. method:: Polygon.touches

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry `only` touches the other geometry.

.. method:: Polygon.within

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is within the other geometry.  This is the
    inverse of :meth:`contains`.

