package org.geoscript.js.io;

import java.lang.reflect.Constructor;

import org.geoscript.js.geom.Point;
import org.geoscript.js.geom.LineString;
import org.geoscript.js.geom.Polygon;
import org.geoscript.js.geom.GeometryCollection;
import org.geoscript.js.geom.MultiPoint;
import org.geoscript.js.geom.MultiLineString;
import org.geoscript.js.geom.MultiPolygon;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.json.JsonParser;
import org.mozilla.javascript.json.JsonParser.ParseException;

public class JSON {

    private enum Type {
        Point(Point.class),
        LineString(LineString.class),
        Polygon(Polygon.class),
        GeometryCollection(GeometryCollection.class),
        MultiPoint(MultiPoint.class),
        MultiLineString(MultiLineString.class),
        MultiPolygon(MultiPolygon.class);
        
        private Class<?> cls;

        Type(Class<?> cls) {
            this.cls = cls;
        }
        
        public Object create(Scriptable scope, NativeObject object) {
            Constructor<?> ctor;
            try {
                ctor = cls.getDeclaredConstructor(Scriptable.class, NativeObject.class);
            } catch (Exception e) {
                throw new RuntimeException("Failed to get constructor for object: " + Context.toString(object));
            }
            Object result;
            try {
                result = ctor.newInstance(scope, object);
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse object: " + Context.toString(object));
            }
            return result;
        }
        
    }

    /**
     * Parse the JSON representation for some GeoScript object.
     * @param cx
     * @param thisObj
     * @param args
     * @param funObj
     * @return A geometry object
     */
    public static Object read(Context cx, Scriptable thisObj,
                               Object[] args, Function funObj) {
        String json = null;
        if (args.length == 1) {
            Object jsonObj = args[0];
            if (jsonObj instanceof String) {
                json = (String) jsonObj;
            }
        }
        if (json == null) {
            throw ScriptRuntime.constructError("Error", 
                    "The read function expects a single string argument");
        }
        Scriptable scope = thisObj.getParentScope();
        JsonParser parser = new JsonParser(cx, scope);
        Object parsed;
        try {
            parsed = parser.parseValue(json);
        } catch (ParseException e) {
            throw ScriptRuntime.constructError("Error", e.getMessage());
        }
        String typeName;
        NativeObject obj;
        if (parsed instanceof NativeObject) {
            obj = (NativeObject) parsed;
            Object typeObj = obj.get("type", obj);
            if (typeObj instanceof String) {
                typeName = (String) typeObj;
            } else {
                throw ScriptRuntime.constructError("Error", "The GeoJSON type member must be a string");
            }
        } else {
            throw ScriptRuntime.constructError("Error", "Expected a string representing a JSON object, got " + Context.toString(parsed));
        }
        Type type = Type.valueOf(typeName);
        return type.create(scope, obj);
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
        NativeObject json = (NativeObject) context.newObject(scope);
        json.defineFunctionProperties(new String[] { "read" },  // , "write" }, 
                JSON.class, ScriptableObject.PERMANENT);
        return json;
    }

}
