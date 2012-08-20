
.. currentmodule:: geom




:class:`geom.MultiPolygon`
================================================================================

.. class:: MultiPolygon

    :arg coords: ``Array`` Coordinates array.

    Create a new multipolygon geometry.  The items in the coords array
    may be polygon coordinates or :class:`Polygon` objects.





Example Use
-----------

Sample code to new multi-polygon:

.. code-block:: javascript

    js> var p1 = new GEOM.Polygon([
      >     [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
      >     [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
      > ]);
    js> var p2 = new GEOM.Polygon([
      >     [ [-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30] ]
      > ]);
    js> var mp = new GEOM.MultiPolygon([p1, p2]);

Alternate method to create the same geometry as above:

.. code-block:: javascript

    js> var mp = new GEOM.MultiPolygon([
      >     [
      >         [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
      >         [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
      >     ], [
      >         [ [-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30] ]
      >     ]
      > ]);

    




Properties
----------


.. attribute:: MultiPolygon.area

    ``Number``
    The geometry area.

.. attribute:: MultiPolygon.bounds

    :class:`geom.Bounds`
    The bounds defined by minimum and maximum x and y values in this geometry.

.. attribute:: MultiPolygon.centroid

    ``geom.Point``
    The centroid of this geometry.

.. attribute:: MultiPolygon.components

    ``Array``
    The component :class:`geom.Geometry` objects that make up this collection.

.. attribute:: MultiPolygon.coordinates

    :returns: ``Array`` An array of coordinates.
    
    An array of coordinates for the geometry.

.. attribute:: MultiPolygon.dimension

    ``Number``
    The dimension of this geometry.

.. attribute:: MultiPolygon.empty

    ``Boolean``
    The geometry is empty.

.. attribute:: MultiPolygon.json

    ``String``
    The JSON representation of the geometry (see http://geojson.org).

.. attribute:: MultiPolygon.length

    ``Number``
    The geometry length.

.. attribute:: MultiPolygon.prepared

    ``Boolean``
    This is a prepared geometry.  See :meth:`prepare`.

.. attribute:: MultiPolygon.projection

    :class:`proj.Projection`
    Optional projection for the geometry.  If this is set, it is assumed
    that the geometry coordinates are in the corresponding coordinate
    reference system.  Use the :meth:`transform` method to transform a
    geometry from one coordinate reference system to another.

.. attribute:: MultiPolygon.rectangle

    ``Boolean``
    This geometry is a rectangle.

.. attribute:: MultiPolygon.simple

    ``Boolean``
    The geometry is simple.

.. attribute:: MultiPolygon.valid

    ``Boolean``
    The geometry is valid.




Methods
-------


.. method:: MultiPolygon.buffer

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

.. method:: MultiPolygon.clone

    :returns: :class:`geom.Geometry`
    
    Creates a complete copy of this geometry.

.. method:: MultiPolygon.contains

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry contains the other geometry (without boundaries
    touching).

.. method:: MultiPolygon.convexHull

    :returns: :class:`geom.Geometry`
    
    Computes the smallest convex :class:`Polygon` that contains this
    geometry.

.. method:: MultiPolygon.coveredBy

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is covered by other geometry.

.. method:: MultiPolygon.covers

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry covers the other geometry.

.. method:: MultiPolygon.crosses

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry crosses the other geometry.

.. method:: MultiPolygon.difference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry made up of all the points in this geometry that are
    not in the other geometry.

.. method:: MultiPolygon.disjoint

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is disjoint to the other geometry.

.. method:: MultiPolygon.distance

    :arg geometry: :class:`geom.Geometry`
    :returns: ``Number``
    
    Returns the minimum distance between this and the supplied geometry.

.. method:: MultiPolygon.equals

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Geometries are considered equal if they share at least one point in
    common and if no point of either geometry lies in the exterior of the
    other.

.. method:: MultiPolygon.equalsExact

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is exactly equal to the other geometry.

.. method:: MultiPolygon.getBoundary

    :returns: :class:`geom.Geometry`
    
    Returns the boundary, or an empty geometry of appropriate dimension if
    this geometry is empty.

.. method:: MultiPolygon.getEnvelope

    :returns: :class:`geom.Geometry`
    
    Returns this geometry's bounding box.

.. method:: MultiPolygon.intersection

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points shared by this geometry
    and the other.

.. method:: MultiPolygon.intersects

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry intersects the other geometry.

.. method:: MultiPolygon.overlaps

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry overlaps the other geometry.

.. method:: MultiPolygon.prepare

    :returns: :class:`geom.Geometry`
    
    Prepare a geometry for multiple spatial operations.  Preparing optimizes
    the geometry for multiple calls to :meth:`contains`, :meth:`coveredBy`,
    :meth:`covers`, :meth:`crosses`, :meth:`disjoint`, :meth:`intersects`,
    :meth:`overlaps`, :meth:`touches`, and :meth:`within`.

.. method:: MultiPolygon.simplify

    :arg tolerance: ``Number`` The distance tolerance for the simplification.
        All vertices in the simplified geometry will be within this distance
        of the original geometry. The tolerance value must be non-negative.
    :returns: :class:`geom.Geometry`
    
    Simplify the geometry using the standard Douglas-Peucker algorithm.
    Returns a new geometry.

.. method:: MultiPolygon.symDifference

    :arg other: :class:`geom.Geometry`
    :returns: :class:`geom.Geometry`
    
    Creates a geometry representing all the points in this geometry but not
    in the other plus all the points in the other but not in this geometry.

.. method:: MultiPolygon.touches

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry `only` touches the other geometry.

.. method:: MultiPolygon.transform

    :arg to: :class:`proj.Projection`
    :returns: :class:`geom.Geometry`
    
    Transform coordinates of this geometry to the given projection.  The
    :attr:`projection` of this geometry must be set before calling this
    method.  Returns a new geometry.

.. method:: MultiPolygon.within

    :arg other: :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Tests if this geometry is within the other geometry.  This is the
    inverse of :meth:`contains`.







