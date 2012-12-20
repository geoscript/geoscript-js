The io/json module
=================

.. code-block:: javascript

    >> var GeoJSON = require("geoscript/io/json");

Methods
-------


.. function:: read

    :arg wkt: ``String`` The GeoJSON representation of a geometry or feature.
    :returns: :class:`geom.Geometry` || :class:`feature.Feature`
    
    Create a geometry or feature from a JSON string.

    Example use:
    
    .. code-block:: javascript
    
        >> var GeoJSON = require("geoscript/io/json");
        >> var GEOM = require("geoscript/geom");
        >> var line = GeoJSON.read('{"type": "LineString", "coordinates": [[1,2], [3,4]]}');
        >> line instanceof GEOM.LineString
        true

.. function:: write

    :arg geometry: :class:`geom.Geometry` || :class:`feature.Feature` A geometry
        or feature.
    :returns: ``String`` The GeoJSON representation of a geometry or feature.
    
    Generate a GeoJSON string from a geometry or feature.

    Example use:
    
    .. code-block:: javascript
    
        >> var GeoJSON = require("geoscript/io/json");
        >> var GEOM = require("geoscript/geom");
        >> var str = GeoJSON.write(new GEOM.Point([1, 2]));
        >> str
        {"type":"Point","coordinates":[1,2]}

