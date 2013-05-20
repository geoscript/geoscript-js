:class:`feature.Schema`
=======================

.. class:: feature.Schema(config)

    :arg Object config: Configuration object.

    Create a new schema.


Example Use
-----------

Sample code to create a new schema:

.. code-block:: javascript

    >> var Schema = require("geoscript/feature").Schema;
    >> var cities = Schema({
    ..   name: "cities",
    ..   fields: [{
    ..     name: "the_geom",
    ..     type: "Point",
    ..     projection: "EPSG:4326"
    ..   }, {
    ..     name: "name",
    ..     type: "String"
    ..   }]
    .. });

    >> cities.fields.length
    2
    >> cities.geometry.name
    the_geom
    >> cities.get("the_geom").type
    Point
    >> cities.get("the_geom").projection
    <Projection EPSG:4326>

Config Properties
-----------------

.. describe:: fields

    ``Array``
    Field definitions.  Each item in the array must be a
    :class:`feature.Field` object or a valid field config.

.. describe:: name

    ``String``
    The schema name.  Default is ``"feature"``.  The schema name typically
    matches the layer name within a workspace.


Properties
----------


.. attribute:: Schema.fieldNames

    ``Array``
    Array of field names.

.. attribute:: Schema.fields

    ``Array``
    Field definitions.  Field definitions are objects with at least ``name``
    and ``type`` properties.  Geometry field definitions may have a
    ``projection`` property.  See the :class:`feature.Field` documentation
    for more detail.

.. attribute:: Schema.geometry

    ``Object``
    Default geometry field definition.  Will be ``undefined`` if the schema
    doesn't include a geometry field.

.. attribute:: Schema.name

    ``String``
    The schema name.


Methods
-------

.. function:: Schema.clone

    :arg config: ``Object``
    :returns: :class:`feature.Schema`

    Create a complete copy of this schema.

.. function:: Schema.get

    :arg name: ``String`` A field name.
    :returns: :class:`feature.Field` A field definition.

    Get the definition for a named field.  Field definitions have at least
    ``name`` and ``type`` properties.  Geometry field definitions may have
    a ``projection`` property.  Returns ``undefined`` if no field is found
    with the given name.


