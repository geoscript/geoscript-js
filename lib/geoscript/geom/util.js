var jts = Packages.com.vividsolutions.jts;

/** private: method[create]
 *  :arg config: ``Object`` Configuration object.
 *  :returns: :class:`geom.Geometry`
 *
 *  Create a geometry given a configuration object.
 */

/** private: method[register]
 *
 */

require("../util").createRegistry(exports);

/** api: data[BUFFER_CAP_ROUND]
 *  Used to calculate round caps for buffer operations.
 */
exports.BUFFER_CAP_ROUND = jts.operation.buffer.BufferOp.CAP_ROUND;

/** api: data[BUFFER_CAP_SQUARE]
 *  Used to calculate square caps for buffer operations.
 */
exports.BUFFER_CAP_SQUARE = jts.operation.buffer.BufferOp.CAP_SQUARE;

/** api: data[BUFFER_CAP_BUTT] 
 *  Used to calculate butt caps for buffer operations.
 */
exports.BUFFER_CAP_BUTT = jts.operation.buffer.BufferOp.CAP_BUTT;
