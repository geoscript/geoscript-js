package org.geoscript.js.geom;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;

public class Geometry extends ScriptableObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 8771743870215086281L;

    private com.vividsolutions.jts.geom.Geometry geometry;
    
    protected static GeometryFactory factory = new GeometryFactory();
    
    /**
     * Geometry prototype constructor.
     */
    public Geometry() {
        // prototype
        geometry = null;
    }
    
    public Object unwrap() {
        return geometry;
    }

    @Override
    public String getClassName() {
        return "Geometry";
    }
    
    /**
     * Convert a JavaScript array to a JTS Coordinate.
     * @param array An array of length 2 or 3
     * @return Coordinate with x, y, and optional z value from array
     */
    protected static Coordinate arrayToCoord(NativeArray array) {
        double x = Double.NaN;
        double y = Double.NaN;
        double z = Double.NaN;
        if (array.size() >= 2) {
            Object xObj = array.get(0);
            if (xObj instanceof Number) {
                x = ((Number) xObj).doubleValue();
            }
            Object yObj = array.get(1);
            if (yObj instanceof Number) {
                y = ((Number) yObj).doubleValue();
            }
        } 
        if (array.size() > 2) {
            Object zObj = array.get(2);
            if (zObj instanceof Number) {
                z = ((Number) zObj).doubleValue();
            }
        }
        Coordinate coord = new Coordinate(x, y, z);
        return coord;
    }
    
    /**
     * Convert a JTS Coordinate into a JavaScript array.
     * @param cx
     * @param scope
     * @param coord
     * @return
     */
    protected static NativeArray coordToArray(Context cx, Scriptable scope, Coordinate coord) {
        Object[] elements = new Object[] {
                coord.x, coord.y
        };
        NativeArray array = (NativeArray) cx.newArray(scope, elements);
        double z = coord.z;
        if (!Double.isNaN(z)) {
            array.put(2, array, z);
        }
        return array;
    }

}
