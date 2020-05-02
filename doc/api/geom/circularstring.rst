:class:`geom.CircularString`
========================

.. class:: geom.CircularString(coords)

    :arg Array coords: Coordinates array.

    Create a new circularstring.


Example Use
-----------

Sample code to new circularstring:

.. code-block:: javascript

    >> var CircularString = require("geoscript/geom").CircularString;
    >> var cs = new CircularString([[6.12, 10.0], [7.07, 7.07], [10.0, 0.0]]);
    >> cs.controlPoints.length
    3
    >> cs.linear.getGeometryType()
    LineString
    >> cs.curvedWkt
    CIRCULARSTRING (6.12 10.0, 7.07 7.07, 10.0 0.0)



Properties
----------

In addition to the properties common to :class:`geom.LineString` subclasses,
circularstring geometries have the properties documented below.


.. attribute:: CircularString.curvedWkt

    :class:`String`
    The curved WKT as a string.

.. attribute:: CircularString.controlPoints

    ``Array``
    An array of the original control Points.


.. attribute:: CircularString.linear

    :class:`geom.LineString`
    A linearized LineString.



Methods
-------

CircularString geometries have the methods common to :class:`geom.LineString`
subclasses.
