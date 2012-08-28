:class:`geom.Point`
===================

.. class:: geom.Point(coords)

    :arg Array coords: Coordinates array.

    Create a new point.

Example Use
-----------

Sample code to create a new point:

.. code-block:: javascript

    js> var Point = require("geoscript/geom").Point;
    js> var point = new Point([-180, 90]);
    js> point.x;
    -180
    js> point.y;
    90


Properties
----------

In addition to the properties common to all :class:`geom.Geometry` subclasses, point
geometries have the properties documented below.

.. attribute:: Point.x

    ``Number``
    The first coordinate value.

.. attribute:: Point.y

    ``Number``
    The second coordinate value.

.. attribute:: Point.z

    ``Number``
    The third coordinate value (or NaN if none).




Methods
-------

Point geometries have the methods common to all :class:`geom.Geometry` subclasses. 

