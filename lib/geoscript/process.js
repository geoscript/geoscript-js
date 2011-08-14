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
var GeoObject = require("./object").GeoObject;
var Registry = require("./registry").Registry;
var Factory = require("./factory").Factory;
var Field = require("./feature").Field;

/** api: class = Process */
var Process = exports.Process = UTIL.extend(GeoObject, {

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
     *  ``Object``
     *  Proces inputs.
     */
    /** api: property[inputs]
     *  ``Object``
     *  Proces inputs.
     */
    inputs: null,

    /** api: config[outputs]
     *  ``Object``
     *  Proces outputs.
     */
    /** api: property[outputs]
     *  ``Object``
     *  Proces outputs.
     */
    outputs: null,

    /** api: config[run]
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
            UTIL.apply(this, config);
            // configure inputs
            var field;
            for (var key in config.inputs) {
                field = config.inputs[key];
                if (typeof field === "string") {
                    field = {type: field};
                }
                this.inputs[key] = (field instanceof Field) ? field : new Field(UTIL.apply(field, {name: key}));
            };
            // configure outputs
            for (var key in config.outputs) {
                field = config.outputs[key];
                if (typeof field === "string") {
                    field = {type: field};
                }
                this.outputs[key] = (field instanceof Field) ? field : new Field(UTIL.apply(field, {name: key}));
            };
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
                    UTIL.applyIf({
                        callback: function() {
                            wrapRunner(index+1)(
                                UTIL.applyIf({args: Array.slice(arguments)}, config)
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
