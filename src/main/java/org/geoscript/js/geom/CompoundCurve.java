package org.geoscript.js.geom;

import org.geoscript.js.io.JSON;
import org.geotools.geometry.jts.CurvedGeometryFactory;
import org.mozilla.javascript.*;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;

import java.util.ArrayList;
import java.util.List;

public class CompoundCurve extends LineString implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = -5048539260091857410L;

    /**
     * Prototype constructor.
     * @return
     */
    public CompoundCurve() {
    }

    /**
     * Constructor for coordinate array.
     * @param array
     */
    public CompoundCurve(NativeArray array) {
        double tolerance = Double.MAX_VALUE;
        setGeometry(curveFromArray(array, tolerance));
    }

    /**
     * Constructor from array (without new keyword).
     * @param scope
     * @param array
     */
    public CompoundCurve(Scriptable scope, NativeArray array) {
        this(array);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(CompoundCurve.class));
    }

    /**
     * Constructor from config object.
     * @param config
     */
    public CompoundCurve(NativeObject config) {
        double tolerance = config.has("tolerance", config)
                ? Double.valueOf(config.get("tolerance", config).toString()) : Double.MAX_VALUE;
        NativeArray array = (NativeArray) getRequiredMember(config, "geometries", NativeArray.class, "Array");
        setGeometry(curveFromArray(array, tolerance));
    }

    /**
     * Constructor from config object (without new keyword).
     * @param scope
     * @param config
     */
    public CompoundCurve(Scriptable scope, NativeObject config) {
        this(config);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(CompoundCurve.class));
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public CompoundCurve(Scriptable scope, org.geotools.geometry.jts.CompoundCurve geometry) {
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(CompoundCurve.class));
        setGeometry(geometry);
    }

    /**
     * Create a JTS geometry collection from a JS array
     * @param array
     * @return
     */
    private org.geotools.geometry.jts.CompoundCurve curveFromArray(NativeArray array, double tolerance) {
        Scriptable scope = array.getParentScope();
        Context context = getCurrentContext();
        int numComponents = array.size();
        List<com.vividsolutions.jts.geom.LineString> lines =  new ArrayList<com.vividsolutions.jts.geom.LineString>();
        for (int i=0; i<numComponents; ++i) {
            Object obj = array.get(i);
            if (obj instanceof com.vividsolutions.jts.geom.LineString) {
                lines.add((com.vividsolutions.jts.geom.LineString) obj);
            } else if (obj instanceof NativeObject) {
                Geometry geomObj = (Geometry) JSON.readObj((NativeObject) obj);
                lines.add((com.vividsolutions.jts.geom.LineString) geomObj.unwrap());
            } else if (obj instanceof LineString) {
                lines.add((com.vividsolutions.jts.geom.LineString) ((Geometry)obj).unwrap());
            }
        }
        CurvedGeometryFactory factory = new CurvedGeometryFactory(tolerance);
        return new org.geotools.geometry.jts.CompoundCurve(lines, factory, tolerance);
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
            throw ScriptRuntime.constructError("Error", "CompoundCurve constructor takes a single argument");
        }
        NativeObject config = prepConfig(cx, (Scriptable) args[0]);
        CompoundCurve cc = null;
        if (inNewExpr) {
            cc = new CompoundCurve(config);
        } else {
            cc = new CompoundCurve(config.getParentScope(), config);
        }
        return cc;
    }

    /**
     * Convert the provided object into an acceptable geometry config object.
     * @param context
     * @param configObj
     * @return
     */
    protected static NativeObject prepConfig(Context context, Scriptable configObj) {
        Scriptable scope = configObj.getParentScope();
        NativeObject config = null;
        if (configObj instanceof NativeObject) {
            getRequiredMember(configObj, "geometries", NativeArray.class, "Array");
            config = (NativeObject) configObj;
        } else if (configObj instanceof NativeArray) {
            NativeArray array = (NativeArray) configObj;
            config = (NativeObject) context.newObject(scope);
            config.put("geometries", config, array);
        } else {
            throw ScriptRuntime.constructError("Error",
                    "CompoundCurve config must be an array of linestring or circularstrings");
        }
        return config;
    }

    /**
     * Get the curved WKT
     * @return The curved WKT
     */
    @JSGetter
    public String getCurvedWkt() {
        return ((org.geotools.geometry.jts.CompoundCurve) getGeometry()).toCurvedText();
    }

    /**
     * Get the original LineStrings or CircularStrings (not linearized)
     * @return The original LineStrings or CircularStrings
     */
    @JSGetter
    public NativeArray getComponents() {
        Context cx = getCurrentContext();
        org.geotools.geometry.jts.CompoundCurve cs = (org.geotools.geometry.jts.CompoundCurve)getGeometry();
        List<LineString> lineStrings = new ArrayList<LineString>();
        List<com.vividsolutions.jts.geom.LineString> lines = cs.getComponents();
        for (com.vividsolutions.jts.geom.LineString line : lines) {
            lineStrings.add((LineString)GeometryWrapper.wrap(getParentScope(), line));
        }
        return (NativeArray) cx.newArray(getParentScope(), lineStrings.toArray());
    }

    /**
     * Get the linearized Geometry
     * @return The linearized Geometry
     */
    @JSGetter
    public Geometry getLinear() {
        org.geotools.geometry.jts.CompoundCurve cs = (org.geotools.geometry.jts.CompoundCurve)getGeometry();
        return (Geometry) GeometryWrapper.wrap(getParentScope(), cs.linearize());
    }

    /**
     * Returns underlying JTS geometry.
     */
    public org.geotools.geometry.jts.CompoundCurve unwrap() {
        return (org.geotools.geometry.jts.CompoundCurve) getGeometry();
    }
}
