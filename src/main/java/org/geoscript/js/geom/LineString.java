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
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;

import com.vividsolutions.jts.geom.Coordinate;

public class LineString extends Geometry implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = -5048539260091857410L;

    /**
     * The most recently created prototype.
     */
    static Scriptable prototype;

    /**
     * Prototype constructor.
     * @return 
     */
    public LineString() {
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public LineString(Scriptable scope, com.vividsolutions.jts.geom.LineString geometry) {
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
    public LineString(NativeArray array) {
        int size = array.size();
        Coordinate[] coords = new Coordinate[size];
        for (int i=0; i<size; ++i) {
            Object item = array.get(i);
            if (item instanceof NativeArray) {
                coords[i] = arrayToCoord((NativeArray) item);
            } else if (item instanceof com.vividsolutions.jts.geom.Point) {
                coords[i] = ((com.vividsolutions.jts.geom.Point) item).getCoordinate();
            }
        }
        setGeometry(factory.createLineString(coords));
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
        LineString.prototype = prototype;
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
        LineString line = null;
        Object arg = args[0];
        if (arg instanceof NativeArray) {
            line = new LineString((NativeArray) arg);
        } else if (arg instanceof NativeObject) {
            Object coordObj = ((NativeObject) arg).get("coordinates");
            if (coordObj instanceof NativeArray) {
                line = new LineString((NativeArray) coordObj);
            } else {
                throw ScriptRuntime.constructError("Error", "Config must have coordinates member.");
            }
        } else {
            throw ScriptRuntime.constructError("Error", "Invalid arguments");
        }
        return line;
    }

    /**
     * Getter for coordinates
     * @return
     */
    @JSGetter
    public NativeArray getCoordinates() {
        return coordsToArray(getGeometry().getCoordinates());
    }
    
    @JSGetter
    public Point getEndPoint() {
        com.vividsolutions.jts.geom.Point end = ((com.vividsolutions.jts.geom.LineString) getGeometry()).getEndPoint();
        return new Point(getParentScope(), end);
    }

    @JSGetter
    public Point getStartPoint() {
        com.vividsolutions.jts.geom.Point start = ((com.vividsolutions.jts.geom.LineString) getGeometry()).getStartPoint();
        return new Point(getParentScope(), start);
    }

    @JSGetter
    public NativeArray getEndPoints() {
        Context cx = Context.getCurrentContext();
        if (cx == null) {
            throw new RuntimeException("No context associated with current thread");
        }
        return (NativeArray) cx.newArray(getParentScope(), new Object[] {getStartPoint(), getEndPoint()});
    }
    
    @JSFunction
    public LineString reverse() {
        return (LineString) GeometryWrapper.wrap(getParentScope(), getGeometry().reverse());
    }

    /**
     * Returns underlying JTS geometry.
     */
    public com.vividsolutions.jts.geom.LineString unwrap() {
        return (com.vividsolutions.jts.geom.LineString) getGeometry();
    }

}
