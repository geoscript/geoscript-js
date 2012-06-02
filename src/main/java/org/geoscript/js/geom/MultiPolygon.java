package org.geoscript.js.geom;

import java.util.Arrays;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.FunctionObject;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;

public class MultiPolygon extends GeometryCollection implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 250567051943372945L;

    public Class<?> restrictedType = Polygon.class;

    /**
     * Prototype constructor.
     * @return 
     */
    public MultiPolygon() {
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public MultiPolygon(Scriptable scope, com.vividsolutions.jts.geom.MultiPolygon geometry) {
        this.setParentScope(scope);
        this.setPrototype(getOrCreatePrototype(scope, getClass()));
        setGeometry(geometry);
    }

    /**
     * Constructor for coordinate array.
     * @param context
     * @param scope
     * @param array
     */
    public MultiPolygon(NativeArray array) {
        super(array);
    }

    public com.vividsolutions.jts.geom.MultiPolygon createCollection(com.vividsolutions.jts.geom.Geometry[] geometries) {
        com.vividsolutions.jts.geom.Polygon[] polys = Arrays.copyOf(geometries, geometries.length, com.vividsolutions.jts.geom.Polygon[].class);
        return new com.vividsolutions.jts.geom.MultiPolygon(polys, factory);
    }

    /**
     * Finishes JavaScript constructor initialization.  
     * Sets up the prototype chain using superclass.
     * 
     * @param scope
     * @param ctor
     * @param prototype
     */
    public static void finishInit(Scriptable scope, FunctionObject ctor, Scriptable prototype) {
        prototype.setPrototype(getOrCreatePrototype(scope, GeometryCollection.class));
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
        MultiPolygon collection = null;
        Object arg = args[0];
        if (arg instanceof NativeArray) {
            collection = new MultiPolygon((NativeArray) arg);
        }
        return collection;
    }

    /**
     * Returns underlying JTS geometry.
     */
    public com.vividsolutions.jts.geom.MultiPolygon unwrap() {
        return (com.vividsolutions.jts.geom.MultiPolygon) getGeometry();
    }

}
