package org.geoscript.js.feature;

import org.geoscript.js.GeoObject;
import org.geoscript.js.geom.Bounds;
import org.geoscript.js.geom.Geometry;
import org.geoscript.js.io.JSON;
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
import org.mozilla.javascript.annotations.JSStaticFunction;
import org.opengis.feature.GeometryAttribute;
import org.opengis.feature.Property;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.feature.type.AttributeDescriptor;
import org.opengis.feature.type.GeometryDescriptor;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

public class Feature extends GeoObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 4426338466323185386L;
    
    /**
     * The GeoTools feature backing this feature.
     */
    private SimpleFeature feature;

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

    /**
     * Constructor from config object.
     * @param config
     */
    private Feature(NativeObject config) {
        Scriptable scope = ScriptableObject.getTopLevelScope(config);
        config = prepConfig(config);
        Schema schema = null;
        if (config.has("schema", config)) {
            Object schemaObj = config.get("schema", config);
            if (schemaObj instanceof Schema) {
                schema = (Schema) schemaObj;
            } else if (schemaObj instanceof Scriptable) {
                schema = new Schema(scope, (Scriptable) schemaObj);
            } else {
                throw ScriptRuntime.constructError("Error", "Cannot create schema from provided value: " + Context.toString(schemaObj));
            }
        }

        Object propertiesObj = getOptionalMember(config, "properties", NativeObject.class, "Object");
        NativeObject properties = null;
        if (propertiesObj != null) {
            properties = (NativeObject) propertiesObj;
        }

        if (schema == null) {
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
                Object value = properties.get(name, properties);
                builder.set(name, jsToJava(value));
            }
        }
        
        String id = null;
        if (config.has("id", config)) {
            id = Context.toString(config.get("id", config));
        }

        feature = builder.buildFeature(id);
    }
    
    /**
     * Translate a GeoJSON config into a Feature config.
     * @param config
     * @return
     */
    private NativeObject prepConfig(NativeObject config) {
        Scriptable scope = config.getParentScope();
        Object propertiesObj = getOptionalMember(config, "properties", NativeObject.class, "Object");
        NativeObject properties = null;
        if (propertiesObj != null) {
            properties = (NativeObject) propertiesObj;
        }

        Geometry geometry = null;
        if (config.has("geometry", config)) {
            // GeoJSON config
            Object geometryObj = config.get("geometry", config);
            if (!(geometryObj instanceof NativeObject)) {
                throw ScriptRuntime.constructError("Error", 
                        "Expected geometry member to be an object, got: " + Context.toString(geometryObj));
            }
            geometryObj = JSON.readObj((NativeObject) geometryObj);
            if (!(geometryObj instanceof Geometry)) {
                throw ScriptRuntime.constructError("Error", "Expected geometry memeber to be a valid geometry, got: " + Context.toString(geometryObj));
            }
            geometry = (Geometry) geometryObj;
            config.delete("geometry");
            // allow passing a geometry only with no other properties
            if (properties == null) {
                Context cx = Context.enter();
                try {
                    properties = (NativeObject) cx.newObject(scope);
                } finally {
                    Context.exit();
                }
                config.put("properties", config, properties);
            }
        }
        if (geometry != null && properties != null) {
            properties.put("geometry", properties, geometry);
        }
        return config;
    }

    /**
     * Constructor from config object (without new keyword).
     * @param scope
     * @param config
     */
    public Feature(Scriptable scope, NativeObject config) {
        this(config);
        setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Feature.class));
    }

    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        if (args.length != 1) {
            throw ScriptRuntime.constructError("Error", "Constructor takes a single argument");
        }
        Feature feature = null;
        Object arg = args[0];
        if (arg instanceof NativeObject) {
            NativeObject config = (NativeObject) arg;
            if (inNewExpr) {
                feature = new Feature(config);
            } else {
                feature = new Feature(config.getParentScope(), config);
            }
        } else {
            throw ScriptRuntime.constructError("Error", "Could not create feature from argument: " + Context.toString(arg));
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
        String name = getGeometryName();
        return (Geometry) get(name);
    }
    
    @JSSetter
    public void setGeometry(Geometry geometry) {
        String name = getGeometryName();
        if (name == null) {
            throw ScriptRuntime.constructError("Error", "Feature schema has no geometry field");
        }
        set(name, geometry);
    }
    
    @JSGetter
    public Projection getProjection() {
        Projection projection = null;
        SimpleFeatureType featureType = feature.getFeatureType();
        GeometryDescriptor descriptor = featureType.getGeometryDescriptor();
        if (descriptor != null) {
            CoordinateReferenceSystem crs = descriptor.getCoordinateReferenceSystem();
            if (crs != null) {
                projection = new Projection(getParentScope(), crs);
            }
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
            Projection featureProj = getProjection();
            Geometry geometry = (Geometry) value;
            Projection geomProj = geometry.getProjection();
            if (featureProj != null) {
                if (geomProj != null) {
                    if (!featureProj.equals(geometry.getProjection())) {
                        value = geometry.transform(featureProj);
                    }
                }
            } else if (geomProj != null) {
                throw ScriptRuntime.constructError("Error", "Cannot add a geometry with a projection to a feature without a projection");
            }
        }
        feature.setAttribute(name, jsToJava(value));
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
            value = javaToJS(feature.getAttribute(name), getParentScope());
            if (value instanceof Geometry) {
                ((Geometry) value).setProjection(getProjection());
            }
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
    public NativeObject getProperties() {
        Context cx = getCurrentContext();
        Scriptable scope = getParentScope();
        NativeObject properties = (NativeObject) cx.newObject(scope);
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

    @JSStaticFunction
    public static Feature from_(Scriptable featureObj) {
        SimpleFeature feature = null;
        if (featureObj instanceof Wrapper) {
            Object obj = ((Wrapper) featureObj).unwrap();
            if (obj instanceof SimpleFeature) {
                feature = (SimpleFeature) obj;
            }
        }
        if (feature == null) {
            throw ScriptRuntime.constructError("Error", "Cannot create feature from " + Context.toString(featureObj));
        }
        return new Feature(getTopLevelScope(featureObj), feature);
    }

    public String toFullString() {
        NativeObject properties = getProperties();
        Object[] names = properties.getIds();
        String repr = "";
        int length = names.length;
        for (int i=0; i<length; ++i) {
            String name = (String) names[i];
            Object value = get(name);
            if (value instanceof Geometry) {
                value = "<" + value.getClass().getSimpleName() + ">";
            } else if (value instanceof String) {
                value = '"' + (String) value + '"';
            } else {
                value = Context.toString(value);
            }
            repr += name + ": " + value;
            if (i < length - 1) {
                repr += ", ";
            }
        }
        return repr;
    }


}
