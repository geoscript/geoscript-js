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
var applyIf = require("./util").applyIf;

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
    run: null,

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
    }

});

var callable = exports.callable = function(config) {
    var process = new Process(config);
    return function() {
        return process.run.apply(process, arguments);
    };
};

var chain = exports.chain = function() {
    var processes = Array.slice(arguments);
    var length = processes.length;

    function wrapRunner(index) {
        var process = processes[index];
        var run;
        if (index < length-1) {
            run = function(config) {
                process.run(
                    applyIf({
                        callback: function() {
                            wrapRunner(index+1)(
                                applyIf({args: Array.slice(arguments)}, config)
                            );
                        }
                    }, config)
                );
            };
        } else {
            run = function(config) {
                process.run(config);
            };
        }
        return run;
    }
        
    return new Process({
        title: "Chained Process: " + processes.map(function(p) {return p.title;}).join(", "),
        inputs: processes[0].inputs,
        outputs: processes[length-1].outputs,
        run: wrapRunner(0)
    });
};
