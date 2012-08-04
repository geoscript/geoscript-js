package org.geoscript.js.geom;

import java.util.Arrays;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;

public class MultiPoint extends GeometryCollection implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 2356613086695997477L;

    public Class<?> restrictedType = Point.class;

    /**
     * Prototype constructor.
     * @return 
     */
    public MultiPoint() {
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public MultiPoint(Scriptable scope, com.vividsolutions.jts.geom.MultiPoint geometry) {
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(MultiPoint.class));
        setGeometry(geometry);
    }

    /**
     * Constructor for coordinate array.
     * @param context
     * @param scope
     * @param array
     */
    public MultiPoint(NativeArray array) {
        super(array);
    }

    public com.vividsolutions.jts.geom.MultiPoint createCollection(com.vividsolutions.jts.geom.Geometry[] geometries) {
        com.vividsolutions.jts.geom.Point[] points = Arrays.copyOf(geometries, geometries.length, com.vividsolutions.jts.geom.Point[].class);
        return new com.vividsolutions.jts.geom.MultiPoint(points, factory);
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
        if (!inNewExpr) {
            throw ScriptRuntime.constructError("Error", "Call constructor with new keyword.");
        }
        MultiPoint collection = null;
        Object arg = args[0];
        if (arg instanceof NativeArray) {
            collection = new MultiPoint((NativeArray) arg);
        } else if (arg instanceof NativeObject) {
            Object coordObj = ((NativeObject) arg).get("coordinates");
            if (coordObj instanceof NativeArray) {
                collection = new MultiPoint((NativeArray) coordObj);
            } else {
                throw ScriptRuntime.constructError("Error", "Config must have coordinates member.");
            }
        } else {
            throw ScriptRuntime.constructError("Error", "Invalid arguments");
        }
        return collection;
    }

    /**
     * Returns underlying JTS geometry.
     */
    public com.vividsolutions.jts.geom.MultiPoint unwrap() {
        return (com.vividsolutions.jts.geom.MultiPoint) getGeometry();
    }

    
}
