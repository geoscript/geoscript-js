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

    js> var {Polygon, MultiPolygon} = require("geoscript/geom");
    js> var p1 = new Polygon([
      >     [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
      >     [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
      > ]);
    js> var p2 = new Polygon([
      >     [ [-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30] ]
      > ]);
    js> var mp = new MultiPolygon([p1, p2]);

Alternate method to create the same geometry as above:

.. code-block:: javascript

    js> var mp = new MultiPolygon([
      >     [
      >         [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
      >         [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
      >     ], [
      >         [ [-60, -30], [-60, 30], [60, 30], [60, -30], [-60, -30] ]
      >     ]
      > ]);


Properties
----------


Multi-polygon geometries have the properties common to all
:class:`geom.GeometryCollection` subclasses. 


Methods
-------

Multi-polygon geometries have the methods common to all 
:class:`geom.GeometryCollection` subclasses. 

