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

import org.locationtech.jts.geom.Coordinate;

public class Point extends Geometry implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 8771743870215086281L;
    
    /**
     * Prototype constructor.
     * @return 
     */
    public Point() {
    }
    
    /**
     * Constructor for config object.
     * @param prepConfig
     */
    public Point(NativeObject config) {
        NativeArray array = (NativeArray) config.get("coordinates", config);
        Coordinate coord = arrayToCoord(array);
        setGeometry(factory.createPoint(coord));
    }

    /**
     * Constructor for config object (without new keyword).
     * @param scope
     * @param config
     */
    public Point(Scriptable scope, NativeObject config) {
        this(config);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Point.class));
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public Point(Scriptable scope, org.locationtech.jts.geom.Point geometry) {
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Point.class));
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
            throw ScriptRuntime.constructError("Error", "Point constructor takes a single argument");
        }
        NativeObject config = prepConfig(cx, (Scriptable) args[0]);
        Point point = null;
        if (inNewExpr) {
            point = new Point(config);
        } else {
            point = new Point(config.getParentScope(), config);
        }
        return point;
    }
    
    /**
     * Getter for point.x
     * @return
     */
    @JSGetter
    public Object getX() {
        return ((org.locationtech.jts.geom.Point) getGeometry()).getX();
    }

    /**
     * Getter for point.y
     * @return
     */
    @JSGetter
    public Object getY() {
        return ((org.locationtech.jts.geom.Point) getGeometry()).getY();
    }

    /**
     * Getter for point.z
     * @return
     */
    @JSGetter
    public Object getZ() {
        return getGeometry().getCoordinate().z;
    }
    
    @Override
    public Object get(int index, Scriptable start) {
        Object member;
        switch (index) {
        case 0:
            member = getX();
            break;
        case 1:
            member = getY();
            break;
        case 2:
            member = getZ();
            break;
        default:
            member = super.get(index, start);
        }
        return member;
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
    public org.locationtech.jts.geom.Point unwrap() {
        return (org.locationtech.jts.geom.Point) getGeometry();
    }

}
