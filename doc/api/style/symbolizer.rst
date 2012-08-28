:class:`style.Symbolizer`
=========================

.. class:: style.Symbolizer

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

.. attribute:: Symbolizer.filter

    :class:`filter.Filter`
    Optional filter that determines where this symbolizer applies.


Methods
-------

.. function:: Symbolizer.and

    :arg symbolizer: :class:`style.Symbolizer`
    :returns: :class:`style.Style`
    
    Generate a composite style from this symbolizer and the provided
    symbolizer.

.. function:: Symbolizer.range

    :arg config: ``Object`` An object with optional ``min`` and ``max``
        properties specifying the minimum and maximum scale denominators
        for applying this symbolizer.
    :returns: :class:`style.Symbolizer` This symbolizer.

.. function:: Symbolizer.where

    :arg filter: :class:`filter.Filter` or ``String`` A filter or CQL string that
        limits where this symbolizer applies.
    :returns: :class:`style.Symbolizer` This symbolizer.







