:class:`filter.Filter`
======================

.. class:: filter.Filter

    :arg cql: `String` A CQL string representing filter constraints.

    Create a new filter to express constraints.  Filters are typically
    used when querying features from a layer.  A feature will be
    returned in a query if the filter's :func:`~Filter.evaluate` method returns
    `true` for the given feature.

    Filters are created using Common Query Language (CQL).

Example Use
-----------

Get the exported constructor:

.. code-block:: javascript

    >> var Filter = require("geoscript/filter").Filter;

Various simple constraints:

.. code-block:: javascript

    >> var namedFoo = Filter("name = 'foo'");
    >> var oneThing = Filter("thing = 1");
    >> var few = Filter("count < 4");
    >> var many = Filter("count > 36");
    >> var teens = Filter("age BETWEEN 13 AND 19");

Spatial constraints:

.. code-block:: javascript

    >> var box = Filter("BBOX(the_geom, -10, -10, 10, 10)");
    >> var close = Filter("DWITHIN(the_geom, POINT(1 0), 3, kilometers)");
    >> var has = Filter("CONTAINS(the_geom, POINT(1 0))");
    >> var hit = Filter("INTERSECTS(the_geom, LINESTRING(0 0, 1 1))");


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

.. function:: Filter.and

    :arg filter: :class:`filter.Filter` Input filter.
    :returns: :class:`filter.Filter`

    Returns a new filter that is the logical AND of this filter and the
    input filter.  Provide multiple arguments to AND multiple filters.

.. function:: Filter.evaluate

    :arg feature: :class:`feature.Feature` A feature.
    :returns: ``Boolean``  The feature matches the filter.

    Determine whether a feature matches the constraints of the filter.

.. function:: Filter.or

    :arg filter: :class:`filter.Filter` Input filter.
    :returns: :class:`filter.Filter`

    Returns a new filter that is the logical OR of this filter and the
    input filter.  Provide multiple arguments to OR multiple filters.



