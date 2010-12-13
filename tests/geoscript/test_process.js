var ASSERT = require("assert");
var Process = require("geoscript/process").Process;
var callable = require("geoscript/process").callable;

exports["test Process.constructor"] = function() {
    
    var f = new Process();
    ASSERT.ok(f instanceof Process, "constructor returns instance");
    
};

exports["test simple"] = function() {
    
    var add = new Process({
        runner: function(values, callback, errback) {
            callback(values[0] + values[1]);
        }
    });
    
    var promise = add.run([2, 3]);
    var log = [];
    promise.then(function(output) {
        log.push(output);
    });
    promise.wait();
    ASSERT.strictEqual(log.length, 1, "output logged");
    ASSERT.strictEqual(log[0], 5, "correct output logged");
    
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
