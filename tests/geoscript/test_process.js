var ASSERT = require("assert");
var Process = require("geoscript/process").Process;

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


if (require.main == module.id) {
    require("test").run(exports);
}
