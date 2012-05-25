package org.geoscript.js.geom;

import org.mozilla.javascript.NativeArray;

import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;

public class Point extends ScriptableObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 8771743870215086281L;
    
    private com.vividsolutions.jts.geom.Point geometry;
    
    private static GeometryFactory factory = new GeometryFactory();
    
    public Point() {
        geometry = null;
    }
    
    @JSConstructor
    public void constructor(Object arg) {
        NativeArray array;
        Coordinate coord;
        if (arg instanceof NativeArray) {
            array = (NativeArray) arg;
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
            coord = new Coordinate(x, y, z);
            geometry = factory.createPoint(coord);
        }
    }
    
    @JSGetter
    public Object getX() {
        return geometry.getX();
    }

    @JSGetter
    public Object getY() {
        return geometry.getY();
    }

    @JSGetter
    public Object getZ() {
        return geometry.getCoordinate().z;
    }

    public com.vividsolutions.jts.geom.Point unwrap() {
        return geometry;
    }

    @Override
    public String getClassName() {
        return "Point";
    }

}
