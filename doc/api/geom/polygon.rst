.. currentmodule:: geom

:class:`geom.Polygon`
================================================================================

.. class:: Polygon

    :arg coords: ``Array`` Coordinates array.

    Create a new polygon.


Example Use
-----------

Sample code to new polygon:

.. code-block:: javascript

    js> var GEOM = require("geoscript/geom");
    js> var poly = new GEOM.Polygon([
      >     [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
      >     [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
      > ]);


Properties
----------

In addition to the properties common to all :class:`Geometry` subclasses, 
polygon geometries have the properties documented below.

.. attribute:: Polygon.rectangle

    ``Boolean``
    This geometry is a rectangle.



Methods
-------

Polygon geometries have the methods common to all :class:`Geometry` 
subclasses. 
