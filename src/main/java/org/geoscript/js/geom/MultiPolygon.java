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
     * Constructor for coordinate array.
     * @param context
     * @param scope
     * @param array
     */
    public MultiPolygon(NativeArray array) {
        super(array);
    }
    
    /**
     * Constructor for coordinate array (without new keyword).
     * @param scope
     * @param array
     */
    public MultiPolygon(Scriptable scope, NativeArray array) {
        this(array);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(MultiPolygon.class));
    }

    /**
     * Constructor for config object.
     * @param config
     */
    public MultiPolygon(NativeObject config) {
        super(getCoordinatesArray(config));
    }
    
    /**
     * Constructor for config object (without new keyword);
     * @param scope
     * @param config
     */
    public MultiPolygon(Scriptable scope, NativeObject config) {
        this(config);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(MultiPoint.class));
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public MultiPolygon(Scriptable scope, org.locationtech.jts.geom.MultiPolygon geometry) {
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(MultiPolygon.class));
        setGeometry(geometry);
    }

    public org.locationtech.jts.geom.MultiPolygon createCollection(org.locationtech.jts.geom.Geometry[] geometries) {
        org.locationtech.jts.geom.Polygon[] polys = Arrays.copyOf(geometries, geometries.length, org.locationtech.jts.geom.Polygon[].class);
        return new org.locationtech.jts.geom.MultiPolygon(polys, factory);
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
        if (args.length != 1) {
            throw ScriptRuntime.constructError("Error", "MultiPolygon constructor takes a single argument");
        }
        MultiPolygon collection = null;
        NativeArray array = getCoordinatesArray(args[0]);
        if (inNewExpr) {
            collection = new MultiPolygon(array);
        } else {
            collection = new MultiPolygon(array.getParentScope(), array);
        }
        return collection;
    }

    /**
     * Returns underlying JTS geometry.
     */
    public org.locationtech.jts.geom.MultiPolygon unwrap() {
        return (org.locationtech.jts.geom.MultiPolygon) getGeometry();
    }

}
