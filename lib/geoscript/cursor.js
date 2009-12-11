var util = require("geoscript/util");

var Cursor = util.extend(Object, {
    
    _cursor: null,
    
    _cast: null,
    
    index: null,
    
    constructor: function(_cursor, _cast) {
        this._cursor = _cursor;
        this._cast = _cast;
        this.index = 0;
    },
    
    hasNext: function() {
        var has;
        try {
            has = this._cursor.hasNext();
            if (!has) {
                this._cursor.close();
            }
        } catch (err) {
            has = false;
        }
        return has;
    },

    next: function(len) {
        var list = (len >= 1);
        len = len || 1;
        var _result, results = [];
        for (var i=0; i<len; ++i) {
            try {
                _result = this._cursor.next();
            } catch (err) {
                // instead of `throw StopIteration`
                break;
            }
            ++this.index;
            results.push(this._cast(_result))
        }
        if (!list) {
            results = results[0];
        }
        return results;
    },
    
    skip: function(offset) {
        for (var i=0; i<offset; ++i) {
            try {
                this._cursor.next();
            } catch (err) {
                this.close();
                throw StopIteration;
            }
            ++this.index;
        }
        return this;
    },

    forEach: function(func, scope) {
        var i=0;
        while (this.hasNext()) {
            func.call(scope, this.next(), i);
            ++i;
        }
    },

    close: function() {
        this._cursor.close();
    }
    
});

exports.Cursor = Cursor;
