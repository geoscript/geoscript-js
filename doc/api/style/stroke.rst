:class:`style.Stroke`
=====================

.. class:: style.Stroke

    A symbolizer for stroking geometries.

Config Properties
-----------------


.. describe:: brush

    :class:`style.Brush`
    The brush used to create this stroke.  This will typically be a
    :class:`Color` and can be given by the string hex value.

.. describe:: opacity

    ``Number``
    The opacity value (``0`` - ``1``).  Default is ``1``.

.. describe:: width

    ``Number``
    The pixel width of the stroke.  Default is ``1``.

.. describe:: zIndex

    ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
    with higher zIndex values will be drawn over symbolizers with lower
    values.  By default, symbolizers have a zIndex of ``0``.




Properties
----------


.. attribute:: Stroke.brush

    :class:`style.Brush`
    The brush used to create this stroke.

.. attribute:: Stroke.filter

    :class:`filter.Filter`
    Optional filter that determines where this symbolizer applies.

.. attribute:: Stroke.opacity

    ``Number``
    The opacity value.

.. attribute:: Stroke.width

    ``Number``
    The pixel width of the stroke.




Methods
-------


.. function:: Stroke.and

    :arg symbolizer: :class:`style.Symbolizer`
    :returns: :class:`style.Style`
    
    Generate a composite style from this symbolizer and the provided
    symbolizer.

.. function:: Stroke.range

    :arg config: ``Object`` An object with optional ``min`` and ``max``
        properties specifying the minimum and maximum scale denominators
        for applying this symbolizer.
    :returns: :class:`style.Symbolizer` This symbolizer.

.. function:: Stroke.where

    :arg filter: :class:`filter.Filter` or ``String`` A filter or CQL string that
        limits where this symbolizer applies.
    :returns: :class:`style.Symbolizer` This symbolizer.







