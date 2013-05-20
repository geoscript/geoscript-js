:class:`geom.MultiLineString`
=============================

.. class:: geom.MultiLineString(coords)

    :arg Array coords: Coordinates array.

    Create a new multi-linestring geometry.  The items in the coords array
    may be linestring coordinates or :class:`geom.LineString` objects.


Example Use
-----------

Sample code to new multi-linestring:

.. code-block:: javascript

    >> var {MultiLineString, LineString} = require("geoscript/geom");
    >> var l1 = LineString([[-180, -90], [0, 0], [180, 90]]);
    >> var l2 = LineString([[180, -90], [0, 0], [-180, 90]]);
    >> var ml = MultiLineString([l1, l2]);

Alternate method to create the same geometry as above:

.. code-block:: javascript

    >> var ml = MultiLineString([
    ..   [[-180, -90], [0, 0], [180, 90]],
    ..   [[180, -90], [0, 0], [-180, 90]]
    .. ]);


Properties
----------

Multi-polygon geometries have the properties common to all
:class:`geom.GeometryCollection` subclasses.


Methods
-------

Multi-polygon geometries have the methods common to all
:class:`geom.GeometryCollection` subclasses.


