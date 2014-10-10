package org.geoscript.js.geom;

import com.vividsolutions.jts.geom.Coordinate;
import org.geotools.geometry.jts.CurvedGeometryFactory;
import org.mozilla.javascript.*;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;

import java.util.ArrayList;
import java.util.List;

public class CircularString extends LineString implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = -5048539260091857410L;

    /**
     * Prototype constructor.
     * @return
     */
    public CircularString() {
    }

    /**
     * Constructor for config object.
     * @param config
     */
    public CircularString(NativeObject config) {
        NativeArray array = (NativeArray) config.get("coordinates", config);
        double tolerance = config.has("tolerance", config) ? (Double) config.get("tolerance", config) : Double.MAX_VALUE;
        Coordinate[] coords = arrayToCoords(array);
        setGeometry(createCircularString(coords, tolerance));
    }

    /**
     * Constructor for config object (without new keyword).
     * @param scope
     * @param config
     */
    public CircularString(Scriptable scope, NativeObject config) {
        this(config);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(CircularString.class));
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public CircularString(Scriptable scope, org.geotools.geometry.jts.CircularString geometry) {
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(CircularString.class));
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
            throw ScriptRuntime.constructError("Error", "CircularString constructor takes a single argument");
        }
        NativeObject config = prepConfig(cx, (Scriptable) args[0]);
        CircularString line = null;
        if (inNewExpr) {
            line = new CircularString(config);
        } else {
            line = new CircularString(config.getParentScope(), config);
        }
        return line;
    }

    /**
     * Create a CircularString from an array of Coordinates and a tolerance used to linearize the curve.
     * @param coords The Array of Coordinates
     * @param tolerance The tolerance used to linearize the curve
     * @return A CircularString
     */
    private com.vividsolutions.jts.geom.Geometry createCircularString(Coordinate[] coords, double tolerance) {
        CurvedGeometryFactory factory = new CurvedGeometryFactory(tolerance);
        double[] values = new double[coords.length * 2];
        for(int i = 0; i < coords.length; i++) {
            int c = i * 2;
            values[c] = coords[i].x;
            values[c + 1] = coords[i].y;
        }
        return new org.geotools.geometry.jts.CircularString(values, factory, tolerance);
    }

    /**
     * Get the curved WKT
     * @return The curved WKT
     */
    @JSGetter
    public String getCurvedWkt() {
        return ((org.geotools.geometry.jts.CircularString)getGeometry()).toCurvedText();
    }

    /**
     * Get the original control Points (not the linearized Points)
     * @return The original control Points
     */
    @JSGetter
    public NativeArray getControlPoints() {
        Context cx = getCurrentContext();
        List<Point> points = new ArrayList<>();
        org.geotools.geometry.jts.CircularString cs = (org.geotools.geometry.jts.CircularString)getGeometry();
        double[] cp = cs.getControlPoints();
        for(int i=0; i<cp.length; i=i+2) {
            Point pt = new Point(getParentScope(), factory.createPoint(new Coordinate(cp[i], cp[i+1])));
            points.add(pt);
        }
        return (NativeArray) cx.newArray(getParentScope(), points.toArray());
    }

    /**
     * Get the linearized Geometry
     * @return The linearized Geometry
     */
    @JSGetter
    public Geometry getLinear() {
        org.geotools.geometry.jts.CircularString cs = (org.geotools.geometry.jts.CircularString)getGeometry();
        return (Geometry) GeometryWrapper.wrap(getParentScope(), cs.linearize());
    }

    /**
     * Returns underlying JTS geometry.
     */
    public org.geotools.geometry.jts.CircularString unwrap() {
        return (org.geotools.geometry.jts.CircularString) getGeometry();
    }

}
