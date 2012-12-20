The io/wkt module
=================

.. code-block:: javascript

    >> var WKT = require("geoscript/io/wkt");

Methods
-------


.. function:: read

    :arg wkt: ``String`` The Well-Known Text representation of a geometry.
    :returns: :class:`geom.Geometry`
    
    Create a geometry from WKT.  The specific geometry type depends on the
    given WKT.

    Example use:
    
    .. code-block:: javascript
    
        >> var WKT = require("geoscript/io/wkt");
        >> var GEOM = require("geoscript/geom");
        >> var point = WKT.read("POINT(1 2)");
        >> point instanceof GEOM.Point
        true

.. function:: write

    :arg geometry: :class:`geom.Geometry` A geometry.
    :returns: ``String`` The Well-Known Text representation of a geometry.
    
    Generate a Well-Known Text string from a geometry.

    Example use:
    
    .. code-block:: javascript
    
        >> var WKT = require("geoscript/io/wkt");
        >> var GEOM = require("geoscript/geom");
        >> var str = WKT.write(new GEOM.Point([1, 2]));
        >> str
        POINT (1 2)

