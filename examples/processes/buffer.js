var Process = require("geoscript/process").Process;

var buffer = exports.buffer = new Process({
    title: "Buffer",
    description: "Buffer geometries for features.  The features input can be an array, a cursor, or any object with a forEach method.  It is assumed that all features share the same schema and that the schema has a default geometry field.  The distance input is expected to be in the same units as the geometry coordinates.",
    runner: function(args, callback, errback) {
        if (args.length !== 2) {
            errback("Buffer must be run with two arguments.");
        }
        var features = args[0];
        if (!features.forEach || typeof features.forEach !== "function") {
            errback("Buffer features input must have a forEach method.");
        }
        var distance = Number(args[1]);
        // pass back a forEach-able that creates clones with buffered geometries
        callback({
            forEach: function(fn) {
                var schema, name;
                features.forEach(function(feature) {
                    if (!schema) {
                        var field = feature.schema.geometry;
                        if (!field) {
                            errback("Buffer only works on features with a default geometry.");
                        }
                        var type;
                        if (field.type.indexOf("Multi") === 0) {
                            type = "MultiPolygon";
                        } else if (field.type === "Geometry") {
                            type = "Geometry";
                        } else {
                            type = "Polygon";
                        }
                        name = field.name;
                        schema = feature.schema.clone({
                            fields: [{
                                name: name,
                                type: type
                            }]
                        });
                    }
                    var values = {};
                    values[name] = feature.geometry.buffer(distance);
                    fn(feature.clone({
                        schema: schema,
                        values: values
                    }));
                });
            }
        });
    }
});


if (require.main == module.id) {
    var fs = require("fs");
    var Directory = require("geoscript/workspace").Directory;
    var path = fs.resolve(module.path, "../data/shapefiles");
    var dir = new Directory(path);
    var states = dir.get("states");
    var promise = buffer.run(states.features, 1);
    var values = promise.wait();
    var features = [];
    values[0].forEach(function(feature) {
        features.push(feature);
    });
    require("geoscript/viewer").draw(features);
}
