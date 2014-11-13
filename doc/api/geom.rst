The geom module
===============


The :doc:`geom <geom>` module provides a provides constructors for point, line,
polygon and multi-part geometries.

.. code-block:: javascript

    >> var geom = require("geoscript/geom");


Constructors
------------

.. toctree::
    :glob:
    :maxdepth: 1    
    
    geom/point
    geom/linestring
    geom/polygon
    geom/multipoint
    geom/multilinestring
    geom/multipolygon
    geom/bounds
    geom/circularstring
    geom/compoundcurve


Module Data
-----------

The following constants are used in the :func:`Geometry.buffer` method to
specify the buffer cap style.

.. data:: geom.BUFFER_CAP_BUTT

    Used to calculate butt caps for buffer operations.

.. data:: geom.BUFFER_CAP_ROUND

    Used to calculate round caps for buffer operations.

.. data:: geom.BUFFER_CAP_SQUARE

    Used to calculate square caps for buffer operations.

