:class:`style.Fill`
===================

.. class:: style.Fill

    A symbolizer for filling polygon geometries.

Example Use
-----------

Sample code to create a fill:

.. code-block:: javascript

    >> var Fill = require("geoscript/style").Fill;
    >> var fill = Fill({
    ..   brush: "red",
    ..   opacity: 0.5
    .. });


Config Properties
-----------------

.. describe:: brush

    :class:`style.Brush`
    The brush used to create this fill.  This will typically be a
    :class:`Color` and can be given by the string hex value.

.. describe:: opacity

    ``Number``
    The opacity value (``0`` - ``1``).  Default is ``1``.

.. describe:: zIndex

    ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
    with higher zIndex values will be drawn over symbolizers with lower
    values.  By default, symbolizers have a zIndex of ``0``.




Properties
----------


.. attribute:: Fill.brush

    :class:`style.Brush`
    The brush used to create this fill.

.. attribute:: Fill.filter

    :class:`filter.Filter`
    Optional filter that determines where this symbolizer applies.

.. attribute:: Fill.opacity

    ``Number``
    The opacity value.


Methods
-------

.. function:: Fill.and

    :arg symbolizer: :class:`style.Symbolizer`
    :returns: :class:`style.Style`

    Generate a composite style from this symbolizer and the provided
    symbolizer.

.. function:: Fill.range

    :arg config: ``Object`` An object with optional ``min`` and ``max``
        properties specifying the minimum and maximum scale denominators
        for applying this symbolizer.
    :returns: :class:`style.Symbolizer` This symbolizer.

.. function:: Fill.where

    :arg filter: :class:`filter.Filter` or ``String`` A filter or CQL string that
        limits where this symbolizer applies.
    :returns: :class:`style.Symbolizer` This symbolizer.

