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
import org.mozilla.javascript.annotations.JSGetter;

public class MultiLineString extends GeometryCollection implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = -4988339189326884593L;

    public Class<?> restrictedType = LineString.class;

    /**
     * Prototype constructor.
     * @return 
     */
    public MultiLineString() {
    }

    /**
     * Constructor for coordinate array.
     * @param context
     * @param scope
     * @param array
     */
    public MultiLineString(NativeArray array) {
        super(array);
    }
    

    /**
     * Constructor for coordinate array (without new keyword).
     * @param scope
     * @param array
     */
    public MultiLineString(Scriptable scope, NativeArray array) {
        this(array);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(MultiLineString.class));
    }

    /**
     * Constructor for config object.
     * @param config
     */
    public MultiLineString(NativeObject config) {
        super(getCoordinatesArray(config));
    }
    
    /**
     * Constructor for config object (without new keyword);
     * @param scope
     * @param config
     */
    public MultiLineString(Scriptable scope, NativeObject config) {
        this(config);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(MultiPoint.class));
    }


    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public MultiLineString(Scriptable scope, com.vividsolutions.jts.geom.MultiLineString geometry) {
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(MultiLineString.class));
        setGeometry(geometry);
    }

    public com.vividsolutions.jts.geom.MultiLineString createCollection(com.vividsolutions.jts.geom.Geometry[] geometries) {
        com.vividsolutions.jts.geom.LineString[] lines = Arrays.copyOf(geometries, geometries.length, com.vividsolutions.jts.geom.LineString[].class);
        return new com.vividsolutions.jts.geom.MultiLineString(lines, factory);
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
            throw ScriptRuntime.constructError("Error", "Constructor takes a single argument");
        }
        MultiLineString collection = null;
        NativeArray array = getCoordinatesArray(args[0]);
        if (inNewExpr) {
            collection = new MultiLineString(array);
        } else {
            collection = new MultiLineString(array.getParentScope(), array);
        }
        return collection;
    }
    
    @JSGetter
    public NativeArray getEndPoints() {
        Context cx = getCurrentContext();
        NativeArray components = getComponents();
        int size = components.size();
        Scriptable scope = getParentScope();
        NativeArray array = (NativeArray) cx.newArray(scope, 2*size);
        for (int i=0; i<size; ++i) {
            com.vividsolutions.jts.geom.LineString geom = (com.vividsolutions.jts.geom.LineString) components.get(i);
            LineString line = (LineString) GeometryWrapper.wrap(scope, geom);
            array.put(2*i, array, line.getStartPoint());
            array.put((2*i)+1, array, line.getEndPoint());
        }
        return array;
    }

    /**
     * Returns underlying JTS geometry.
     */
    public com.vividsolutions.jts.geom.MultiLineString unwrap() {
        return (com.vividsolutions.jts.geom.MultiLineString) getGeometry();
    }

}
