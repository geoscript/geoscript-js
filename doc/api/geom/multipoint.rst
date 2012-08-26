.. currentmodule:: geom


:class:`geom.MultiPoint`
================================================================================

.. class:: MultiPoint

    :arg coords: ``Array`` Coordinates array.

    Create a new multi-point geometry.  The items in the coords array
    may be point coordinates or :class:`Point` objects.



Example Use
-----------

Sample code to new multi-point:

.. code-block:: javascript

    js> var GEOM = require("geoscript/geom");
    js> var p1 = new GEOM.Point([-180, 90]);
    js> var p2 = new GEOM.Point([-45, 45]);
    js> var mp = new GEOM.MultiPoint([p1, p2]);

Alternate method to create the same geometry as above:

.. code-block:: javascript

    js> var mp = new GEOM.MultiPoint([
      >     [-180, 90], [-45, 45]
      > ]);



Properties
----------

Multi-polygon geometries have the properties common to all :class:`Geometry` 
subclasses. 


Methods
-------

Multi-polygon geometries have the methods common to all :class:`Geometry` 
subclasses. 
