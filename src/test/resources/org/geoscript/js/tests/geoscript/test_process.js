var ASSERT = require("assert");
var Process = require("geoscript/process").Process;

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
    inputs.notMapped = {type: Packages.org.geotools.process.jts.GeometryFunctions.BufferCapStyle};
    process = new Process({
        inputs: inputs,
        outputs: outputs,
        run: run
    });
    ASSERT.ok(process.inputs.notMapped.type == Packages.org.geotools.process.jts.GeometryFunctions.BufferCapStyle, "class not mapped to string");

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

exports["test: Process.get('JTS:buffer')"] = function() {
    
    var buffer = Process.get("JTS:buffer");
    var inputs = buffer.inputs;
    
    ASSERT.strictEqual(typeof inputs, "object", "inputs object");
    ASSERT.strictEqual(inputs.distance.type, "Number", "distance type");
    ASSERT.strictEqual(inputs.geom.type, "Geometry", "geom type");
    
    // TODO: deal with enumerated values
    var capStyle = inputs.capStyle.type;
    ASSERT.ok(capStyle == Packages.org.geotools.process.jts.GeometryFunctions.BufferCapStyle, "capStyle type");
    
    var geom = require("geoscript/geom");
    var point = new geom.Point([1, 2]);
    var outputs = buffer.run({geom: point, distance: 10});
    
    ASSERT.ok(outputs.result instanceof geom.Polygon, "result polygon");
    ASSERT.strictEqual(outputs.result.area.toFixed(3), "312.145", "correct area");
    
}

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
