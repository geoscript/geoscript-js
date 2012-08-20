.. module:: io/wkt
    :synopsis: Reading and writing well-known text for geometries.

The :mod:`io/wkt` module
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

    js> var WKT = require("geoscript/io/wkt");

Methods
-------


.. method:: read

    :arg wkt: ``String`` The Well-Known Text representation of a geometry.
    :returns: :class:`geom.Geometry`
    
    Create a geometry from WKT.  The specific geometry type depends on the
    given WKT.

    Example use:
    
    .. code-block:: javascript
    
        js> var WKT = require("geoscript/io/wkt");
        js> var GEOM = require("geoscript/geom");
        js> var point = WKT.read("POINT(1 2)");
        js> point instanceof GEOM.Point
        true

.. method:: write

    :arg geometry: :class:`geom.Geometry` A geometry.
    :returns: ``String`` The Well-Known Text representation of a geometry.
    
    Generate a Well-Known Text string from a geometry.

    Example use:
    
    .. code-block:: javascript
    
        js> var WKT = require("geoscript/io/wkt");
        js> var GEOM = require("geoscript/geom");
        js> var str = WKT.write(new GEOM.Point([1, 2]));
        js> str
        POINT (1 2)

