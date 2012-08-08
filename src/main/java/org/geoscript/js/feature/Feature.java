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
    
    /**
     * The GeoTools feature backing this feature.
     */
    private SimpleFeature feature;

    /**
     * Optional coordinate reference system for the feature.
     */
    CoordinateReferenceSystem crs;
    
    /**
     * Layer from which this feature was accessed.  Used to persist 
     * modifications.
     */
    Scriptable layer;

    /**
     * Prototype constructor.
     */
    public Feature() {
    }
    
    /**
     * Constructor with SimpleFeature (from Java).
     * @param scope
     * @param feature
     */
    public Feature(Scriptable scope, SimpleFeature feature) {
        this.feature = feature;
        setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Feature.class));
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
        String id = null;
        if (config.has("id", config)) {
            id = Context.toString(config.get("id", config));
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
        String name = getGeometryName();
        set(name, geometry);
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
        String geomName = getGeometryName();
        if (geomName != null && geomName.equals(name)) {
            if (!(value instanceof Geometry)) {
                throw ScriptRuntime.constructError("Error", "Attempted to set geometry property to a non-geometry object: " + Context.toString(value));
            }
            setProjection(((Geometry) value).getProjection());
        }
        feature.setAttribute(name, GeoScriptShell.jsToJava(value));
        if (layer != null) {
            // queue modifications
            Object queueModifiedObj = ScriptableObject.getProperty(layer, "queueModified");
            if (!(queueModifiedObj instanceof Function)) {
                throw new RuntimeException("Unable to access queueModified method of layer.");
            }
            Function queueModified = (Function) queueModifiedObj;
            Context cx = getCurrentContext();
            Scriptable scope = getParentScope();
            Object[] args = { this, name };
            queueModified.call(cx, scope, layer, args);
        }
        return this;
    }

    @JSFunction
    public Object get(String name) {
        Object value;
        if (feature.getFeatureType().getDescriptor(name) == null) {
            value = Context.getUndefinedValue();
        } else {
            value = GeoScriptShell.javaToJS(feature.getAttribute(name), getParentScope());
        }
        return value;
    }

    /**
     * Set the layer from which this feature was accessed.
     * TODO: Remove this from the API when Layer is implemented as a wrapper.
     * @param layer
     * @return
     */
    @JSSetter
    public void setLayer(Scriptable layer) {
        if (this.layer != null) {
            // TODO: clear queued modifications?
        }
        this.layer = layer;
    }
    
    @JSGetter
    public Scriptable getLayer() {
        return layer;
    }

    
    @JSGetter
    public Scriptable getProperties() {
        Context cx = getCurrentContext();
        Scriptable scope = getParentScope();
        Scriptable properties = cx.newObject(scope);
        for (Property property : feature.getProperties()) {
            String name = property.getName().toString();
            properties.put(name, properties, get(name));
        }
        return properties;
    }
    
    @JSSetter
    public void setProperties(Scriptable properties) {
        Object[] names = properties.getIds();
        for (Object nameObj : names) {
            String name = (String) nameObj;
            set(name, properties.get(name, properties));
        }
    }
    
    @JSGetter
    public Scriptable getConfig() {
        Scriptable config = super.getConfig();
        
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
        Context cx = getCurrentContext();
        Scriptable scope = getParentScope();
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
