package org.geoscript.js.geom;

import java.lang.reflect.Method;

import java.util.Arrays;
import java.util.List;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeJavaMethod;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSGetter;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;

public class Geometry extends ScriptableObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 8771743870215086281L;

    private com.vividsolutions.jts.geom.Geometry geometry;
    
    protected static GeometryFactory factory = new GeometryFactory();

    protected Scriptable scope;

    /**
     * Geometry prototype constructor.
     */
    public Geometry() {
    }
    
    com.vividsolutions.jts.geom.Geometry getGeometry() {
        return geometry;
    }
    
    void setGeometry(com.vividsolutions.jts.geom.Geometry geometry) {
        this.geometry = geometry;
    }
    
    @Override
    public Object get(String name, Scriptable start) {
        Object member = null;
        if (geometry != null) {
            member = getNativeMethod(name);
        }
        if (member == null) {
            member = super.get(name, start);
        }
        return member;
    }
    
    /**
     * Create a JavaScript method from an underlying JTS Geometry method where
     * possible.
     * @param name Method name
     * @return
     */
    NativeJavaMethod getNativeMethod(String name) {
        NativeJavaMethod nativeMethod = null;
        Method method = null;

        List<String> unary = Arrays.asList(
                "isEmpty", "isRectangle", "isSimple", "isValid");

        if (unary.contains(name)) {
            try {
                method = geometry.getClass().getMethod(name);
            } catch (Exception e) {
                throw new RuntimeException("Unable to find method: " + name, e);
            }
        }
        
        List<String> binary = Arrays.asList(
                "contains", "coveredBy", "covers", "crosses", "disjoint", 
                "equals", "equalsExact", "overlaps", "intersects", "touches",
                "within");
        
        if (binary.contains(name)) {
            try {
                method = geometry.getClass().getMethod(name, com.vividsolutions.jts.geom.Geometry.class);
            } catch (Exception e) {
                throw new RuntimeException("Unable to find method: " + name, e);
            }
        }
        
        List<String> constructive0 = Arrays.asList(
                "clone", "convexHull", "getBoundary", "getEnvelope");

        if (constructive0.contains(name)) {
            try {
                method = geometry.getClass().getMethod(name);
            } catch (Exception e) {
                throw new RuntimeException("Unable to find method: " + name, e);
            }
        }
        
        List<String> constructive1 = Arrays.asList(
                "difference", "intersection", "symDifference", "union");

        if (constructive1.contains(name)) {
            try {
                method = geometry.getClass().getMethod(name, com.vividsolutions.jts.geom.Geometry.class);
            } catch (Exception e) {
                throw new RuntimeException("Unable to find method: " + name, e);
            }
        }

        if (method != null) {
            nativeMethod = new NativeJavaMethod(method, name);
        }
        
        return nativeMethod;
    }
    
    @JSGetter
    public double getArea() {
        double area = 0;
        if (geometry != null) {
            area = geometry.getArea();
        }
        return area;
    }

    @JSGetter
    public double getLength() {
        double length = 0;
        if (geometry != null) {
            length = geometry.getLength();
        }
        return length;
    }

    @JSGetter
    public int getDimension() {
        int dimension = 0;
        if (geometry != null) {
            dimension = geometry.getDimension();
        }
        return dimension;
    }

    public Object unwrap() {
        return geometry;
    }

    @Override
    public String getClassName() {
        return getClass().getName();
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
    protected static NativeArray coordToArray(Scriptable scope, Coordinate coord) {
        Context cx = Context.getCurrentContext();
        if (cx == null) {
            throw new RuntimeException("No context associated with current thread.");
        }
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
    
    /**
     * Convert a JTS Coordinate array into a JavaScript array.
     * @param scope
     * @param coords
     * @return
     */
    protected static NativeArray coordsToArray(Scriptable scope, Coordinate[] coords) {
        Context cx = Context.getCurrentContext();
        if (cx == null) {
            throw new RuntimeException("No context associated with current thread.");
        }
        int length = coords.length;
        NativeArray array = (NativeArray) cx.newArray(scope, length);
        for (int i=0; i<length; ++i) {
            array.put(i, array, coordToArray(scope, coords[i]));
        }
        return array;
    }

}
