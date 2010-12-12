/** api: module = process */

/** api: synopsis
 *  Process related functionality.
 */

/** api: summary
 *  The :mod:`process` module provides a constructor for Process objects.
 *
 *  .. code-block:: javascript
 *  
 *      js> var PROCESS = require("geoscript/process");
 */

var UTIL = require("./util");
var Registry = require("./registry").Registry;
var Factory = require("./factory").Factory;
var Field = require("./feature").Field;
var apply = require("./util").apply;
var defer = require("ringo/promise").defer;

/** api: class = Process */
var Process = exports.Process = UTIL.extend(Object, {

    /** api: config[title]
     *  ``String``
     *  Title for the process.
     */
    /** api: property[title]
     *  ``String``
     *  Title for the process.
     */
    title: null,

    /** api: config[description]
     *  ``String``
     *  Full description of the process, including all input and output fields.
     */
    /** api: property[description]
     *  ``String``
     *  Full description of the process, including all input and output fields.
     */
    description: null,

    /** api: config[inputs]
     *  ``Array``
     *  List of input fields for the process.
     */
    /** api: property[inputs]
     *  ``Array``
     *  List of input fields for the process.
     */
    inputs: null,

    /** api: config[outputs]
     *  ``Array``
     *  List of output fields for the process.
     */
    /** api: property[outputs]
     *  ``Array``
     *  List of output fields for the process.
     */
    outputs: null,

    /** api: config[runner]
     *  ``Function``
     *  The function to be executed when running the process.
     */
    runner: null,

    /** api: constructor
     *  .. class:: Process
     *
     *      :arg config: `Object` Process configuration.
     *
     */
    constructor: function Process(config) {
        if (config) {
            // apply all config properties
            apply(this, config);
            // configure inputs
            this.inputs = (this.inputs || []).map(function(field) {
                return (field instanceof Field) ? field : new Field(field);
            });
            // configure outputs
            this.outputs = (this.outputs || []).map(function(field) {
                return (field instanceof Field) ? field : new Field(field);
            });
        }        
    },
    
    /** api: method[run]
     *  :arg values: ``Array`` List of input values.
     *  :returns: ``Object``  Returns a promise object with ``then`` and 
     *      ``wait`` methods.
     *
     *  Run the process.
     */
    run: function(values) {
        var response = defer();
        var promise = response.promise;
        function callback(outputs) {
            response.resolve(outputs);
        }
        function errback() {
            // set isError true
            response.resolve(Array.slice(arguments).concat(true));
        }
        this.runner(values, callback, errback);
        return promise;
    }
    
});
