package org.geoscript.js.feature;

import java.math.BigDecimal;
import java.net.URI;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;

import org.geoscript.js.GeoObject;
import org.geoscript.js.GeoScriptShell;
import org.geoscript.js.proj.Projection;
import org.geotools.feature.AttributeTypeBuilder;
import org.geotools.feature.FeatureCollection;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.FunctionObject;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.opengis.feature.type.AttributeDescriptor;
import org.opengis.feature.type.GeometryDescriptor;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

public class Field extends GeoObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = -45254255795575119L;
    
    private enum Type {

        String(String.class),
        Integer(Integer.class),
        Short(Short.class),
        Float(Float.class),
        Long(Long.class),
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
        FeatureCollection(FeatureCollection.class),
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
        
        private static String getName(Class<?> binding) {
            String name = null;
            for (Type type : Type.values()) {
                if (type.binding.equals(binding)) {
                    name = type.name();
                    break;
                }
            }
            return name;
        }
        
    }
    
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
        builder.setBinding(type.binding);

        // optional properties
        Object titleObj = config.get("title");
        if (titleObj instanceof String) {
            title = (String) titleObj;
        }
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

    @JSFunction
    public boolean equals(Object other) {
        // TODO: test this
        return descriptor.equals(other);
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
     * Finishes JavaScript constructor initialization.  
     * Sets up the prototype chain using superclass.
     * 
     * @param scope
     * @param ctor
     * @param prototype
     */
    public static void finishInit(Scriptable scope, FunctionObject ctor, Scriptable prototype) {
        // define any static methods on the constructor
        ctor.defineFunctionProperties(
                new String[] {"getTypeName"}, 
                Field.class,
                ScriptableObject.DONTENUM);
    }
    
    /**
     * Determine the string type for a given value.  Defined as a static method 
     * on the JavaScript constructor.
     */
    public static String getTypeName(Object value) {
        value = GeoScriptShell.jsToJava(value);
        String typeName = null;
        if (value != null) {
            typeName = Type.getName(value.getClass());
        }
        return typeName;
    }


}
