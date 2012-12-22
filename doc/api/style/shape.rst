:class:`style.Shape`
====================

.. class:: style.Shape

    A symbolizer that renders points using a named shape.


Config Properties
-----------------

.. describe:: fill

    :class:`style.Fill`
    The fill used for this shape.  May be provided as a fill instance or
    any valid fill configuration.

    Example use:

    .. code-block:: javascript

        >> var Shape = require("geoscript/style").Shape;
        >> var shape = Shape({name: "circle", fill: "blue"});

.. describe:: name

    ``String``
    The shape name.  Acceptable values include "circle", "square",
    "triangle", "star", "cross", and "x".  Default is "square".

.. describe:: rotation

    ``Number``
    Rotation angle in degrees clockwise about the center point of the
    shape.

.. describe:: size

    ``Number``
    The shape pixel size.  Default is 6.

.. describe:: stroke

    :class:`style.Stroke`
    The stroke used for this shape.  May be provided as a stroke instance or
    any valid stroke configuration.

    Example use:

    .. code-block:: javascript

        >> var shape = Shape({name: "circle", stroke: "red"});

.. describe:: zIndex

    ``Number`` The zIndex determines draw order of symbolizers.  Symbolizers
    with higher zIndex values will be drawn over symbolizers with lower
    values.  By default, symbolizers have a zIndex of ``0``.




Properties
----------


.. attribute:: Shape.fill

    :class:`style.Fill`
    The fill used for this shape.

.. attribute:: Shape.filter

    :class:`filter.Filter`
    Optional filter that determines where this symbolizer applies.

.. attribute:: Shape.name

    ``String``
    The shape name.

.. attribute:: Shape.opacity

    ``Number``
    The opacity value (0 - 1).  Default is ``1``.

.. attribute:: Shape.rotation

    ``Number``
    Rotation angle in degrees clockwise about the center point of the
    shape.

.. attribute:: Shape.size

    :class:`filter.Expression`
    The shape pixel size.

.. attribute:: Shape.stroke

    :class:`style.Stroke`
    The stroke used for this shape.


Methods
-------

.. function:: Shape.and

    :arg symbolizer: :class:`style.Symbolizer`
    :returns: :class:`style.Style`

    Generate a composite style from this symbolizer and the provided
    symbolizer.

.. function:: Shape.range

    :arg config: ``Object`` An object with optional ``min`` and ``max``
        properties specifying the minimum and maximum scale denominators
        for applying this symbolizer.
    :returns: :class:`style.Symbolizer` This symbolizer.

.. function:: Shape.where

    :arg filter: :class:`filter.Filter` or ``String`` A filter or CQL string that
        limits where this symbolizer applies.
    :returns: :class:`style.Symbolizer` This symbolizer.

