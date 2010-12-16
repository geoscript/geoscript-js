var ASSERT = require("assert");
var {Process, callable, chain} = require("geoscript/process");
var defer = require("ringo/promise").defer;

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

exports["test run"] = function() {
    
    var results, err;

    add.run({
        args: [2, 3, 4],
        callback: function() {
            results = Array.slice(arguments);
        },
        errback: function() {
            err = arguments[0];
        }
    });

    ASSERT.isTrue(!err, "no error");
    ASSERT.deepEqual(results, [9], "correct sum");

    results = null;
    err = null;
    add.run({
        args: [2, "foo", 4],
        callback: function() {
            results = Array.slice(arguments);
        },
        errback: function() {
            err = arguments[0];
        }
    });

    ASSERT.deepEqual(err, "add only accepts numeric values", "errback called with message");
    ASSERT.deepEqual(results, null, "callback not called");
    
};

exports["test callable"] = function() {
    
    var add = callable({
        run: function(config) {
            config.callback({result: config.args[0] + config.args[1]});
        }
    });
    
    var results;
    add({
        args: [2, 3],
        callback: function() {
            results = arguments[0];
        }
    });
    
    ASSERT.deepEqual(results.result, 5, "correctly added");
    
};

exports["test chain"] = function() {

    var process = chain(add, decrement, boost);

    var results, err;
    process.run({
        args: [2, 4],
        callback: function() {
            results = Array.slice(arguments);
        }, 
        errback: function() {
            err = arguments[0];
        }
    });

    ASSERT.isTrue(!err, "no error");
    ASSERT.deepEqual(results, [10], "add then decrement then boost");
    
    // add fails
    
    results = null;
    err = null;
    process.run({
        args: ["foo", 4],
        callback: function() {
            results = Array.slice(arguments);
        }, 
        errback: function() {
            err = arguments[0];
        }
    });
    ASSERT.isTrue(!results, "callback not called if add fails");
    ASSERT.deepEqual(err, "add only accepts numeric values");
    
    // decrement fails
    results = null;
    err = null;
    process.run({
        args: [-10, 4],
        callback: function() {
            results = Array.slice(arguments);
        }, 
        errback: function() {
            err = arguments[0];
        }
    });
    ASSERT.isTrue(!results, "callback not called if decrement fails");
    ASSERT.deepEqual(err, "decrement only works with positive numbers");

    // boost fails
    results = null;
    err = null;
    process.run({
        args: [100, 50],
        callback: function() {
            results = Array.slice(arguments);
        }, 
        errback: function() {
            err = arguments[0];
        }
    });
    ASSERT.isTrue(!results, "callback not called if boost fails");
    ASSERT.deepEqual(err, "boost only works with small numbers");

};

if (require.main == module.id) {
    require("test").run(exports);
}
