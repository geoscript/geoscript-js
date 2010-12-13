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
    
    var promise = add([2, 3]);
    
    ASSERT.strictEqual(promise.wait(), 5, "correctly added");
    
};

exports["test chain"] = function() {

    var add = callable({
        runner: function(values, callback, errback) {
            callback(values[0] + values[1]);
        }
    });
    var decrement = callable({
        runner: function(values, callback, errback) {
            callback(values[0] - 1);
        }
    });
    
    var promise = add([2, 4]);
    promise.then(function(value) {
        ASSERT.strictEqual(value, 6, "add first")
        decrement(value).then(function(answer) {
            ASSERT.strictEqual(answer, 5, "decrement next");
        });
    });
    promise.wait();
    
};

if (require.main == module.id) {
    require("test").run(exports);
}
