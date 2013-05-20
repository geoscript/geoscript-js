:class:`geom.MultiPolygon`
==========================

.. class:: geom.MultiPolygon(coords)

    :arg Array coords: Coordinates array.

    Create a new multipolygon geometry.  The items in the coords array
    may be polygon coordinates or :class:`geom.Polygon` objects.


Example Use
-----------

Sample code to new multi-polygon:

.. code-block:: javascript

    >> var {Polygon, MultiPolygon} = require("geoscript/geom");
    >> var p1 = Polygon([
    ..   [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]],
    ..   [[-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45]]
    .. ]);
    >> var p2 = Polygon([
    ..   [[-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30]]
    .. ]);
    >> var mp = MultiPolygon([p1, p2]);

Alternate method to create the same geometry as above:

.. code-block:: javascript

    >> var mp = MultiPolygon([
    ..   [
    ..     [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]],
    ..     [[-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45]]
    ..   ], [
    ..     [[-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30]]
    ..   ]
    .. ]);


Properties
----------


Multi-polygon geometries have the properties common to all
:class:`geom.GeometryCollection` subclasses.


Methods
-------

Multi-polygon geometries have the methods common to all
:class:`geom.GeometryCollection` subclasses.

