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

var UTIL = require("./util");

/** api: class = Cursor */
var Cursor = UTIL.extend(Object, {
    
    _cursor: null,
    
    _cast: null,
    
    /** api: [index]
     *  The index of the most recently read result.  This is intialized as
     *  ``-1`` and is incremented with each result read.
     */
    index: -1,
    
    /** api: [property]
     *  ``Object``
     *  The most recently read object in the collection.  This will be ``null``
     *  if no results have been read or if the cursor has been exhausted.
     */
    current: null,
    
    /** api: constructor
     *  .. class:: Cursor
     *
     *      A cursor will not generally need to be created.  Instead, cursors
     *      are returned when querying features from a layer.
     */
    constructor: function(_cursor, _cast) {
        this._cursor = _cursor;
        this._cast = _cast;
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
        } catch (err) {
            has = false;
        }
        if (!has) {
            this.close();
        }
        return has;
    },

    /** api: method[next]
     *  :return: ``Object`` The next result.
     *
     *  Retrieve the next result in the results set.  If no more results are
     *  available, `undefined` will be returned.
     */
    next: function() {
        var results = this.read(1);
        return results[0];
    },
    
    /** api: method[read]
     *  :arg len: ``Number`` Number of results to read.
     *  :returns: ``Array`` An array of results.
     *
     *  Read the next number of results.  The length of the resulting array
     *  will be shorter than the given number in cases where the cursor is
     *  exhausted of results before the given number is reached.
     */
    read: function(len) {
        var _result, results = [];
        for (var i=0; i<len; ++i) {
            if (this.hasNext()) {
                _result = this._cursor.next();                
            } else {
                break;
            }
            ++this.index;
            this.current = this._cast(_result);
            results.push(this.current);
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
            if (this.hasNext()) {
                this._cursor.next();
            } else {
                break;
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
        this.current = null;
        this._cursor.close();
    }
    
});

exports.Cursor = Cursor;
