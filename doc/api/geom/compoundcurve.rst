:class:`geom.CompoundCurve`
===========================

.. class:: geom.CompoundCurve(lineStrings)

    :arg Array lineStrings: An array of LineStrings or CircularStrings.

    Create a new CompoundCurve.


Example Use
-----------

Sample code to new compoundcurve:

.. code-block:: javascript

    >> var GEOM = require("geoscript/geom");
    >> var cs = new GEOM.CircularString([[10.0, 10.0], [0.0, 20.0], [-10.0, 10.0]]);
    >> var line = new GEOM.LineString([[-10.0, 10.0], [-10.0, 0.0], [10.0, 0.0], [5.0, 5.0]])
    >> var cc = new GEOM.CompoundCurve([cs, line]);
    >> cc.components.length
    2
    >> cc.linear.getGeometryType()
    LineString
    >> cc.curvedWkt
    COMPOUNDCURVE (CIRCULARSTRING (10.0 10.0, 0.0 20.0, -10.0 10.0), (-10.0 10.0, -10.0 0.0, 10.0 0.0, 5.0 5.0))


Properties
----------

In addition to the properties common to all :class:`geom.LineString` subclasses,
compoundcurve geometries have the properties documented below.


.. attribute:: CompoundCurve.components

    :class:`geom.LineString`
    The original LineString or CircularStrings.

.. attribute:: CircularString.curvedWkt

    :class:`String`
    The curved WKT as a string.

.. attribute:: CircularString.linear

    :class:`geom.LineString`
    A linearized LineString.

Methods
-------

CompoundCurve geometries have the methods common to all :class:`geom.LineString`
subclasses.
