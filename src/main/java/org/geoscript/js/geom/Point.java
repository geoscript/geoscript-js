package org.geoscript.js.geom;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.FunctionObject;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;

import com.vividsolutions.jts.geom.Coordinate;

public class Point extends Geometry implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 8771743870215086281L;
    
    /**
     * The most recently created prototype.
     */
    static Scriptable prototype;
    
    /**
     * Prototype constructor.
     * @return 
     */
    public Point() {
    }
    
    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public Point(Scriptable scope, com.vividsolutions.jts.geom.Point geometry) {
        if (prototype == null) {
            throw new RuntimeException("Prototype has not yet been set up by calling require('geoscript/geom') from a module");
        }
        this.setParentScope(scope);
        this.setPrototype(prototype);
        setGeometry(geometry);
    }
    
    /**
     * Constructor for coordinate array.
     * @param context
     * @param scope
     * @param array
     */
    public Point(NativeArray array) {
        Coordinate coord = arrayToCoord(array);
        setGeometry(factory.createPoint(coord));
    }

    /**
     * Finishes JavaScript constructor initialization.
     * 
     * @param scope
     * @param ctor
     * @param prototype
     */
    public static void finishInit(Scriptable scope, FunctionObject ctor, Scriptable prototype) {
        Point.prototype = prototype;
    }
    
    /**
     * JavaScript constructor.
     * @param cx
     * @param args
     * @param ctorObj
     * @param inNewExpr
     * @return
     */
    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        Point point = null;
        Object arg = args[0];
        if (arg instanceof NativeArray) {
            point = new Point((NativeArray) arg);
        } else if (arg instanceof NativeObject) {
            Object coordObj = ((NativeObject) arg).get("coordinates");
            if (coordObj instanceof NativeArray) {
                point = new Point((NativeArray) coordObj);
            } else {
                throw ScriptRuntime.constructError("Error", "Config must have coordinates member.");
            }
        } else {
            throw ScriptRuntime.constructError("Error", "Requires an array of coordinate values.");
        }
        return point;
    }
    
    /**
     * Getter for point.x
     * @return
     */
    @JSGetter
    public Object getX() {
        return ((com.vividsolutions.jts.geom.Point) getGeometry()).getX();
    }

    /**
     * Getter for point[0]
     * @return
     */
    @JSGetter
    public Object get0() {
        return getX();
    }

    /**
     * Getter for point.y
     * @return
     */
    @JSGetter
    public Object getY() {
        return ((com.vividsolutions.jts.geom.Point) getGeometry()).getY();
    }

    /**
     * Getter for point.z
     * @return
     */
    @JSGetter
    public Object getZ() {
        return getGeometry().getCoordinate().z;
    }
    
    /**
     * Getter for coordinates
     * @return
     */
    @JSGetter
    public NativeArray getCoordinates() {
        return coordToArray(getGeometry().getCoordinate());
    }

    /**
     * Returns underlying JTS geometry.
     */
    public com.vividsolutions.jts.geom.Point unwrap() {
        return (com.vividsolutions.jts.geom.Point) getGeometry();
    }

}
