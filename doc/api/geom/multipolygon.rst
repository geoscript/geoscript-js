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


Multi-polygon geometries have the properties common to all :class:`Geometry` 
subclasses. 


Methods
-------

Multi-polygon geometries have the methods common to all :class:`Geometry` 
subclasses. 

