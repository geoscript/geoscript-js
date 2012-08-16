package org.geoscript.js.feature;

import org.geoscript.js.GeoObject;
import org.geoscript.js.proj.Projection;
import org.geotools.feature.AttributeTypeBuilder;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;
import org.mozilla.javascript.annotations.JSStaticFunction;
import org.opengis.feature.type.AttributeDescriptor;
import org.opengis.feature.type.GeometryDescriptor;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

public class Field extends GeoObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = -45254255795575119L;
    
    /**
     * Optional title.
     */
    private String title;

    private AttributeDescriptor descriptor;
    
    /**
     * Prototype constructor.
     */
    public Field() {
    }
    /**
     * Constructor from AttributeDescriptor.
     * @param scope
     * @param crs
     */
    public Field(Scriptable scope, AttributeDescriptor descriptor) {
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Field.class));
        this.descriptor = descriptor;
    }

    /**
     * Constructor from NativeObject (from Java).
     * @param scope
     * @param config
     */
    public Field(Scriptable scope, NativeObject config) {
        this(config);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Field.class));
    }

    private Field(NativeObject config) {
        Object nameObj = config.get("name");
        if (!(nameObj instanceof String)) {
            throw ScriptRuntime.constructError("Error", "Field config must have name property.");
        }
        String name = (String) nameObj;
        Object typeObj = config.get("type");
        if (!(typeObj instanceof String)) {
            throw ScriptRuntime.constructError("Error", "Field config must have type property.");
        }
        String typeName = (String) typeObj;
        Type type;
        try {
            type = Type.valueOf(typeName);
        } catch (IllegalArgumentException e) {
            throw ScriptRuntime.constructError("Error", "Unsupported field type: " + typeName);
        }
        AttributeTypeBuilder builder = new AttributeTypeBuilder();
        builder.setName(name);
        builder.setBinding(type.getBinding());

        Object descObj = config.get("description");
        if (descObj instanceof String) {
            builder.setDescription((String) descObj);
        }
        Object projObj = config.get("projection");
        CoordinateReferenceSystem crs = null;
        if (projObj instanceof CoordinateReferenceSystem) {
            crs = (CoordinateReferenceSystem) projObj;
        } else if (projObj instanceof String) {
            crs = new Projection(getParentScope(), (String) projObj).unwrap();
        } else if (projObj != null){
            throw ScriptRuntime.constructError("Error", "Invalid projection object.");
        }
        if (crs != null) {
            builder.setCRS(crs);
        }
        Object minOccursObj = config.get("minOccurs");
        if (minOccursObj instanceof Integer) {
            builder.setMinOccurs((Integer) minOccursObj);
        }
        Object maxOccursObj = config.get("maxOccurs");
        if (maxOccursObj instanceof Integer) {
            builder.setMaxOccurs((Integer) maxOccursObj);
        }
        Object isNillableObj = config.get("isNillable");
        if (isNillableObj instanceof Boolean) {
            builder.setNillable((Boolean) isNillableObj);
        }
        Object defaultValue = config.get("defaultValue");
        // TODO check undefined here instead
        if (defaultValue != null) {
            builder.setDefaultValue(defaultValue);
        }
        descriptor = builder.buildDescriptor(name);
    }
    
    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        if (!inNewExpr) {
            throw ScriptRuntime.constructError("Error", "Call constructor with new keyword.");
        }
        Field field = null;
        Object arg = args[0];
        if (arg instanceof NativeObject) {
            field = new Field((NativeObject) arg);
        }
        return field;
    }
    
    @JSGetter
    public String getTitle() {
        return title;
    }
    
    @JSGetter
    public String getName() {
        return descriptor.getLocalName();
    }
    
    @JSGetter
    public String getDescription()  {
        return descriptor.getType().getDescription().toString();
    }
    
    @JSGetter
    public String getType() {
        Class<?> binding = descriptor.getType().getBinding();
        return Type.getName(binding);
    }
    
    @JSGetter
    public int getMinOccurs() {
        return descriptor.getMinOccurs();
    }

    @JSGetter
    public int getMaxOccurs() {
        return descriptor.getMaxOccurs();
    }

    @JSGetter
    public boolean getIsNillable() {
        return descriptor.isNillable();
    }
    
    @JSGetter
    public Object getDefaultValue() {
        return descriptor.getDefaultValue();
    }
    
    @JSGetter
    public Projection getProjection() {
        Projection projection = null;
        if (descriptor instanceof GeometryDescriptor) {
            CoordinateReferenceSystem crs = ((GeometryDescriptor) descriptor).getCoordinateReferenceSystem();
            projection = new Projection(getParentScope(), crs);
        }
        return projection;
    }

    @JSGetter
    public Scriptable getConfig() {
        Scriptable config = super.getConfig();
        Context cx = getCurrentContext();
        Scriptable def = cx.newObject(getParentScope());
        def.put("name", def, getName());
        def.put("type", def, getType());
        Projection projection = getProjection();
        if (projection != null) {
            def.put("projection", def, projection.getId());
        }
        config.put("def", config, def);
        return config;
    }

    public Object unwrap() {
        return descriptor;
    }
    
    /**
     * Determine the string type for a given value.  Defined as a static method 
     * on the JavaScript constructor.
     */
    @JSStaticFunction
    public static String getTypeName(Object value) {
        value = jsToJava(value);
        String typeName = null;
        if (value != null) {
            typeName = Type.getName(value.getClass());
        }
        return typeName;
    }
    
    public String toFullString() {
        return "name: \"" + getName() + "\" type: " + getType();
    }


}
