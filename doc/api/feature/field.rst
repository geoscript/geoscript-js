:class:`feature.Field`
======================

.. class:: feature.Field(config)

    :arg Object config: Configuration object.

    Create a new field.

Example Use
-----------

Sample code to create a new field:

.. code-block:: javascript

    >> var Field = require("geoscript/feature").Field;
    >> var field = Field({
    ..   name: "age",
    ..   type: "Double"
    .. });

    >> var field = Field({
    ..   name: "location",
    ..   type: "Point",
    ..   projection: "EPSG:4326"
    .. });

For detail on the supported ``type`` values, see the section on
:ref:`type_mapping`.

Config Properties
-----------------

.. describe:: description

    ``String``
    The field description (optional).

.. describe:: isNillable

    ``Boolean``
    The field is nillable (optional).  Default is ``true``.

.. describe:: minOccurs

    ``Number``
    The minimum occurences for field values (optional).  Default is ``0``.

.. describe:: name

    ``String``
    The field name (required).

.. describe:: projection

    :class:`proj.Projection`
    Geometry projection (optional).  Relevant for geometry type fields only.

.. describe:: title

    ``String``
    The field title (optional).

.. describe:: type

    ``String``
    The field type (required).  For detail on the supported ``type`` values, see
    the section on :ref:`type_mapping`.



Properties
----------

.. attribute:: Field.description

    ``String``
    The field description (read-only).

.. attribute:: Field.isNillable

    ``Boolean``
    The field is nillable (read-only).

.. attribute:: Field.maxOccurs

    ``Number``
    The maximum occurences for field values (read-only).

.. attribute:: Field.minOccurs

    ``Number``
    The minimum occurences for field values (read-only).

.. attribute:: Field.name

    ``String``
    The field name (read-only).

.. attribute:: Field.projection

    :class:`proj.Projection`
    Geometry type fields can have an optional projection (read-only).

.. attribute:: Field.title

    ``String``
    The field title (read-only).

.. attribute:: Field.type

    ``String``
    The field type (read-only).  For detail on the supported ``type`` values,
    see the section on :ref:`type_mapping`.



Methods
-------

.. function:: Field.equals

    :arg field: :class:`feature.Field`
    :returns: ``Boolean`` The two fields are equivalent.

    Determine if another field is equivalent to this one.

