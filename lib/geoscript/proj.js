var Projection = require("./proj/projection").Projection;

var transform = function(geometry, from, to) {
    if (!(from instanceof Projection)) {
        from = new Projection(from);
    }
    return from.transform(geometry, to);
};

exports.transform = transform;
exports.Projection = Projection;
