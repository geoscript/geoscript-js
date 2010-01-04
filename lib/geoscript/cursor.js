/** api: module = cursor */

/** api: synopsis
 *  Cursor related functionality.
 */

/** api: summary
 *  The :mod:`cursor` module provides a constructor for Cursor objects.
 *
 *  .. code-block:: javascript
 *  
 *      js> var CURSOR = require("geoscript/cursor");
 */

var util = require("geoscript/util");

/** api: class = Cursor */
var Cursor = util.extend(Object, {
    
    _cursor: null,
    
    _cast: null,
    
    index: null,
    
    /** api: constructor
     *  .. class:: Cursor
     *
     *      A cursor will not generally need to be created.  Instead, cursors
     *      are returned when querying features from a layer.
     */
    constructor: function(_cursor, _cast) {
        this._cursor = _cursor;
        this._cast = _cast;
        this.index = 0;
    },
    
    /** api: method[hasNext]
     *  :returns: ``Boolean``
     *
     *  Determine whether there are more results to retrieve.
     */
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

    /** api: method[next]
     *  :return: ``Object`` The next result.
     *
     *  Retrieve the next result in the results set.  If no more results are
     *  available, `undefined` will be returned.
     */
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
    
    /** api: method[skip]
     *  :arg skip: ``Number`` Number of results to skip.
     *  :return: :class:`cursor.Cursor` This cursor.
     *
     *  Advance the cursor to skip the given number of results.
     */
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

    /** api: method[forEach]
     *  :arg func: ``Function``
     *  :arg scope: ``Object`` If provided, the function will be called as if
     *      it were a method of this object.
     *
     *  Call a function with each result in the results set.  If the function
     *  explicitly returns `false`, the iteration will stop.
     *
     *  .. note::
     *  
     *      Client code should call :meth:`close` if the cursor is not exhausted
     *      by calling :meth:`next` or :meth:`forEach`.
     */
    forEach: function(func, scope) {
        var i=0, ret;
        while (this.hasNext()) {
            ret = func.call(scope, this.next(), i);
            ++i;
            if (ret === false) {
                break;
            }
        }
    },

    /** api: method[close]
     *
     *  Close access to this cursor.  This method should be called if the cursor
     *  is not exhausted by calling :meth:`next` or :meth:`forEach`.
     */ 
    close: function() {
        this._cursor.close();
    }
    
});

exports.Cursor = Cursor;
