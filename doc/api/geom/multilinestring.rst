.. currentmodule:: geom


:class:`geom.MultiLineString`
================================================================================

.. class:: MultiLineString

    :arg coords: ``Array`` Coordinates array.

    Create a new multi-linestring geometry.  The items in the coords array
    may be linestring coordinates or :class:`LineString` objects.


Example Use
-----------

Sample code to new multi-linestring:

.. code-block:: javascript

    js> var GEOM = require("geoscript/geom");
    js> var l1 = new GEOM.LineString([[-180, -90], [0, 0], [180, 90]]);
    js> var l2 = new GEOM.LineString([[180, -90], [0, 0], [-180, 90]]);
    js> var ml = new GEOM.MultiLineString([l1, l2]);

Alternate method to create the same geometry as above:

.. code-block:: javascript

    js> var ml = new GEOM.MultiLineString([
      >     [[-180, -90], [0, 0], [180, 90]],
      >     [[180, -90], [0, 0], [-180, 90]]
      > ]);


Properties
----------

Multi-linestring geometries have the properties common to all :class:`Geometry` 
subclasses. 


Methods
-------

Multi-linestring geometries have the methods common to all :class:`Geometry` 
subclasses. 




