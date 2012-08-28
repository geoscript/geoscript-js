:class:`style.Style`
====================

.. class:: style.Style

    Instances of the symbolizer base class are not created directly.
    See the constructor details for one of the symbolizer subclasses.

Config Properties
-----------------

.. describe:: zIndex

    ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
    with higher zIndex values will be drawn over symbolizers with lower
    values.  By default, symbolizers have a zIndex of ``0``.

Properties
----------

.. attribute:: Style.filter

    :class:`filter.Filter`
    Filter that determines where this symbolizer applies.

.. attribute:: Style.maxScaleDenominator

    ``Number``
    Optional maximum scale denominator at which this symbolizer applies.

.. attribute:: Style.minScaleDenominator

    ``Number``
    Optional minimum scale denominator at which this symbolizer applies.

.. attribute:: Style.zIndex

    ``Number``
    The zIndex determines draw order of symbolizers.  Symbolizers
    with higher zIndex values will be drawn over symbolizers with lower
    values.  By default, symbolizers have a zIndex of ``0``.




Methods
-------


.. function:: Style.and

    :arg symbolizer: :class:`style.Symbolizer`
    :returns: :class:`style.Style`
    
    Generate a composite symbolizer from this symbolizer and the provided
    symbolizer.

.. function:: Style.range

    :arg config: ``Object`` An object with optional ``min`` and ``max``
        properties specifying the minimum and maximum scale denominators
        for applying this symbolizer.
    :returns: :class:`style.Symbolizer` This symbolizer.

.. function:: Style.where

    :arg filter: :class:`filter.Filter` or ``String`` A filter or CQL string that
        limits where this symbolizer applies.
    :returns: :class:`style.Symbolizer` This symbolizer.







