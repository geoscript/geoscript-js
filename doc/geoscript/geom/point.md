`Point` Examples
================

The `Point` constructor is exported to the `geom` module.

    js> var geom = require('geoscript/geom');
    
Create a new point by passing a coordinates array to the constructor.

    js> var p = new geom.Point([-111.0, 45.7]);
    js> p      
    POINT (-111 45.7)
    js> p instanceof geom.Geometry
    true
    js> p instanceof geom.Point
    true
    js> p.x
    -111
    js> p.y
    45.7
    js> p.z
    NaN

A third dimension is supported by passing a three item coordinates array.

    js> var p3 = new geom.Point([-111.0, 45.7, 5000]);
    js> p3  
    POINT (-111 45.7)
    js> p3.z
    5000

Note that points are considered equal if they are equivalent in planar space.

    js> p.equals(p3)
    true


Buffering
---------

All geometries support the `buffer` method.  Calling `buffer` constructs a new
geometry.  Buffering a point produces a polygon.

    js> var b = p.buffer(1);
    js> b instanceof geom.Polygon
    true
    js> b.getArea().toFixed(2)
    3.12

You can increase the accuracy of a buffer by increasing the number of segments
per arc quadrant (default is 8).

    js> var b = p.buffer(1, 24);
    js> b.getArea().toFixed(2)
    3.14

