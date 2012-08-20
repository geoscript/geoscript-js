.. currentmodule:: filter

:class:`filter.Filter`
================================================================================

.. class:: Filter

    :arg cql: `String` A CQL string representing filter constraints.

    Create a new filter to express constraints.  Filters are typically
    used when querying features from a layer.  A feature will be
    returned in a query if the filter's :meth:`evaluate` method returns
    `true` for the given feature.

    Filters are created using Common Query Language (CQL).

Example Use
-----------

Examples of filters that represent various simple constraints:

.. code-block:: javascript

    js> var namedFoo = new FILTER.Filter("name = 'foo'");
    js> var oneThing = new FILTER.Filter("thing = 1");
    js> var few = new FILTER.Filter("count < 4");
    js> var many = new FILTER.Filter("count > 36");
    js> var teens = new FILTER.Filter("age BETWEEN 13 AND 19");

Examples of filters representing spatial constraints:

.. code-block:: javascript

    js> var box = new FILTER.Filter("BBOX(the_geom, -10, -10, 10, 10)");
    js> var close = new FILTER.Filter("DWITHIN(the_geom, POINT(1 0), 3, kilometers)");
    js> var has = new FILTER.Filter("CONTAINS(the_geom, POINT(1 0))");
    js> var hit = new FILTER.Filter("INTERSECTS(the_geom, LINESTRING(0 0, 1 1))");


Properties
----------


.. attribute:: Filter.cql

    ``String``
    The CQL string that represents constraints in this filter.

.. attribute:: Filter.not

    :class:`filter.Filter`
    A filter that represents the negation of the constraints in this filter.



Methods
-------

.. method:: Filter.and

    :arg filter: :class:`filter.Filter` Input filter.
    :returns: :class:`filter.Filter`

    Returns a new filter that is the logical AND of this filter and the
    input filter.  Provide multiple arguments to AND multiple filters.

.. method:: Filter.evaluate

    :arg feature: :class:`feature.Feature` A feature.
    :returns: ``Boolean``  The feature matches the filter.
    
    Determine whether a feature matches the constraints of the filter.

.. method:: Filter.or

    :arg filter: :class:`filter.Filter` Input filter.
    :returns: :class:`filter.Filter`

    Returns a new filter that is the logical OR of this filter and the
    input filter.  Provide multiple arguments to OR multiple filters.



