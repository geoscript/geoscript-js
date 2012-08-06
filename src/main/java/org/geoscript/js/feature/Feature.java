package org.geoscript.js.feature;

import org.geoscript.js.GeoObject;
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
import org.mozilla.javascript.annotations.JSGetter;
import org.mozilla.javascript.annotations.JSSetter;
import org.opengis.feature.GeometryAttribute;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
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
        Object valuesObj = config.get("values");
        NativeObject values = null;
        if (valuesObj instanceof NativeObject) {
            values = (NativeObject) valuesObj;
        }
        if (schemaObj instanceof Schema) {
            schema = (Schema) schemaObj;
        } else if (schemaObj instanceof NativeObject) {
            Scriptable scope = ScriptableObject.getTopLevelScope(config);
            schema = new Schema(scope, config);
        } else {
            if (values != null) {
                Scriptable scope = ScriptableObject.getTopLevelScope(config);
                schema = Schema.fromValues(scope, values);
            } else {
                throw ScriptRuntime.constructError("Error", "Feature config must include schema or values.");
            }
        }
        SimpleFeatureBuilder builder = new SimpleFeatureBuilder((SimpleFeatureType) schema.unwrap());
        if (values != null) {
            Object[] names = values.getIds();
            for (Object nameObj : names) {
                String name = (String) nameObj;
                Object value = values.get(name);
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
    public ScriptableObject getGeometry() {
        com.vividsolutions.jts.geom.Geometry geometry = 
            (com.vividsolutions.jts.geom.Geometry) feature.getDefaultGeometry();
        ScriptableObject jsObj = GeometryWrapper.wrap(getParentScope(), geometry);
        Geometry jsGeom = (Geometry) jsObj;
        jsGeom.setProjection(getProjection());
        return jsObj;
    }
    
    @JSSetter
    public void setGeometry(com.vividsolutions.jts.geom.Geometry geometry) {
        // TODO: accept GeoScript geometry instead and set feature projection
        feature.setDefaultGeometry(geometry);
    }
    
    @JSSetter
    public void setProjection(CoordinateReferenceSystem crs) {
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
    
}
