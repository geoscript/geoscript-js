:class:`style.Label`
====================

.. class:: style.Label

    A symbolizer for labeling features.

Example Use
-----------

Sample code to create a fill:

.. code-block:: javascript

    >> var Label = require("geoscript/style").Label;
    >> var label = Label({
    ..   expression: "property"
    .. });

Config Properties
-----------------

.. describe:: expression

    :class:`filter.Expression`

.. describe:: fontFamily

    ``String``

.. describe:: fontSize

    ``Number``

.. describe:: fontStyle

    ``String``

.. describe:: fontWeight

    ``String``

.. describe:: zIndex

    ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
    with higher zIndex values will be drawn over symbolizers with lower
    values.  By default, symbolizers have a zIndex of ``0``.




Properties
----------


.. attribute:: Label.expression

    :class:`filter.Expression`

.. attribute:: Label.filter

    :class:`filter.Filter`
    Optional filter that determines where this symbolizer applies.

.. attribute:: Label.fontFamily

    ``String``

.. attribute:: Label.fontSize

    ``Number``

.. attribute:: Label.fontStyle

    ``String``

.. attribute:: Label.fontWeight

    ``String``


Methods
-------

.. function:: Label.and

    :arg symbolizer: :class:`style.Symbolizer`
    :returns: :class:`style.Style`

    Generate a composite style from this symbolizer and the provided
    symbolizer.

.. function:: Label.range

    :arg config: ``Object`` An object with optional ``min`` and ``max``
        properties specifying the minimum and maximum scale denominators
        for applying this symbolizer.
    :returns: :class:`style.Symbolizer` This symbolizer.

.. function:: Label.where

    :arg filter: :class:`filter.Filter` or ``String`` A filter or CQL string that
        limits where this symbolizer applies.
    :returns: :class:`style.Symbolizer` This symbolizer.

