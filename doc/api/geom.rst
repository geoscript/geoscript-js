.. module:: geom
    :synopsis: A collection of geometry types.

The :mod:`geom` module
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


The :mod:`geom` module provides a provides constructors for point, line,
polygon and multi-part geometries.

.. code-block:: javascript

    js> var geom = require("geoscript/geom");


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


Module Data
-----------

The following constants are used in the :meth:`Geometry.buffer` method to
specify the buffer cap style.

.. data:: BUFFER_CAP_BUTT

    Used to calculate butt caps for buffer operations.

.. data:: BUFFER_CAP_ROUND

    Used to calculate round caps for buffer operations.

.. data:: BUFFER_CAP_SQUARE

    Used to calculate square caps for buffer operations.

