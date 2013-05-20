The io/json module
==================

.. code-block:: javascript

    >> var parser = require("geoscript/io/json");

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

        >> var LineString = require("geoscript/geom").LineString;
        >> var line = parser.read('{"type": "LineString", "coordinates": [[1,2], [3,4]]}');
        >> line instanceof LineString
        true
        >> line
        <LineString [[1, 2], [3, 4]]>

    Example of deserializing a feature:

    .. code-block:: javascript

        >> var Feature = require("geoscript/feature").Feature;
        >> var str = '{"type": "Feature", "properties": {"foo": "bar"}, "geometry": {"type": "Point", "coordinates": [1, 2]}}'
        >> var feature = parser.read(str)
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

        >> var Point = require("geoscript/geom").Point;
        >> var str = parser.write(Point([1, 2]));
        >> str
        {"type":"Point","coordinates":[1,2]}

