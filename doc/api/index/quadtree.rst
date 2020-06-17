:class:`index.Quadtree`
==========================

.. class:: index.Quadtree()

    Create a Quadtree Spatial Index.


Properties
----------

.. attribute:: size

    ``Int``
    The number of items in the spatial index.


Methods
-------

.. function:: Quadtree.query

    :arg bounds: :class:`geom.Bounds` The Bounds.
    :returns: :class:`Array`

    Query the spatial index by Bounds.

.. function:: Quadtree.queryAll

    :returns: :class:`Array`

    Get all item in the spatial index.

.. function:: Quadtree.insert

    :arg bounds: :class:`geom.Bounds` The Bounds.
    :arg item: :class:`Object` The value.
    :returns: :class:`boolean` Whether an item was removed or not

    Remove an item from the spatial index

.. function:: Quadtree.remove

    :arg bounds: :class:`geom.Bounds` The Bounds.
    :arg item: :class:`Object` The value.
    :returns: :class:`boolean` Whether an item was removed or not

    Remove an item from the spatial index

    Get all item in the spatial index.







