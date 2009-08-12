var jts = Packages.com.vividsolutions.jts;
var geom = jts.geom;

var Geometry = function() {
};
Geometry.prototype._factory = new geom.GeometryFactory();

var Point = function(coords, options) {
    
    var point = this._factory.createPoint(
        new geom.Coordinate(coords[0], coords[1])
    );
    
    this.x = point.x;
    this.y = point.y;

};
Point.prototype = new Geometry();


exports.Point = Point;