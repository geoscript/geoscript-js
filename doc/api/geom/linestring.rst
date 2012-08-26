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

    js> var GEOM = require("geoscript/geom");
    js> var line = new GEOM.LineString([[-180, -90], [0, 0], [180, 90]]);
    js> line.coordinates.length
    3
    js> line.length
    402.49223594996215


Properties
----------

In addition to the properties common to all :class:`Geometry` subclasses, 
linestring geometries have the properties documented below.


.. attribute:: LineString.endPoint

    :class`geom.Point`
    The last point in the linestring.

.. attribute:: LineString.endPoints

    ``Array``
    List of start point and end point.


.. attribute:: LineString.startPoint

    :class`geom.Point`
    The first point in the linestring.



Methods
-------

Linestring geometries have the methods common to all :class:`Geometry` 
subclasses. 
