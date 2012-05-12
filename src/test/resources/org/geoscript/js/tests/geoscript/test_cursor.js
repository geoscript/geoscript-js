var ASSERT = require("assert");
var CURSOR = require("geoscript/cursor");

exports["test: Cursor.constructor"] = function() {

    var c = new CURSOR.Cursor({});
    ASSERT.ok(c instanceof CURSOR.Cursor, "instanceof CURSOR.Cursor");

};

exports["test: Cursor.close"] = function() {

    var count = 0;

    var c = new CURSOR.Cursor({
        open: function() {
            return {
                close: function() {
                    ++count;
                },
                hasNext: function() {
                    return true;
                }
            };
        }
    });
    
    ASSERT.strictEqual(c.hasNext(), true, "cursor hasNext");
    
    c.close();
    ASSERT.strictEqual(count, 1, "close called once");
    
    c.close();
    ASSERT.strictEqual(count, 1, "close not called twice");

};


if (require.main == module.id) {
    system.exit(require("test").run(exports));
}
