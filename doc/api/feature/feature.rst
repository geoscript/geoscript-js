:class:`feature.Feature`
========================

.. class:: feature.Feature(config)

    :arg Object config: Configuration object.

    Create a new feature.


Example Use
-----------

Sample code to create a new feature:

.. code-block:: javascript

    >> var Feature = require("geoscript/feature").Feature;
    >> var Point = require("geoscript/geom").Point;
    >> var city = Feature({
    ..   properties: {
    ..     location: Point([-110, 45]),
    ..     name: "Metropolis"
    ..   }
    .. });

    >> city.get("name");
    Metropolis
    >> city.get("location");
    <Point [-110, 45]>


Config Properties
-----------------

.. describe:: schema

    :class:`feature.Schema`
    The feature schema.  If not provided, a schema will be derived from
    the provided ``properties`` in the configuration.

.. describe:: properties

    ``Object``
    An object with all the feature property names and values.



Properties
----------


.. attribute:: Feature.bounds

    :class:`geom.Bounds`
    The bounds of the default geometry (if any) for this feature.  Will be
    ``undefined`` if the feature has no geometry.

.. attribute:: Feature.geometry

    :class:`geom.Geometry`
    The default geometry (if any) for the feature.  Will be ``undefined``
    if the feature does not have a geometry.

.. attribute:: Feature.geometryName

    ``String``
    Field name for the default geoemtry, or ``undefined`` if the feature
    has no geometry.

.. attribute:: Feature.id

    ``String``
    The feature identifier.  Read only.

.. attribute:: Feature.json

    ``String``
    The JSON representation of the feature (see http://geojson.org).

.. attribute:: Feature.projection

    :class:`proj.Projection`
    Optional projection for the feature.  This corresponds to the projection
    of the default geometry for the feature.

.. attribute:: Feature.schema

    :class:`feature.Schema`
    The feature schema (read-only).

.. attribute:: Feature.properties

    ``Object``
    An object with all the feature property names and values.  Used for
    property access only.  Use :func:`~Feature.set` to set property values.




Methods
-------


.. function:: Feature.clone

    :returns: :class:`feature.Feature`

    Create a clone of this feature.

.. function:: Feature.get

    :arg name: ``String`` Attribute name.

    Get an attribute value.

.. function:: Feature.set

    :arg name: ``String`` Attribute name.
    :arg value: ``String`` Attribute value.

    Set a feature attribute.







