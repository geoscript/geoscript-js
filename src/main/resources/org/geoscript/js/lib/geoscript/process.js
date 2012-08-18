require("./feature"); // initialize all modules for values that may be wrapped

Packages.org.geoscript.js.process.Module.init(this);

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


/** api: class = Process */
var Process = exports.Process = this["org.geoscript.js.process.Process"];


    /** api: config[title]
     *  ``String``
     *  Title for the process.
     */
    /** api: property[title]
     *  ``String``
     *  Title for the process.
     */

    /** api: config[description]
     *  ``String``
     *  Full description of the process, including all input and output fields.
     */
    /** api: property[description]
     *  ``String``
     *  Full description of the process, including all input and output fields.
     */


    /** api: config[inputs]
     *  ``Object``
     *  Proces inputs.
     */
    /** api: property[inputs]
     *  ``Object``
     *  Proces inputs.
     */


    /** api: config[outputs]
     *  ``Object``
     *  Proces outputs.
     */
    /** api: property[outputs]
     *  ``Object``
     *  Proces outputs.
     */

    /** api: config[run]
     *  ``Function``
     *  The function to be executed when running the process.
     */

    /** api: constructor
     *  .. class:: Process
     *
     *      :arg config: `Object` Process configuration.
     *
     */

