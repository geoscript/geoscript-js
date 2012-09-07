package org.geoscript.js;

import java.math.BigDecimal;
import java.net.URI;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

import org.geoscript.js.feature.Collection;
import org.geoscript.js.feature.Feature;
import org.geoscript.js.feature.Schema;
import org.geoscript.js.geom.Bounds;
import org.geoscript.js.geom.GeometryWrapper;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.feature.FeatureCollection;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeJSON;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

public class GeoObject extends ScriptableObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 5069578216502688712L;
    
    protected enum Type {

        String(String.class),
        Integer(Integer.class),
        Short(Short.class),
        Float(Float.class),
        Long(Long.class),
        Number(Double.class),
        Double(Double.class),
        Boolean(Boolean.class),
        Geometry(com.vividsolutions.jts.geom.Geometry.class),
        Point(com.vividsolutions.jts.geom.Point.class),
        LineString(com.vividsolutions.jts.geom.LineString.class),
        Polygon(com.vividsolutions.jts.geom.Polygon.class),
        GeometryCollection(com.vividsolutions.jts.geom.GeometryCollection.class),
        MultiPoint(com.vividsolutions.jts.geom.MultiPoint.class),
        MultiLineString(com.vividsolutions.jts.geom.MultiLineString.class),
        MultiPolygon(com.vividsolutions.jts.geom.MultiPolygon.class),
        Bounds(ReferencedEnvelope.class),
        FeatureCollection(FeatureCollection.class),
        Filter(org.opengis.filter.Filter.class),
        Projection(CoordinateReferenceSystem.class),
        Date(Date.class),
        Time(Time.class),
        Datetime(java.util.Date.class),
        Timestamp(Timestamp.class),
        BigDecimal(BigDecimal.class),
        URI(URI.class);
    
        private Class<?> binding;
        
        Type(Class<?> binding) {
            this.binding = binding;
        }
        
        public static String getName(Class<?> binding) {
            String name = null;
            for (Type type : Type.values()) {
                if (!binding.isPrimitive()) {
                    if (!binding.isInterface()) {
                        if (type.getBinding().equals(binding)) {
                            name = type.name();
                            break;
                        }
                    } else if (type.getBinding().isAssignableFrom(binding)) {
                        name = type.name();
                        break;
                    }
                } else {
                    try {
                        Class<?> cls = (Class<?>) type.getBinding().getField("TYPE").get(null);
                        if (cls.equals(binding)) {
                            name = type.name();
                            break;
                        }
                    } catch (Exception e) {
                        // no type field on binding, keep looking
                    }
                }
            }
            return name;
        }

        /**
         * @return the binding
         */
        public Class<?> getBinding() {
            return binding;
        }
        
    }

    
    @JSGetter
    public Scriptable getConfig() {
        Scriptable scope = getParentScope();
        Context cx = getCurrentContext();
        Scriptable obj = cx.newObject(scope);
        obj.put("type", obj, getClass().getSimpleName());
        return obj;
    }
    
    @JSGetter
    public Object getJson() {
        Scriptable config = getConfig();
        Scriptable scope = getParentScope();
        Context cx = getCurrentContext();
        Object json = NativeJSON.stringify(cx, scope, config, null, null);
        return json;
    }

    public Object unwrap() {
        return null;
    }

    @Override
    public String getClassName() {
        return getClass().getName();
    }

    /**
     * String representation of an array.
     * @param array
     * @return
     */
    protected String arrayRepr(NativeArray array) {
        String repr = "[";
        int length = array.size();
        for (int i=0; i<length; ++i) {
            Object item = array.get(i);
            if (item instanceof NativeArray) {
                repr += arrayRepr((NativeArray) item);
            } else if (item instanceof String) {
                repr += '"' + (String) item + '"';
            } else {
                repr += Context.toString(item);
            }
            if (i < length -1) {
                repr += ", ";
            }
        }
        return repr + "]";
    }

    
    @JSFunction
    public String toString() {
        String full = toFullString();
        if (full.length() > 0) {
            full = " " + full;
        }
        if (full.length() > 60) {
            full = full.substring(0, 61) + "...";
        }
        return "<" + getClass().getSimpleName() + full + ">";
    }
    
    /**
     * Descriptive string representation of this object.
     * @return
     */
    public String toFullString() {
        return "";
    }
    
    /**
     * Get the context associated with the current thread.
     * @return The current context.
     */
    protected static Context getCurrentContext() {
        Context cx = Context.getCurrentContext();
        if (cx == null) {
            throw new RuntimeException("No context associated with current thread.");
        }
        return cx;
    }
    
    /**
     * Get an optional member.  If the member is present and the value is not
     * null, the value must be an instance of the provided class.
     * 
     * @param obj
     * @param name
     * @param cls If provided, the member value must be an instance of this
     * class.
     * @return
     */
    protected static Object getOptionalMember(Scriptable obj, String name, Class<?> cls) {
        return getOptionalMember(obj, name, cls, cls.getSimpleName());
    }

    /**
     * Get an optional member.  If the member is present and the value is not
     * null, the value must be an instance of the provided class.
     * 
     * @param obj
     * @param name
     * @param cls If provided, the member value must be an instance of this
     * class.
     * @param clsName The constructor name displayed to the user in the case
     * of an error.
     * @return
     */
    protected static Object getOptionalMember(Scriptable obj, String name, 
            Class<?> cls, String clsName) {
        Object result = getMember(obj, name);
        if (result != null && !cls.isInstance(result)) {
            throw ScriptRuntime.constructError("Error", 
                    "The optional " + name + " member must be a " + clsName);
        }
        return result;
    }

    
    /**
     * Get a required member.  If the member is present and the value is not
     * null, the value must be an instance of the provided class.
     * 
     * @param obj
     * @param name
     * @param cls The member value must be an instance of this class.
     * @return
     */
    protected static Object getRequiredMember(Scriptable obj, String name, Class<?> cls) {
        return getRequiredMember(obj, name, cls, cls.getSimpleName());
    }

    /**
     * Get a required member.  If the member is present and the value is not
     * null, the value must be an instance of the provided class.
     * 
     * @param obj
     * @param name
     * @param cls The member value must be an instance of this class.
     * @param clsName The constructor name displayed to the user in the case
     * of an error.
     * @return
     */
    protected static Object getRequiredMember(Scriptable obj, String name, 
            Class<?> cls, String clsName) {
        Object result = getMember(obj, name);
        if (result == null) {
            throw ScriptRuntime.constructError("Error", 
                    "The required " + name + " member must be non-null");
        }
        if (!cls.isInstance(result)) {
            throw ScriptRuntime.constructError("Error", 
                    "Expected the '" + name + "' member to be a " + 
                    cls.getSimpleName() + ". Got: " + Context.toString(result));
        }
        return result;
    }

    /**
     * Get an object member.  Returns null if the member is not present or if
     * the value is null.
     * @param obj
     * @return
     */
    private static Object getMember(Scriptable obj, String name) {
        Object result = null;
        if (obj.has(name, obj)) {
            result = obj.get(name, obj);
        }
        return result;
    }

    /**
     * Convert a JavaScript object into the appropriate Java type.
     * @param value
     * @return
     */
    public static Object jsToJava(Object value) {
        if (value instanceof Wrapper) {
            value = ((Wrapper) value).unwrap();
        } else if (value instanceof Scriptable) {
            if (((Scriptable) value).getClassName().equals("Date")) {
                value = Context.jsToJava(value, java.util.Date.class);
            }
        }
        return value;
    }

    /**
     * Convert a Java object into the appropriate JavaScript type.
     * @param value
     * @param scope
     * @return
     */
    public static Object javaToJS(Object value, Scriptable scope) {
        if (value instanceof java.util.Date) {
            java.util.Date date = (java.util.Date) value;
            Object[] args = { new Long(date.getTime()) };
            Context cx = GeoObject.getCurrentContext();
            value = cx.newObject(scope, "Date", args);
        }
        if (value instanceof com.vividsolutions.jts.geom.Geometry) {
            value = GeometryWrapper.wrap(scope, (com.vividsolutions.jts.geom.Geometry) value);
        } else if (value instanceof ReferencedEnvelope) {
            value = new Bounds(scope, (ReferencedEnvelope) value);
        } else if (value instanceof SimpleFeature) {
            value = new Feature(scope, (SimpleFeature) value);
        } else if (value instanceof SimpleFeatureType) {
            value = new Schema(scope, (SimpleFeatureType) value);
        } else if (value instanceof SimpleFeatureCollection) {
            value = new Collection(scope, (SimpleFeatureCollection) value);
        }
        return Context.javaToJS(value, scope);
    }

}
