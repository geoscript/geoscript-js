var geom = require('geoscript/geom');
var viewer = require('geoscript/viewer');

var polygon = geom.Point([1,1]).buffer(50);
var points = polygon.randomPoints(20);
var diagram = points.createVoronoiDiagram();
viewer.draw(diagram);