package org.geoscript.js.feature;

import org.geoscript.js.GeoObject;
import org.geoscript.js.GeoScriptShell;
import org.geoscript.js.geom.Bounds;
import org.geoscript.js.geom.Geometry;
import org.geoscript.js.geom.GeometryWrapper;
import org.geoscript.js.proj.Projection;
import org.geotools.feature.simple.SimpleFeatureBuilder;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Undefined;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.mozilla.javascript.annotations.JSSetter;
import org.opengis.feature.GeometryAttribute;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.feature.type.AttributeDescriptor;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

public class Feature extends GeoObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 4426338466323185386L;
    
    private SimpleFeature feature;

    CoordinateReferenceSystem crs;

    /**
     * Prototype constructor.
     */
    public Feature() {
    }

    private Feature(NativeObject config) {
        Schema schema;
        Object schemaObj = config.get("schema");
        Object propertiesObj = config.get("properties");
        NativeObject properties = null;
        if (propertiesObj instanceof NativeObject) {
            properties = (NativeObject) propertiesObj;
        }
        Scriptable scope = ScriptableObject.getTopLevelScope(config);
        if (schemaObj instanceof SimpleFeatureType) {
            schema = new Schema(scope, (SimpleFeatureType) schemaObj);
        } else if (schemaObj instanceof Scriptable) {
            schema = new Schema(scope, (Scriptable) schemaObj);
        } else {
            if (properties != null) {
                schema = Schema.fromValues(scope, properties);
            } else {
                throw ScriptRuntime.constructError("Error", "Feature config must include schema or properties.");
            }
        }
        SimpleFeatureBuilder builder = new SimpleFeatureBuilder((SimpleFeatureType) schema.unwrap());
        if (properties != null) {
            Object[] names = properties.getIds();
            for (Object nameObj : names) {
                String name = (String) nameObj;
                if (schema.get(name) == null) {
                    throw ScriptRuntime.constructError("Error", "Feature schema has no field with the given name: " + name);
                }
                Object value = properties.get(name);
                builder.set(name, value);
            }
        }
        Object idObj = config.get("id");
        String id = null;
        if (idObj instanceof String) {
            id = (String) idObj;
        }
        feature = builder.buildFeature(id);
    }

    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        if (!inNewExpr) {
            throw ScriptRuntime.constructError("Error", "Call constructor with new keyword.");
        }
        Feature feature = null;
        Object arg = args[0];
        if (arg instanceof NativeObject) {
            feature = new Feature((NativeObject) arg);
        }
        return feature;
    }

    public Object unwrap() {
        return feature;
    }
    
    @JSGetter
    public String getId() {
        return feature.getIdentifier().toString();
    }
    
    @JSGetter
    public String getGeometryName() {
        GeometryAttribute geomProp = feature.getDefaultGeometryProperty();
        String name = null;
        if (geomProp != null) {
            name = geomProp.getName().toString();
        }
        return name;
    }
    
    @JSGetter
    public Geometry getGeometry() {
        Geometry jsGeom = null;
        com.vividsolutions.jts.geom.Geometry geometry = 
            (com.vividsolutions.jts.geom.Geometry) feature.getDefaultGeometry();
        if (geometry != null) {
            jsGeom = (Geometry) GeometryWrapper.wrap(getParentScope(), geometry);
            jsGeom.setProjection(getProjection());
        }
        return jsGeom;
    }
    
    @JSSetter
    public void setGeometry(Geometry geometry) {
        setProjection(geometry.getProjection());
        feature.setDefaultGeometry(geometry.unwrap());
    }
    
    @JSSetter
    public void setProjection(Projection projection) {
        CoordinateReferenceSystem crs = null;
        if (projection != null) {
            crs = projection.unwrap();
        }
        this.crs = crs;
    }

    @JSGetter
    public Projection getProjection() {
        Projection projection = null;
        if (crs != null) {
            projection = new Projection(getParentScope(), crs);
        }
        return projection;
    }
    
    @JSGetter
    public Bounds getBounds() {
        Bounds bounds = null;
        Geometry geometry = getGeometry();
        if (geometry != null) {
            bounds = geometry.getBounds();
        }
        return bounds;
    }

    @JSGetter
    public Schema getSchema() {
        return new Schema(getParentScope(), feature.getFeatureType());
    }

    @JSFunction
    public Feature set(String name, Object value) {
        SimpleFeatureType featureType = feature.getFeatureType();
        AttributeDescriptor descriptor = featureType.getDescriptor(name);
        if (descriptor == null) {
            throw ScriptRuntime.constructError("Error", "Feature schema has no such field: " + name);
        }
        if (value instanceof Wrapper) {
            value = ((Wrapper) value).unwrap();
        }
        feature.setAttribute(name, GeoScriptShell.jsToJava(value));
        return this;
    }

    @JSFunction
    public Object get(String name) {
        Object value;
        if (feature.getFeatureType().getDescriptor(name) == null) {
            value = Undefined.instance;
        } else {
            value = GeoScriptShell.javaToJS(feature.getAttribute(name), getParentScope());
        }
        return value;
    }
    
    @JSGetter
    public Scriptable getProperties() {
        Context cx = Context.getCurrentContext();
        Scriptable scope = getParentScope();
        Scriptable properties = cx.newObject(scope);
        for (Property property : feature.getProperties()) {
            String name = property.getName().toString();
            properties.put(name, properties, get(name));
        }
        return properties;
    }
    
    @JSGetter
    public Scriptable getConfig() {
        Context cx = Context.getCurrentContext();
        Scriptable scope = getParentScope();
        Scriptable config = cx.newObject(scope);
        config.put("type", config, "Feature");
        
        // add schema
        Schema schema = getSchema();
        Scriptable schemaConfig = schema.getConfig();
        config.put("schema", config, schemaConfig);

        // add default geometry member
        Geometry geometry = getGeometry();
        Scriptable geomConfig = null;
        if (geometry != null) {
            geomConfig = geometry.getConfig();
        }
        config.put("geometry", config, geomConfig);

        // add all other properties
        Scriptable properties = cx.newObject(scope);
        Scriptable values = getProperties();
        String geometryName = getGeometryName();
        Object[] names = values.getIds();
        for (Object nameObj : names) {
            String name = (String) nameObj;
            if (!name.equals(geometryName)) {
                properties.put(name, properties, values.get(name, values));
            }
        }
        config.put("properties", config, properties);
        return config;
    }

}
