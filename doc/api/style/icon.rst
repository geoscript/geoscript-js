:class:`style.Icon`
===================

.. class:: style.Icon

    A symbolizer that renders points using a graphic image.


Config Properties
-----------------

.. describe:: rotation

    ``Number``
    Rotation angle in degrees clockwise about the center point of the
    shape.

.. describe:: size

    ``Number``
    The shape pixel size.  Default is 6.

.. describe:: url

    ``String``
    The icon url.

.. describe:: zIndex

    ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
    with higher zIndex values will be drawn over symbolizers with lower
    values.  By default, symbolizers have a zIndex of ``0``.


Properties
----------

.. attribute:: Icon.filter

    :class:`filter.Filter`
    Optional filter that determines where this symbolizer applies.

.. attribute:: Icon.opacity

    ``Number``
    The opacity value (0 - 1).  Default is ``1``.

.. attribute:: Icon.rotation

    ``Number``
    Rotation angle in degrees clockwise about the center point of the
    shape.

.. attribute:: Icon.size

    :class:`filter.Expression`
    The shape pixel size.

.. attribute:: Icon.url

    ``String``
    The icon url.


Methods
-------

.. function:: Icon.and

    :arg symbolizer: :class:`style.Symbolizer`
    :returns: :class:`style.Style`
    
    Generate a composite style from this symbolizer and the provided
    symbolizer.

.. function:: Icon.range

    :arg config: ``Object`` An object with optional ``min`` and ``max``
        properties specifying the minimum and maximum scale denominators
        for applying this symbolizer.
    :returns: :class:`style.Symbolizer` This symbolizer.

.. function:: Icon.where

    :arg filter: :class:`filter.Filter` or ``String`` A filter or CQL string that
        limits where this symbolizer applies.
    :returns: :class:`style.Symbolizer` This symbolizer.


