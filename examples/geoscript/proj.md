The `proj` Module
=================

The `proj` module contains methods for transforming geometries from one
coordinate reference system to another.

    js> var proj = require('geoscript/proj');


The `transform` Method
----------------------

Coordinate reference systems are idnetified by their SRID.  To transform a
geometry from one system to another, use the `transform` method.

    js> var geom = require('geoscript/geom');
    js> var p1 = new geom.Point([-111.0, 45.7]);
    js> var proj = require('geoscript/proj');
    js> var p2 = proj.transform(p1, 'epsg:4326', 'epsg:26912');
    js> Math.floor(p2.x)
    499999
    js> Math.floor(p2.y)
    5060716

