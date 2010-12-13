var ASSERT = require("assert");
var {Process, callable, chain} = require("geoscript/process");
var defer = require("ringo/promise").defer;

var add = new Process({
    runner: function(values, callback, errback) {
        if (isNaN(values[0]) || isNaN(values[1])) {
            errback("add only accepts numeric values")
        } else {
            callback(values[0] + values[1]);
        }
    }
});
var decrement = new Process({
    runner: function(values, callback, errback) {
        if (values[0] <= 0) {
            errback("decrement only works with positive numbers");
        } else {
            callback(values[0] - 1);
        }
    }
});
var boost = new Process({
    runner: function(values, callback, errback) {
        if (values[0] > 100) {
            errback("boost only works with small numbers");
        } else {
            callback(values[0] * 2);
        }
    }
});


exports["test Process.constructor"] = function() {
    
    var f = new Process();
    ASSERT.ok(f instanceof Process, "constructor returns instance");
    
};

exports["test run"] = function() {
    
    var promise = add.run(2, 3);

    ASSERT.deepEqual(promise.wait(), [5], "correct sum");
    
};

exports["test error"] = function() {
    
    var promise = decrement.run(4);
    ASSERT.deepEqual(promise.wait(), [3], "correct value");

    promise = decrement.run(-2);
    ASSERT.throws(promise.wait, null, "error thrown for negative number");
    
};

exports["test callable"] = function() {
    
    var add = callable({
        runner: function(values, callback, errback) {
            callback(values[0] + values[1]);
        }
    });
    
    var promise = add(2, 3);
    
    ASSERT.deepEqual(promise.wait(), [5], "correctly added");
    
};

exports["test chain(wait)"] = function() {

    var process = chain(add, decrement, boost);

    var promise = process.run(2, 4);
    ASSERT.deepEqual(promise.wait(), [10], "add then decrement then boost");
    
    // add fails
    promise = process.run("foo", 2);
    var result;
    try {
        result = promise.wait();
    } catch (err) {
        ASSERT.deepEqual(err, ["add only accepts numeric values"]);
    }
    if (result) {
        ASSERT.fail("expected add to throw");
    }
    
    // decrement fails
    promise = process.run(-10, 2);
    result = null;
    try {
        result = promise.wait();
    } catch (err) {
        ASSERT.deepEqual(err, ["decrement only works with positive numbers"]);
    }
    if (result) {
        ASSERT.fail("expected decrement to throw");
    }

    // boost fails
    promise = process.run(100, 50);
    result = null;
    try {
        result = promise.wait();
    } catch (err) {
        ASSERT.deepEqual(err, ["boost only works with small numbers"]);
    }
    if (result) {
        ASSERT.fail("expected boost to throw");
    }
    

};

exports["test chain(callbacks)"] = function() {

    var process = chain(add, decrement, boost);
    
    // test then callback
    var promise = process.run(2, 4);

    var done = defer();
    promise.then(function() {
        done.resolve(Array.slice(arguments));
    }, function() {
        done.resolve(Array.slice(arguments), true);
    });
    var value = done.promise.wait();
    ASSERT.deepEqual(value, [10], "then callback called with correct value");

    // test then errback
    promise = process.run(200, 4);

    var done = defer();
    promise.then(function() {
        done.resolve(Array.slice(arguments));
    }, function() {
        done.resolve(Array.slice(arguments), true);
    });
    value = null;
    try {
        value = done.promise.wait();
    } catch (err) {
        ASSERT.deepEqual(err, ["boost only works with small numbers"]);
    }
    if (value) {
        ASSERT.fail("expected boost to throw");
    }
    
};

if (require.main == module.id) {
    require("test").run(exports);
}
