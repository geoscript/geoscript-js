:class:`geoscript.geom.Polygon`
===============================

The `Polygon` constructor is exported to the :mod:`geoscript.geom` module.

.. code-block:: javascript

    js> var geom = require('geoscript/geom');

Create a new polygon geometry by passing the constructor an array of ring
coordinates.  The first ring will be the exterior, and any additional rings
will be interior (holes).

.. code-block:: javascript

    js> var p = new geom.Polygon([
      >     [ [-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90] ],
      >     [ [-90, -45], [-90, 45], [90, 45], [90, -45], [-90, -45] ]
      > ]);
    js> p
    POLYGON ((-180 -90, -180 90, 180 90, 180 -90, -180 -90), (-90 -45, -90 45, 90 45, 90 -45, -90 -45))
    js> p instanceof geom.Geometry
    true
    js> p instanceof geom.Polygon
    true
    js> p.getArea().toFixed(2)
    48600.00


Buffering
---------

To create a new polygon that buffers the original, use the `buffer` method.

.. code-block:: javascript

    js> var b = p.buffer(1);
    js> b.getArea().toFixed(2)
    50219.12
    
Note that the width of the buffer can be positive, negative, or zero.

.. code-block:: javascript

    js> var b = p.buffer(-5);
    js> b.getArea().toFixed(2)
    40521.96
