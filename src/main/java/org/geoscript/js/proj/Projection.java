package org.geoscript.js.proj;

import java.lang.reflect.InvocationTargetException;
import java.util.logging.Logger;

import org.geoscript.js.GeoObject;
import org.geotools.factory.Hints;
import org.geotools.referencing.CRS;
import org.geotools.util.logging.Logging;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.FunctionObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

public class Projection extends GeoObject implements Wrapper {

    {
        // TODO: configure logging elsewhere
        Logger logger = Logging.getLogger("org.geotools.referencing.factory.epsg");
        logger.setLevel(java.util.logging.Level.WARNING);
        
        // more convenient axis handling
        if (System.getProperty("org.geotools.referencing.forceXY") == null) {
            System.setProperty("org.geotools.referencing.forceXY", "true");
        }
        if (Hints.getSystemDefault(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER) == null) {
            Hints.putSystemDefault(Hints.FORCE_AXIS_ORDER_HONORING, "http");
        }
        Hints.putSystemDefault(Hints.COMPARISON_TOLERANCE, 1e-9);
    }

    /** serialVersionUID */
    private static final long serialVersionUID = 6743421324347604960L;
    
    /**
     * Underlying GeoTools object.
     */
    CoordinateReferenceSystem crs;
    
    /**
     * Cached identifier
     */
    String id;
    
    /**
     * Cached WKT
     */
    String wkt;

    /**
     * Prototype constructor
     */
    public Projection() {
    }

    /**
     * Constructor from GeoTools CRS.
     * @param scope
     * @param crs
     */
    public Projection(Scriptable scope, CoordinateReferenceSystem crs) {
        this.setParentScope(scope);
        this.setPrototype(getOrCreatePrototype(scope, getClass()));
        this.crs = crs;
    }
    
    public Projection(String id) {
        try {
            crs = CRS.decode(id);
        } catch (Exception e) {
            try {
                crs = CRS.parseWKT(id);
            } catch (Exception e2) {
                throw new RuntimeException("Trouble creating projection", e2);
            }
        }
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
        Projection projection = null;
        Object arg = args[0];
        if (arg instanceof String) {
            projection = new Projection((String) arg);
        } else {
            throw ScriptRuntime.constructError("Error", "Requires a string with CRS id or WKT.");
        }
        return projection;
    }
    
    @JSFunction
    public boolean equals(Object obj) {
        CoordinateReferenceSystem other = null;
        if (obj instanceof Wrapper) {
            other = (CoordinateReferenceSystem) ((Wrapper) obj).unwrap();
        }
        return CRS.equalsIgnoreMetadata(crs, other);
    }
    
    @JSGetter
    public String getId() {
        if (crs != null) {
            if (id == null) {
                try {
                    id = CRS.lookupIdentifier(crs, true);
                } catch (FactoryException e) {
                    // pass
                }
            }
        }
        return id;
    }

    @JSGetter
    public String getWkt() {
        if (crs != null) {
            if (wkt == null) {
                try {
                    wkt = crs.toWKT();
                } catch (UnsupportedOperationException e) {
                    // pass
                }
            }
        }
        return wkt;
    }

    @JSGetter
    public Scriptable getConfig() {
        Scriptable obj = super.getConfig();
        obj.put("id", obj, getId());
        return obj;
    }
    
    /**
     * Finishes JavaScript constructor initialization.  
     * Sets up the prototype chain using superclass.
     * 
     * @param scope
     * @param ctor
     * @param prototype
     * @throws NoSuchMethodException
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @throws InvocationTargetException
     */
    public static void finishInit(Scriptable scope, FunctionObject ctor, Scriptable prototype) 
    throws NoSuchMethodException, IllegalAccessException, InstantiationException, InvocationTargetException {
        prototype.setPrototype(getOrCreatePrototype(scope, GeoObject.class));
    }

    public CoordinateReferenceSystem unwrap() {
        return crs;
    }
    
    @Override
    public String getClassName() {
        return getClass().getName();
    }

}
