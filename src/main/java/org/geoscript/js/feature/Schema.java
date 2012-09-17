package org.geoscript.js.feature;

import java.util.List;

import org.geoscript.js.GeoObject;
import org.geoscript.js.geom.Geometry;
import org.geoscript.js.proj.Projection;
import org.geotools.feature.NameImpl;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.mozilla.javascript.annotations.JSStaticFunction;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.feature.type.AttributeDescriptor;
import org.opengis.feature.type.GeometryDescriptor;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

public class Schema extends GeoObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = -1823488566532338763L;

    private SimpleFeatureType featureType;
    
    /**
     * Prototype constructor.
     */
    public Schema() {
    }
    
    /**
     * Constructor from Scriptable (from Java).
     * @param scope
     * @param config
     */
    public Schema(Scriptable scope, Scriptable config) {
        this(prepConfig(config));
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Schema.class));
    }

    /**
     * Constructor from FeatureType (from Java).
     * @param scope
     * @param featureType
     */
    public Schema(Scriptable scope, SimpleFeatureType featureType) {
        this.featureType = featureType;
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Schema.class));
    }

    /**
     * Constructor from NativeObject (from JavaScript).
     * @param config
     */
    private Schema(NativeObject config) {
        Object fieldsObj = config.get("fields");
        if (!(fieldsObj instanceof NativeArray)) {
            throw ScriptRuntime.constructError("Error", "Schema config must have a fields array.");
        }
        NativeArray fields = (NativeArray) fieldsObj;
        SimpleFeatureTypeBuilder builder = new SimpleFeatureTypeBuilder();
        String name = "feature";
        if (config.has("name", config)) {
            name = Context.toString(config.get("name", config));
        }
        builder.setName(new NameImpl(name));
        String namespaceUri = (String) getOptionalMember(config, "uri", String.class);
        if (namespaceUri == null) {
            namespaceUri = "http://geoscript.org/#schema";
        }
        builder.setNamespaceURI(namespaceUri);
        for (int i=0; i<fields.size(); ++i) {
            Object fieldObj = fields.get(i);
            AttributeDescriptor descriptor = null;
            if (fieldObj instanceof NativeObject) {
                Field field = new Field(getParentScope(), (NativeObject) fieldObj);
                descriptor = (AttributeDescriptor) field.unwrap();
            } else if (fieldObj instanceof AttributeDescriptor) {
                descriptor = (AttributeDescriptor) fieldObj;
            } else {
                throw ScriptRuntime.constructError("Error", "Provided fields must be Field instances or config objects.");
            }
            if (descriptor instanceof GeometryDescriptor) {
                CoordinateReferenceSystem crs = ((GeometryDescriptor) descriptor).getCoordinateReferenceSystem();
                builder.setCRS(crs);
            }
            builder.add(descriptor);
        }
        featureType = builder.buildFeatureType();
    }

    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        if (args.length != 1) {
            throw ScriptRuntime.constructError("Error", "Constructor takes a single argument");
        }
        Schema schema = null;
        Object arg = args[0];
        if (arg instanceof Scriptable) {
            NativeObject config = prepConfig((Scriptable) arg);
            if (inNewExpr) {
                schema = new Schema(config);
            } else {
                schema = new Schema(config.getParentScope(), config);
            }
        } else {
            throw ScriptRuntime.constructError("Error", "Could not create schema from argument: " + Context.toString(arg));
        }
        return schema;
    }

    @JSGetter
    public String getName() {
        return featureType.getName().getLocalPart();
    }

    @JSGetter
    public Field getGeometry() {
        Field field = null;
        GeometryDescriptor descriptor = featureType.getGeometryDescriptor();
        if (descriptor != null) {
            field = new Field(getParentScope(), descriptor);
        }
        return field;
    }

    @JSGetter
    public NativeArray getFields() {
        Scriptable scope = getParentScope();
        Context cx = getCurrentContext();
        List<AttributeDescriptor> descriptors = featureType.getAttributeDescriptors();
        int length = descriptors.size();
        NativeArray array = (NativeArray) cx.newArray(scope, length);
        for (int i=0; i<length; ++i) {
            array.put(i, array, new Field(scope, descriptors.get(i)));
        }
        return array;
    }

    @JSGetter
    public NativeArray getFieldNames() {
        Scriptable scope = getParentScope();
        Context cx = getCurrentContext();
        List<AttributeDescriptor> descriptors = featureType.getAttributeDescriptors();
        int length = descriptors.size();
        NativeArray array = (NativeArray) cx.newArray(scope, length);
        for (int i=0; i<length; ++i) {
            array.put(i, array, descriptors.get(i).getLocalName());
        }
        return array;
    }

    @JSFunction
    public Field get(String name) {
        Field field = null;
        AttributeDescriptor descriptor = featureType.getDescriptor(name);
        if (descriptor != null) {
            field = new Field(getParentScope(), descriptor);
        }
        return field;
    }

    @JSGetter
    public Scriptable getConfig() {
        Scriptable config = super.getConfig();
        Scriptable scope = getParentScope();
        Context cx = getCurrentContext();
        List<AttributeDescriptor> descriptors = featureType.getAttributeDescriptors();
        int length = descriptors.size();
        NativeArray array = (NativeArray) cx.newArray(scope, length);
        for (int i=0; i<length; ++i) {
            Field field = new Field(scope, descriptors.get(i));
            field.getConfig();
            array.put(i, array, field.getConfig());
        }
        config.put("fields", config, array);
        config.put("name", config, getName());
        return config;
    }

    public Object unwrap() {
        return featureType;
    }
    
    /**
     * Create a config object from an arbitrary object.
     * @param obj
     */
    static NativeObject prepConfig(Scriptable obj) {
        Scriptable scope = ScriptableObject.getTopLevelScope(obj);
        Context cx = getCurrentContext();
        NativeObject config = null;
        if (obj instanceof NativeObject) {
            config = (NativeObject) obj;
        } else if (obj instanceof NativeArray) {
            config = (NativeObject) cx.newObject(scope, "Object");
            config.put("fields", config, (NativeArray) obj);
        } else {
            throw ScriptRuntime.constructError("Error", "Could not create config from argument: " + Context.toString(obj));
        }
        return config;
    }

    public static Schema fromValues(Scriptable scope, NativeObject values) {
        Context cx = getCurrentContext();
        Object[] names = values.getIds();
        Scriptable schemaConfig = cx.newObject(scope);
        Scriptable fields = cx.newArray(scope, names.length);
        for (int i=0; i<names.length; ++i) {
            String name = (String) names[i];
            Object jsValue = values.get(name, values);
            Object value = jsToJava(jsValue);
            String typeName = Field.getTypeName(value);
            if (typeName == null) {
                throw ScriptRuntime.constructError("Error", "Unable to determine type for field: " + name);
            }
            Scriptable fieldConfig = cx.newObject(scope);
            fieldConfig.put("name", fieldConfig, name);
            fieldConfig.put("type", fieldConfig, typeName);
            if (jsValue instanceof Geometry) {
                Projection projection = ((Geometry) jsValue).getProjection();
                if (projection != null) {
                    fieldConfig.put("projection", fieldConfig, projection.getId());
                }
            }
            Field field = new Field(scope, (NativeObject) fieldConfig);
            fields.put(i, fields, field);
        }
        schemaConfig.put("fields", schemaConfig, fields);
        return new Schema(scope, (NativeObject) schemaConfig);
    }
    
    @JSStaticFunction
    public static Schema from_(Scriptable featureTypeObj) {
        SimpleFeatureType featureType = null;
        if (featureTypeObj instanceof Wrapper) {
            Object obj = ((Wrapper) featureTypeObj).unwrap();
            if (obj instanceof SimpleFeatureType) {
                featureType = (SimpleFeatureType) obj;
            }
        }
        if (featureType == null) {
            throw ScriptRuntime.constructError("Error", "Cannot create schema from " + Context.toString(featureTypeObj));
        }
        return new Schema(getTopLevelScope(featureTypeObj), featureType);
    }
    
    public String toFullString() {
        String names = arrayRepr(getFieldNames());
        return "name: \"" + getName() + "\" fields: " + names;
    }

}
