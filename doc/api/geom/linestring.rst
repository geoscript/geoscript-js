:class:`geom.LineString`
========================

.. class:: geom.LineString(coords)

    :arg Array coords: Coordinates array.

    Create a new linestring.


Example Use
-----------

Sample code to new linestring:

.. code-block:: javascript

    >> var LineString = require("geoscript/geom").LineString;
    >> var line = LineString([[-180, -90], [0, 0], [180, 90]]);
    >> line.coordinates.length
    3
    >> line.length
    402.49223594996215


Properties
----------

In addition to the properties common to all :class:`geom.Geometry` subclasses,
linestring geometries have the properties documented below.


.. attribute:: LineString.endPoint

    :class:`geom.Point`
    The last point in the linestring.

.. attribute:: LineString.endPoints

    ``Array``
    List of start point and end point.


.. attribute:: LineString.startPoint

    :class:`geom.Point`
    The first point in the linestring.



Methods
-------

Linestring geometries have the methods common to all :class:`geom.Geometry`
subclasses.

.. function:: LineString.interpolatePoint

    :arg position: ``Number`` The position between 0 and 1.
    :returns: :class:`geom.Point`

    Returns a Point placed on the LineString at the given percentage along
    the LineString.

.. function:: LineString.locatePoint

    :arg point: :class:`geom.Point` The Point
    :returns: ``Number`` The position (0-1) or percentage of the Point along the LineString.

    Returns a position or percentage between 0 and 1 of the Point along the LineString.

.. function:: LineString.placePoint

    :arg point: :class:`geom.Point` The Point.
    :returns: :class:`geom.Point` The Point on the LineString.

    Places or snaps the Point to the LineString.

.. function:: LineString.subLine

    :arg start: ``Number`` The start position between 0 and 1.
    :arg end: ``Number`` The end position between 0 and 1.
    :returns: :class:`geom.LineString` The sub LineString

    Returns a position or percentage between 0 and 1 of the Point along the LineString.