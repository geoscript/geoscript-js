.. module:: geom
    :synopsis: Geometry related functionality.

The :mod:`geom` module
======================

The :mod:`geom` module provides constructors for point, line, polygon and
multi-part geometries.

.. code-block:: javascript

	js> var geom = require('geoscript/geom');

Geometry Types
--------------

.. toctree::
    :maxdepth: 1

    geom/point
    geom/linestring
    geom/polygon
    geom/collection
    geom/multipoint
    geom/multilinestring
    geom/multipolygon


Module Data
-----------

.. data:: BUFFER_CAP_ROUND

    Used to calculate round caps for geometry buffer operations.
    
.. data:: BUFFER_CAP_SQUARE

    Used to calculate square caps for geometry buffer operations.
    
.. data:: BUFFER_CAP_BUTT

    Used to calculate butt caps for geometry buffer operations.
