package org.geoscript.js.io;

import org.geoscript.js.geom.Geometry;
import org.geoscript.js.geom.GeometryWrapper;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;
import com.vividsolutions.jts.io.WKTWriter;

public class WKT {

    static WKTReader wktReader = new WKTReader();
    static WKTWriter wktWriter = new WKTWriter();

    /**
     * Parse well-known text for a geometry.
     * @param cx
     * @param thisObj
     * @param args
     * @param funObj
     * @return A geometry object
     */
    public static Geometry read(Context cx, Scriptable thisObj,
                               Object[] args, Function funObj) {
        String wkt = null;
        if (args.length == 1) {
            Object wktObj = args[0];
            if (wktObj instanceof String) {
                wkt = (String) wktObj;
            }
        }
        if (wkt == null) {
            throw ScriptRuntime.constructError("Error", 
                    "The read function expects a single string argument");
        }
        com.vividsolutions.jts.geom.Geometry jtsGeom = null;
        try {
            jtsGeom = wktReader.read(wkt);
        } catch (ParseException e) {
            throw ScriptRuntime.constructError("Error", 
                    "Trouble parsing well-known text: " + e.getMessage());
        }
        return (Geometry) GeometryWrapper.wrap(thisObj.getParentScope(), jtsGeom);
        
    }

    /**
     * Serialize a geometry as well-known text.
     * @param cx
     * @param thisObj
     * @param args
     * @param funObj
     * @return
     */
    public static String write(Context cx, Scriptable thisObj,
            Object[] args, Function funObj) {
        
        Geometry geometry = null;
        if (args.length == 1) {
            Object geomObj = args[0];
            if (geomObj instanceof Geometry) {
                geometry = (Geometry) geomObj;
            }
        }
        if (geometry == null) {
            throw ScriptRuntime.constructError("Error", 
            "The write function expects a single geometry argument");
        }
        return wktWriter.write((com.vividsolutions.jts.geom.Geometry) geometry.unwrap());
    }

    /**
     * Create object with read/write methods.
     * @param scope
     * @return
     */
    public static NativeObject init(ScriptableObject scope) {
        
        Context context = Context.getCurrentContext();
        if (context == null) {
            throw ScriptRuntime.constructError("Error", 
                    "No context associated with current thread");
        }
        NativeObject wkt = (NativeObject) context.newObject(scope);
        wkt.defineFunctionProperties(new String[] { "read", "write" }, 
                WKT.class, ScriptableObject.PERMANENT);
        return wkt;
    }

}
