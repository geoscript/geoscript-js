package org.geoscript.js.geom;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

import org.geoscript.js.GeoObject;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeJavaMethod;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSGetter;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;

public class Geometry extends GeoObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 8771743870215086281L;

    private com.vividsolutions.jts.geom.Geometry geometry;
    
    protected static GeometryFactory factory = new GeometryFactory();

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
    
    @JSGetter
    public Scriptable getConfig() {
        Scriptable obj = super.getConfig();
        obj.put("coordinates", obj, getCoordinates());
        return obj;
    }

    @JSGetter
    public NativeArray getCoordinates() {
        return null;
    }

    public Object unwrap() {
        return geometry;
    }

    /**
     * Convert a JavaScript array to an array of JTS Coordinates.
     * @param array An array of 2 or 3 element arrays.
     * @return
     */
    protected Coordinate[] arrayToCoords(NativeArray array) {
        int size = array.size();
        Coordinate[] coords = new Coordinate[size];
        for (int i=0; i<size; ++i) {
            coords[i] = arrayToCoord((NativeArray) array.get(i));
        }
        return coords;
    }
    
    /**
     * Convert a JavaScript array to a JTS Coordinate.
     * @param array An array of length 2 or 3
     * @return Coordinate with x, y, and optional z value from array
     */
    protected Coordinate arrayToCoord(NativeArray array) {
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
    protected NativeArray coordToArray(Coordinate coord) {
        Scriptable scope = getParentScope();
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
    protected NativeArray coordsToArray(Coordinate[] coords) {
        Scriptable scope = getParentScope();
        Context cx = Context.getCurrentContext();
        if (cx == null) {
            throw new RuntimeException("No context associated with current thread.");
        }
        int length = coords.length;
        NativeArray array = (NativeArray) cx.newArray(scope, length);
        for (int i=0; i<length; ++i) {
            array.put(i, array, coordToArray(coords[i]));
        }
        return array;
    }

}
