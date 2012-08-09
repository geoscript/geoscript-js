
.. currentmodule:: geom




:class:`geom.Bounds`
================================================================================

.. class:: Bounds

    Create a new bounds given minx, miny, maxx, maxy, and an optional
    projection.





Example Use
-----------

Sample code to create a new bounds:

.. code-block:: javascript

    js> var bounds = new GEOM.Bounds({
      >     minx: -180, maxx: 180, miny: -90, maxy: 90
      > });
    js> bounds.width
    360
    js> bounds.height
    180

Sample code to create a new bounds with a projection:

.. code-block:: javascript

    js> var bounds = new GEOM.Bounds({
      >     minx: -180, maxx: 180, miny: -90, maxy: 90, projection: "epsg:4326"
      > });
    js> bounds.projection
    <Projection EPSG:4326>

Sample code to create a new bounds from an array of [minx, miny, maxx, maxy] values:

.. code-block:: javascript

    js> var bounds = GEOM.Bounds.fromArray([-180, -90, 180, 90]);

    




Properties
----------


.. attribute:: Bounds.area

    ``Number``
    The are of this bounds.

.. attribute:: Bounds.empty

    ``Boolean``
    Empty bounds have zero width and height.

.. attribute:: Bounds.height

    ``Number``
    The difference between the maximum and minimum x values.

.. attribute:: Bounds.maxx

    ``Number``
    The maximum value in the first (x) dimension for this bounds.

.. attribute:: Bounds.maxy

    ``Number``
    The maximum value in the second (y) dimension for this bounds.

.. attribute:: Bounds.minx

    ``Number``
    The minimum value in the first (x) dimension for this bounds.

.. attribute:: Bounds.miny

    ``Number``
    The minimum value in the second (y) dimension for this bounds.

.. attribute:: Bounds.projection

    :class:`proj.Projection`
    The coordinate reference system for the bounds (if specified).  Setting
    this value will not transform coordinates of the bounds.  To transform
    a bounds from one projection to another, use the :meth:`transform`
    method.




Methods
-------


.. method:: Bounds.clone

    :returns: :class:`geom.Bounds`
    
    Generate a copy of this bounds.

.. method:: Bounds.contains

    :arg other: :class:`geom.Bounds` or :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Determine if the given point or geometry lies in the interior or on the
    boundary of this bounds.

.. method:: Bounds.equals

    :arg other: :class:`geom.Bounds`
    :returns: ``Boolean``
    
    Determine if two bounds are equivalent.

.. method:: Bounds.include

    :arg other: :class:`geom.Bounds` or :class:`geom.Geometry`
    :returns: :class:`Bounds` This bounds.
    
    Extends this bounds as necessary to include the given bounds or geometry.
    Modifies this bounds.

.. method:: Bounds.intersection

    :arg other: :class:`geom.Bounds`
    :returns: :class:`geom.Bounds`
    
    Generate a bounds that is the intersection of this bounds with the given
    bounds.

.. method:: Bounds.intersects

    :arg other: :class:`geom.Bounds` or :class:`geom.Geometry`
    :returns: ``Boolean``
    
    Determine if the interiors or edges of two bounds intersect.  If a
    geometry is given, intersection will be determined as if this bounds
    were a polygon.

.. method:: Bounds.quadTree

    :arg start: ``Number`` Starting level
    :arg stop: ``Number`` Stopping level (non-inclusive)
    :returns: ``Iterator``
    
    Returns an iterator of bounds objects for stepping through nodes in a
    tree of quads based on this bounds.  Level 0 is the current bounds.
    Level 1 is the four quadrants of current bounds.  Level 2 is the 16
    quadrants of the four level 1 quadrants.  Etc.

.. method:: Bounds.toArray

    :returns: ``Array``
    
    Return an array containing [minx, miny, maxx, maxy] values for this
    bounds.

.. method:: Bounds.toPolygon

    :returns: :class:`geom.Polygon`
    
    Generate a polygon with the corner coordinates of this bounds.

.. method:: Bounds.transform

    :arg projection: :class:`proj.Projection`
    :returns: :class:`geom.Bounds`
    
    Generate the bounds of the geometry that results from transforming this
    bounds to another projection.  This bounds must have a :attr:`projection`
    set before calling this method.




Static Methods
--------------


.. method:: Bounds.fromArray

    :arg bbox: ``Array``
    :arg projection: ``proj.Projection`` Optional projection for the bounds.
    :returns: :class:`geom.Bounds`
    
    Create a bounds given an array of [minx, miny, maxx, maxy] values.





