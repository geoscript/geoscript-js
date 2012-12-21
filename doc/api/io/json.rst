The io/json module
==================

.. code-block:: javascript

    >> var GeoJSON = require("geoscript/io/json");

Methods
-------


.. function:: read

    :arg wkt: ``String`` The GeoJSON representation of a geometry or feature.
    :returns: :class:`Object` The deserialized version of the input string (one 
        of :class:`geom.Geometry`, :class:`geom.GeometryCollection`, 
        :class:`feature.Feature`, or :class:`feature.FeatureCollection`).
    
    Create a geometry, a feature, or a collection of either from a JSON string.

    Example of deserializing a geometry:
    
    .. code-block:: javascript
    
        >> var GEOM = require("geoscript/geom");
        >> var line = GeoJSON.read('{"type": "LineString", "coordinates": [[1,2], [3,4]]}');
        >> line instanceof GEOM.LineString
        true
        >> line
        <LineString [[1, 2], [3, 4]]>

    Example of deserializing a feature:
    
    .. code-block:: javascript

        >> var Feature = require("geoscript/feature").Feature;
        >> var str = '{"type": "Feature", "properties": {"foo": "bar"}, "geometry": {"type": "Point", "coordinates": [1, 2]}}'
        >> var feature = GeoJSON.read(str)
        >> feature instanceof Feature
        true
        >> feature
        <Feature foo: "bar", geometry: <Point>>


.. function:: write

    :arg obj: :class:`Object` Input object (one of :class:`geom.Geometry`, 
        :class:`geom.GeometryCollection`, :class:`feature.Feature`, 
        or :class:`feature.FeatureCollection`).
    :returns: ``String`` The GeoJSON representation of the input object.
    
    Generate a GeoJSON string from a geometry, a feature, or a collection of
    either.

    Example of serializing a geometry:
    
    .. code-block:: javascript
    
        >> var GEOM = require("geoscript/geom");
        >> var str = GeoJSON.write(new GEOM.Point([1, 2]));
        >> str
        {"type":"Point","coordinates":[1,2]}

