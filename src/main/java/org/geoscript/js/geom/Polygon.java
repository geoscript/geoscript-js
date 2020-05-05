package org.geoscript.js.geom;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;

import org.locationtech.jts.geom.LinearRing;

public class Polygon extends Geometry implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 2047700235863381036L;

    /**
     * Prototype constructor.
     * @return 
     */
    public Polygon() {
    }

    /**
     * Constructor for config object.
     * @param context
     * @param scope
     * @param array
     */
    public Polygon(NativeObject config) {
        NativeArray array = (NativeArray) config.get("coordinates", config);
        LinearRing shell = factory.createLinearRing(arrayToCoords((NativeArray) array.get(0)));
        int numHoles = array.size() - 1;
        LinearRing[] holes = new LinearRing[numHoles];
        for (int i=0; i<numHoles; ++i) {
            holes[i] = factory.createLinearRing(arrayToCoords((NativeArray) array.get(i+1)));
        }
        setGeometry(factory.createPolygon(shell, holes));
    }
    
    /**
     * Constructor for config object (without new keyword).
     * @param scope
     * @param config
     */
    public Polygon(Scriptable scope, NativeObject config) {
        this(config);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Polygon.class));
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public Polygon(Scriptable scope, org.locationtech.jts.geom.Polygon geometry) {
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Polygon.class));
        setGeometry(geometry);
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
        NativeObject config = prepConfig(cx, (Scriptable) args[0]);
        Polygon poly = null;
        if (inNewExpr) {
            poly = new Polygon(config);
        } else {
            poly = new Polygon(config.getParentScope(), config);
        }
        return poly;
    }

    /**
     * Getter for coordinates
     * @return
     */
    @JSGetter
    public NativeArray getCoordinates() {
        Context cx = getCurrentContext();
        Scriptable scope = getParentScope();
        org.locationtech.jts.geom.Polygon poly = (org.locationtech.jts.geom.Polygon) getGeometry();
        int length = 1 + poly.getNumInteriorRing();
        NativeArray array = (NativeArray) cx.newArray(scope, length);
        array.put(0, array, coordsToArray(poly.getExteriorRing().getCoordinates()));
        for (int i=1; i<length; ++i) {
            array.put(i, array, coordsToArray(poly.getInteriorRingN(i-1).getCoordinates()));
        }
        return array;
    }

    /**
     * Returns underlying JTS geometry.
     */
    public org.locationtech.jts.geom.Polygon unwrap() {
        return (org.locationtech.jts.geom.Polygon) getGeometry();
    }

}
