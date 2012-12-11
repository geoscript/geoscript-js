var ASSERT = require("assert");
var Process = require("geoscript/process").Process;
var GEOM = require("geoscript/geom");
var {Schema, Feature, FeatureCollection} = require("geoscript/feature");

exports["test Process.constructor"] = function() {
    
    var f = new Process({
        inputs: {
            foo: {
                type: "String"
            }
        },
        outputs: {
            bar: {
                type: "String"
            }
        },
        run: function(inputs) {
            return {bar: inputs.foo}
        }
    });
    ASSERT.ok(f instanceof Process, "constructor returns instance");
    
};

exports["test inputs"] = function() {
    var p = new Process({
        inputs: {
            foo: {
                type: "Integer",
                description: "Foo field."
            },
            bar: {
                type: "String",
                description: "Bar field."
            }
        },
        outputs: {
            baz: {type: "String"}
        },
        run: function(inputs) {
            return {bar: inputs.foo}
        }
    });
    ASSERT.ok(!!p.inputs, "process has inputs property");
    ASSERT.strictEqual(typeof p.inputs, "object", "foo parameter object");
    ASSERT.strictEqual(p.inputs.foo.name, "foo", "foo parameter named foo");
    ASSERT.strictEqual(p.inputs.foo.type, "Integer", "foo parameter Integer type");
    ASSERT.strictEqual(typeof p.inputs.bar, "object", "bar parameter object");
    ASSERT.strictEqual(p.inputs.bar.name, "bar", "bar parameter named bar");
    ASSERT.strictEqual(p.inputs.bar.type, "String", "bar parameter String type");
};

exports["test inputs (invalid)"] = function() {
    
    var inputs = {
        foo: {type: "String"}
    };
    
    var outputs = {
        bar: {type: "String"}
    };
    
    var run = function(inputs) {
        return {bar: inputs.foo};
    };
    
    var err = null;
    try {
        var p = new Process({
            inputs: inputs,
            outputs: outputs,
            run: run
        });
    } catch (e) {
        err = e;
    }
    ASSERT.strictEqual(err, null, "valid inputs");

    // now try with invalid inputs
    inputs.foo.type = "invalid";

    ASSERT.throws(function() {
        var p = new Process({
            inputs: inputs,
            outputs: outputs,
            run: run
        });
    }, Error, "invalid output type");
    
};

exports["test outputs"] = function() {
    var p = new Process({
        inputs: {
            baz: {type: "String"}
        },
        outputs: {
            foo: {
                type: "Integer",
                description: "Foo field."
            },
            bar: {
                type: "String",
                description: "Bar field."
            }
        },
        run: function(inputs) {
            return {bar: inputs.foo}
        }
    });
    ASSERT.ok(!!p.outputs, "process has outputs property");
    ASSERT.strictEqual(typeof p.outputs.foo, "object", "foo parameter object");
    ASSERT.strictEqual(p.outputs.foo.name, "foo", "foo parameter named foo");
    ASSERT.strictEqual(p.outputs.foo.type, "Integer", "foo parameter Integer type");
    ASSERT.strictEqual(typeof p.outputs.bar, "object", "bar parameter object");
    ASSERT.strictEqual(p.outputs.bar.name, "bar", "bar field named bar");
    ASSERT.strictEqual(p.outputs.bar.type, "String", "bar field String type");
};

exports["test outputs (invalid)"] = function() {
    
    var inputs = {
        foo: {type: "String"}
    };
    
    var outputs = {
        bar: {type: "String"}
    };
    
    var run = function(inputs) {
        return {bar: inputs.foo};
    };
    
    var err = null;
    try {
        var p = new Process({
            inputs: inputs,
            outputs: outputs,
            run: run
        });
    } catch (e) {
        err = e;
    }
    ASSERT.strictEqual(err, null, "valid inputs");

    // now try with invalid outputs
    outputs.bar.type = "invalid";

    ASSERT.throws(function() {
        var p = new Process({
            inputs: inputs,
            outputs: outputs,
            run: run
        });
    }, Error, "invalid output type");
    
};

exports["test parameter binding to java.lang.Class"] = function() {
    var process;
    
    var inputs = {
        foo: {type: "String"}
    };
    var outputs = {
        bar: {type: "String"}
    };
    var run = function(inputs) {
        return {bar: inputs.foo};
    };
    
    // already mapped to string
    inputs.mapped = {type: java.lang.Integer};
    process = new Process({
        inputs: inputs,
        outputs: outputs,
        run: run
    });
    ASSERT.strictEqual(process.inputs.mapped.type, "Integer", "class mapped to string");

    // class not already in type map
    inputs.notMapped = {type: Packages.org.geotools.process.geometry.GeometryFunctions.BufferCapStyle};
    process = new Process({
        inputs: inputs,
        outputs: outputs,
        run: run
    });
    ASSERT.ok(process.inputs.notMapped.type == Packages.org.geotools.process.geometry.GeometryFunctions.BufferCapStyle, "class not mapped to string");

}

exports["test minOccurs"] = function() {
    
    var process = new Process({
        inputs: {
            required: {type: "String", minOccurs: 1},
            require2: {type: "String", minOccurs: 2},
            optional: {type: "String", minOccurs: 0},
            unspecified: {type: "String"}
        },
        outputs: {
            result: {type: "Boolean"}
        },
        run: function(inputs) {
            return {result: true};
        }
    });
    
    ASSERT.strictEqual(process.inputs.required.minOccurs, 1);
    ASSERT.strictEqual(process.inputs.require2.minOccurs, 2);
    ASSERT.strictEqual(process.inputs.optional.minOccurs, 0);
    ASSERT.strictEqual(process.inputs.unspecified.minOccurs, 1);
    
    var inputs;

    // valid inputs
    inputs = {
        required: "pass",
        require2: ["one", "two"],
        optional: "here",
        unspecified: "here"
    };
    
    ASSERT.strictEqual(process.run(inputs).result, true, "minimums");
    
    // missing required input
    inputs = {
        require2: ["one", "two"],
        optional: "here",
        unspecified: "here"
    };

    ASSERT.throws(function() {
        process.run(inputs);
    }, Error, "missing required input");

    // not enough require2 input
    inputs = {
        required: "pass",
        require2: "one",
        optional: "here",
        unspecified: "here"
    };

    ASSERT.throws(function() {
        process.run(inputs);
    }, Error, "too few require2 input");

    // not enough require2 input (again)
    inputs = {
        required: "pass",
        require2: ["one"],
        optional: "here",
        unspecified: "here"
    };

    ASSERT.throws(function() {
        process.run(inputs);
    }, Error, "too few require2 input (again)");
    
    // missing unspecified input
    inputs = {
        required: "pass",
        require2: ["one", "two"],
        optional: "here"
    };
    ASSERT.throws(function() {
        process.run(inputs);
    }, Error, "missing unspecified input");


}

exports["test run"] = function() {
    var add = new Process({
        title: "Add process",
        description: "Adds two numbers",
        inputs: {
            a: {
                type: "Double",
                title: "First number"
            },
            b: {
                type: "Double",
                title: "Second number"
            }
        },
        outputs: {
            result: {
                type: "Double",
                title: "The result"
            }
        },
        run: function(inputs) {
            return {
                result: inputs.a + inputs.b
            };
        }
    });
    
    var output = add.run({a: 3.5, b: 4});
    ASSERT.strictEqual(output.result, 7.5, "3.5 + 4");
    
}

exports["test: Process.getNames"] = function() {
    var names = Process.getNames();
    ASSERT.ok(names instanceof Array, "names array");
    ASSERT.ok(names.length > 50, "more than 50 names");
    
    var first = names[0];
    ASSERT.strictEqual(typeof first, "string", "string name");
    var parts = first.split(":");
    ASSERT.strictEqual(parts.length, 2, "delimited with :");
    
}

exports["test: Process.get('geo:buffer')"] = function() {
    
    var buffer = Process.get("geo:buffer");
    var inputs = buffer.inputs;
    
    ASSERT.strictEqual(typeof inputs, "object", "inputs object");
    ASSERT.strictEqual(inputs.distance.type, "Number", "distance type");
    ASSERT.strictEqual(inputs.geom.type, "Geometry", "geom type");
    
    // TODO: deal with enumerated values
    var capStyle = inputs.capStyle.type;
    ASSERT.ok(capStyle == Packages.org.geotools.process.geometry.GeometryFunctions.BufferCapStyle, "capStyle type");
    
    var geom = require("geoscript/geom");
    var point = new geom.Point([1, 2]);
    var outputs = buffer.run({geom: point, distance: 10});
    
    ASSERT.ok(outputs.result instanceof geom.Polygon, "result polygon");
    ASSERT.strictEqual(outputs.result.area.toFixed(3), "312.145", "correct area");
    
}

exports["test: Process.get('geo:union')"] = function() {
    
    var union = Process.get("geo:union");
    var inputs = union.inputs;
    
    ASSERT.strictEqual(typeof inputs, "object", "inputs object");
    ASSERT.strictEqual(inputs.geom.type, "Geometry", "geom type");
    ASSERT.strictEqual(inputs.geom.minOccurs, 2, "geom minOccurs");
    
    var geom = require("geoscript/geom");
    var poly1 = new geom.Point([0, 0]).buffer(1);
    var poly2 = new geom.Point([0, 1]).buffer(1);
    
    var outputs = union.run({geom: [poly1, poly2]});
    
    ASSERT.ok(outputs.result instanceof geom.Polygon, "result polygon");
    ASSERT.strictEqual(outputs.result.area.toFixed(3), "5.028", "correct area");
    
}


exports["test: Process.get('vec:BufferFeatureCollection')"] = function() {
    var buffer = Process.get("vec:BufferFeatureCollection");
    
    ASSERT.strictEqual(buffer.inputs.features.type, "FeatureCollection");
    ASSERT.strictEqual(buffer.outputs.result.type, "FeatureCollection");
    
    var collection = new FeatureCollection({
        features: function() {
            for (var i=0; i<3; ++i) {
                yield new Feature({
                    properties: {
                        geom: new GEOM.Point([i*10, i*10])
                    }
                });
            }
        }
    });
    
    var result = buffer.run({features: collection, distance: 2}).result;
    
    ASSERT.ok(result instanceof FeatureCollection, "result collection");
    ASSERT.strictEqual(result.size, 3, "3 items");
    
    var count = 0;
    var schema, geometry, centroid;
    for (var feature in result) {
        ASSERT.ok(feature instanceof Feature, "feature " + count);
        schema = feature.schema;
        ASSERT.ok(schema instanceof Schema, "schema " + count);
        ASSERT.strictEqual(schema.fields.length, 1, "fields length " + count);
        ASSERT.strictEqual(schema.geometry.name, "geom", "geom field " + count);
        ASSERT.strictEqual(schema.geometry.type, "MultiPolygon", "geom type " + count);
        geometry = feature.geometry;
        ASSERT.ok(geometry instanceof GEOM.MultiPolygon, "multi-polygon " + count);
        centroid = geometry.centroid;
        ASSERT.ok(centroid.distance(new GEOM.Point([count*10, count*10])) < 10e-10, "centroid " + count);
        ASSERT.strictEqual(geometry.area.toFixed(3), "12.486", "area " + count);
        ++count;
    }
    
    ASSERT.strictEqual(count, 3, "iterated over three features");
};


if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
