:class:`index.STRtree`
==========================

.. class:: index.STRtree()

    Create a STRtree Spatial Index.


Properties
----------

.. attribute:: size

    ``Int``
    The number of items in the spatial index.


Methods
-------

.. function:: STRtree.query

    :arg bounds: :class:`geom.Bounds` The Bounds.
    :returns: :class:`Array`

    Query the spatial index by Bounds.

.. function:: STRtree.insert

    :arg bounds: :class:`geom.Bounds` The Bounds.
    :arg item: :class:`Object` The value.
    :returns: :class:`boolean` Whether an item was removed or not

    Remove an item from the spatial index








