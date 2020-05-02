package org.geoscript.js.geom;

import org.geoscript.js.GeoObject;
import org.geoscript.js.proj.Projection;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.mozilla.javascript.annotations.JSSetter;
import org.mozilla.javascript.annotations.JSStaticFunction;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

import org.locationtech.jts.geom.Envelope;

public class Bounds extends GeoObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = -4366124351995280764L;

    ReferencedEnvelope refEnv;

    /**
     * Prototype constructor.
     * @return 
     */
    public Bounds() {
    }

    /**
     * Constructor from config object.
     * @param obj
     */
    public Bounds(NativeObject obj) {
        double minX = Double.NaN;
        double minY = Double.NaN;
        double maxX = Double.NaN;
        double maxY = Double.NaN;
        Object minXObj = obj.get("minX", obj);
        if (minXObj instanceof Number) {
            minX = ((Number) minXObj).doubleValue();
        }
        Object minYObj = obj.get("minY", obj);
        if (minYObj instanceof Number) {
            minY = ((Number) minYObj).doubleValue();
        }
        Object maxXObj = obj.get("maxX", obj);
        if (maxXObj instanceof Number) {
            maxX = ((Number) maxXObj).doubleValue();
        }
        Object maxYObj = obj.get("maxY", obj);
        if (maxYObj instanceof Number) {
            maxY = ((Number) maxYObj).doubleValue();
        }
        if (Double.isNaN(minX) || Double.isNaN(minY) || Double.isNaN(maxX) || Double.isNaN(maxY)) {
            throw new RuntimeException("Config must include minX, minY, maxX, and maxY values.");
        }
        Projection projection = null;
        Object projectionObj = obj.get("projection", obj);
        if (projectionObj instanceof Projection) {
            projection = (Projection) projectionObj;
        } else if (projectionObj instanceof String) {
            projection = new Projection((String) projectionObj);
        }
        CoordinateReferenceSystem crs = projection != null ? projection.unwrap() : null;
        refEnv = new ReferencedEnvelope(minX, maxX, minY, maxY, crs);
    }
    
    /**
     * Constructor from array.
     * @param array
     */
    public Bounds(NativeArray array) {
        if (array.size() != 4 && array.size() != 5) {
            throw new RuntimeException("Array must have 4 or 5 elements.");
        }
        double minX = Double.NaN;
        double minY = Double.NaN;
        double maxX = Double.NaN;
        double maxY = Double.NaN;
        Object minXObj = array.get(0);
        if (minXObj instanceof Number) {
            minX = ((Number) minXObj).doubleValue();
        }
        Object minYObj = array.get(1);
        if (minYObj instanceof Number) {
            minY = ((Number) minYObj).doubleValue();
        }
        Object maxXObj = array.get(2);
        if (maxXObj instanceof Number) {
            maxX = ((Number) maxXObj).doubleValue();
        }
        Object maxYObj = array.get(3);
        if (maxYObj instanceof Number) {
            maxY = ((Number) maxYObj).doubleValue();
        }
        if (Double.isNaN(minX) || Double.isNaN(minY) || Double.isNaN(maxX) || Double.isNaN(maxY)) {
            throw new RuntimeException("Config must include minx, miny, maxx, and maxy values.");
        }
        CoordinateReferenceSystem crs = null;
        if (array.size() == 5) {
            Object crsObj = array.get(4);
            if (crsObj instanceof CoordinateReferenceSystem) {
                crs = (CoordinateReferenceSystem) crsObj;
            } else if (crsObj instanceof String) {
                crs = (new Projection((String) crsObj)).unwrap();
            }
            if (crs == null) {
                throw new RuntimeException("Fifth item must be a Projection instance or a CRS string identifier");
            }
        }
        refEnv = new ReferencedEnvelope(minX, maxX, minY, maxY, crs);
    }

    /**
     * Constructor from config object (without new keyword).
     * @param scope
     * @param obj
     */
    public Bounds(Scriptable scope, NativeObject obj) {
        this(obj);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Bounds.class));
    }
    
    /**
     * Constructor from array (without new keyword).
     * @param scope
     * @param array
     */
    public Bounds(Scriptable scope, NativeArray array) {
        this(array);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Bounds.class));
    }

    /**
     * Constructor from ReferencedEnvelope.
     * @param scope
     * @param refEnv
     */
    public Bounds(Scriptable scope, ReferencedEnvelope refEnv) {
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Bounds.class));
        this.refEnv = refEnv;
    }
    

    @JSGetter
    public Object getMinX() {
        return refEnv.getMinX();
    }

    @JSGetter
    public Object getMinY() {
        return refEnv.getMinY();
    }

    @JSGetter
    public Object getMaxX() {
        return refEnv.getMaxX();
    }

    @JSGetter
    public Object getMaxY() {
        return refEnv.getMaxY();
    }

    @JSGetter
    public Projection getProjection() {
        Projection projection = null;
        CoordinateReferenceSystem crs = refEnv.getCoordinateReferenceSystem();
        if (crs != null) {
            projection = new Projection(this.getParentScope(), crs);
        }
        return projection;
    }
    
    @JSSetter
    public void setProjection(Object projObj) {
        CoordinateReferenceSystem crs = null;
        if (projObj instanceof Projection) {
            crs = ((Projection) projObj).unwrap();
        } else if (projObj instanceof String) {
            crs = new Projection((String) projObj).unwrap();
        }
        refEnv = new ReferencedEnvelope(refEnv, crs);
    }
    
    @JSGetter
    public Object getArea() {
        return refEnv.getArea();
    }
    
    @JSGetter
    public Object getWidth() {
        return refEnv.getWidth();
    }
    
    @JSGetter
    public Object getHeight() {
        return refEnv.getHeight();
    }
    
    @JSFunction
    public Bounds transform(Object projObj) {
        Projection projection = getProjection();
        if (projection == null) {
            throw new RuntimeException("Bounds must have a projection before it can be transformed");
        }
        CoordinateReferenceSystem crs = null;
        if (projObj instanceof Projection) {
            crs = ((Projection) projObj).unwrap();
        } else if (projObj instanceof String) {
            crs = (new Projection((String) projObj)).unwrap();
        }
        if (crs == null) {
            throw new RuntimeException("Argument must be a Projection instance or string identifier.");
        }
        Bounds bounds = null;
        try {
            bounds = new Bounds(this.getParentScope(), refEnv.transform(crs, true));
        } catch (Exception e) {
            throw new RuntimeException("Unable to transform bounds", e);
        }
        return bounds;
    }
    
    @JSGetter
    public boolean getEmpty() {
        return refEnv.isEmpty();
    }
    
    @JSFunction
    public boolean equals(Bounds other) {
        return refEnv.equals(other.unwrap());
    }
    
    @JSFunction
    public boolean contains(Bounds other) {
        return refEnv.contains((Envelope) sameProjection(other).unwrap());
    }
    
    @JSFunction
    public Bounds include(Bounds other) {
        refEnv.expandToInclude(sameProjection(other).unwrap());
        return this;
    }
    
    @JSFunction
    public boolean intersects(Bounds other) {
        return refEnv.intersects((Envelope) sameProjection(other).unwrap());
    }
    
    @JSFunction
    public Bounds expandBy(Object deltaX, Object deltaY) {
        if (deltaY == Context.getUndefinedValue()) {
            deltaY = deltaX;
        }
        if (!(deltaX instanceof Number) || !(deltaY instanceof Number)) {
            throw ScriptRuntime.constructError("Error", "Provide numeric arguments");
        }
        refEnv.expandBy(((Number) deltaX).doubleValue(), ((Number) deltaY).doubleValue());
        return this;
    }
    
    @JSFunction
    public Bounds intersection(Bounds other) {
        Envelope intersection = refEnv.intersection(sameProjection(other).unwrap());
        CoordinateReferenceSystem crs = null;
        Projection projection = getProjection();
        if (projection != null) {
            crs = projection.unwrap();
        }
        ReferencedEnvelope interRefEnv = new ReferencedEnvelope(intersection, crs);
        if (intersection.isNull()) {
            interRefEnv.setToNull();
        }
        return new Bounds(getParentScope(), interRefEnv);
    }
    
    @JSFunction
    public NativeArray toArray() {
        Context cx = getCurrentContext();
        Scriptable scope = getParentScope();
        return (NativeArray) cx.newArray(scope, new Object[] {getMinX(), getMinY(), getMaxX(), getMaxY()});
    }

    @JSFunction("clone")
    public Bounds cloner() {
        ReferencedEnvelope clone = new ReferencedEnvelope(refEnv);
        return new Bounds(getParentScope(), clone);
    }
    
    @JSGetter
    public Scriptable getConfig() {
        Scriptable obj = super.getConfig();
        obj.put("minX", obj, getMinX());
        obj.put("maxX", obj, getMaxX());
        obj.put("minY", obj, getMinY());
        obj.put("maxY", obj, getMaxY());
        Projection projection = getProjection();
        if (projection != null) {
            obj.put("projection", obj, projection.getId());
        }
        return obj;
    }
    
    private Bounds sameProjection(Bounds other) {
        Bounds same = other;
        Projection otherProj = other.getProjection();
        if (otherProj != null) {
            if (!otherProj.equals(getProjection())) {
                same = this.transform(otherProj.unwrap());
            }
        }
        return same;
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
            throw ScriptRuntime.constructError("Error", "Bounds constructor takes a single argument");
        }
        Bounds bounds = null;
        Object arg = args[0];
        if (arg instanceof NativeObject) {
            NativeObject config = (NativeObject) arg;
            if (inNewExpr) {
                bounds = new Bounds(config);
            } else {
                bounds = new Bounds(config.getParentScope(), config);
            }
        } else if (arg instanceof NativeArray) {
            NativeArray array = (NativeArray) arg;
            if (inNewExpr) {
                bounds = new Bounds(array);
            } else {
                bounds = new Bounds(array.getParentScope(), array);
            }
        } else {
            throw ScriptRuntime.constructError("Error", "Bounds constructor takes an object or array.");
        }
        return bounds;
    }
    
    @JSStaticFunction
    public static Bounds from_(Scriptable refEnvObj) {
        ReferencedEnvelope refEnv = null;
        if (refEnvObj instanceof Wrapper) {
            Object obj = ((Wrapper) refEnvObj).unwrap();
            if (obj instanceof ReferencedEnvelope) {
                refEnv = (ReferencedEnvelope) obj;
            }
        }
        if (refEnv == null) {
            throw ScriptRuntime.constructError("Error", "Cannot create bounds from " + Context.toString(refEnvObj));
        }
        return new Bounds(getTopLevelScope(refEnvObj), refEnv);
    }
    
    /**
     * Descriptive string representation of this object.
     * @return
     */
    public String toFullString() {
        String repr = "[" + getMinX().toString() + ", " + getMinY().toString() + 
            ", " + getMaxX().toString() + ", " + getMaxY().toString() + "]";
        Projection projection = getProjection();
        if (projection != null) {
            repr += " " + projection.getId();
        }
        return repr;
    }

    public ReferencedEnvelope unwrap() {
        return refEnv;
    }


}
