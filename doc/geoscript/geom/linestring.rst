:class:`geoscript.geom.LineString`
==================================

The `LineString` constructor is exported to the :mod:`geoscript.geom` module.

.. code-block:: javascript

    js> var geom = require('geoscript/geom');

Create a new linestring geometry by passing the constructor an array of vertex
coordinates.

.. code-block:: javascript

    js> var l = new geom.LineString([[-180, -90], [0, 0], [180, 90]]);
    js> l instanceof geom.Geometry
    true
    js> l instanceof geom.LineString
    true
    js> l    
    LINESTRING (-180 -90, 0 0, 180 90)


The `getLength` method returns the line length.

.. code-block:: javascript

    js> l.getLength().toFixed(2)
    402.49


Buffering
---------

To construct a geometry that buffers a line, use the `buffer` method.  The
third argument to `buffer` determines the end-cap style.  Here we'll use
square caps instead of the default round.

.. code-block:: javascript

    js> var b = l.buffer(2, 8, geom.Geometry.BUFFER_CAP_SQUARE);
    js> b.getArea().toFixed(2)
    1625.97

