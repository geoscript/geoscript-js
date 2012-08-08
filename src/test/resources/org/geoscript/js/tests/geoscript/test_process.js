var ASSERT = require("assert");
var Process = require("geoscript/process").Process;
var Field = require("geoscript/feature").Field;

var add = new Process({
    run: function(config) {
        var valid = true;
        var sum = 0;
        config.args.forEach(function(v) {
            if (isNaN(v)) {
                valid = false;
            } else {
                sum += v;
            }
            return valid;
        });
        if (!valid) {
            config.errback("add only accepts numeric values")
        } else {
            config.callback(sum);
        }
    }
});
var decrement = new Process({
    run: function(config) {
        var value = config.args[0];
        if (isNaN(value) || value <= 0) {
            config.errback("decrement only works with positive numbers");
        } else {
            config.callback(value - 1);
        }
    }
});
var boost = new Process({
    run: function(config) {
        var value = config.args[0];
        if (isNaN(value) || value > 100) {
            config.errback("boost only works with small numbers");
        } else {
            config.callback(value * 2);
        }
    }
});


exports["test Process.constructor"] = function() {
    
    var f = new Process();
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
        }
    });
    ASSERT.ok(!!p.inputs, "process has inputs property");
    ASSERT.ok(p.inputs.foo instanceof Field, "foo field");
    ASSERT.strictEqual(p.inputs.foo.name, "foo", "foo field named foo");
    ASSERT.strictEqual(p.inputs.foo.type, "Integer", "foo field Integer type");
    ASSERT.ok(p.inputs.bar instanceof Field, "bar field");
    ASSERT.strictEqual(p.inputs.bar.name, "bar", "bar field named bar");
    ASSERT.strictEqual(p.inputs.bar.type, "String", "bar field String type");
};

exports["test inputs(shorthand)"] = function() {
    var p = new Process({
        inputs: {
            foo: "Integer",
            bar: "String"
        }
    });
    ASSERT.ok(!!p.inputs, "process has inputs property");
    ASSERT.ok(p.inputs.foo instanceof Field, "foo field");
    ASSERT.strictEqual(p.inputs.foo.name, "foo", "foo field named foo");
    ASSERT.strictEqual(p.inputs.foo.type, "Integer", "foo field Integer type");
    ASSERT.ok(p.inputs.bar instanceof Field, "bar field");
    ASSERT.strictEqual(p.inputs.bar.name, "bar", "bar field named bar");
    ASSERT.strictEqual(p.inputs.bar.type, "String", "bar field String type");
};

exports["test outputs"] = function() {
    var p = new Process({
        outputs: {
            foo: {
                type: "Integer",
                description: "Foo field."
            },
            bar: {
                type: "String",
                description: "Bar field."
            }
        }
    });
    ASSERT.ok(!!p.outputs, "process has outputs property");
    ASSERT.ok(p.outputs.foo instanceof Field, "foo field");
    ASSERT.strictEqual(p.outputs.foo.name, "foo", "foo field named foo");
    ASSERT.strictEqual(p.outputs.foo.type, "Integer", "foo field Integer type");
    ASSERT.ok(p.outputs.bar instanceof Field, "bar field");
    ASSERT.strictEqual(p.outputs.bar.name, "bar", "bar field named bar");
    ASSERT.strictEqual(p.outputs.bar.type, "String", "bar field String type");
};

exports["test outputs(shorthand)"] = function() {
    var p = new Process({
        outputs: {
            foo: "Integer",
            bar: "String"
        }
    });
    ASSERT.ok(!!p.outputs, "process has outputs property");
    ASSERT.ok(p.outputs.foo instanceof Field, "foo field");
    ASSERT.strictEqual(p.outputs.foo.name, "foo", "foo field named foo");
    ASSERT.strictEqual(p.outputs.foo.type, "Integer", "foo field Integer type");
    ASSERT.ok(p.outputs.bar instanceof Field, "bar field");
    ASSERT.strictEqual(p.outputs.bar.name, "bar", "bar field named bar");
    ASSERT.strictEqual(p.outputs.bar.type, "String", "bar field String type");
};

if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
