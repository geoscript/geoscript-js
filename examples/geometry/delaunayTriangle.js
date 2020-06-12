var geom = require('geoscript/geom');
var viewer = require('geoscript/viewer');

var polygon = geom.Point([1,1]).buffer(50);
var points = polygon.randomPoints(100);
var triangles = points.createDelaunayTriangles(true);
viewer.draw(triangles);