package org.geoscript.js;

import org.geoscript.js.feature.Feature;
import org.geoscript.js.feature.Schema;
import org.geoscript.js.geom.Bounds;
import org.geoscript.js.geom.GeometryWrapper;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.WrapFactory;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

public class GeoScriptWrapFactory extends WrapFactory {

    @Override
    public Scriptable wrapAsJavaObject(Context cx, Scriptable scope, Object javaObject,
            Class<?> staticType) {

        Scriptable wrapped = null;
        if (javaObject instanceof com.vividsolutions.jts.geom.Geometry) {
            wrapped = GeometryWrapper.wrap(scope, (com.vividsolutions.jts.geom.Geometry) javaObject);
        } else if (javaObject instanceof ReferencedEnvelope) {
            wrapped = new Bounds(scope, (ReferencedEnvelope) javaObject);
        } else if (javaObject instanceof SimpleFeature) {
            wrapped = new Feature(scope, (SimpleFeature) javaObject);
        } else if (javaObject instanceof SimpleFeatureType) {
            wrapped = new Schema(scope, (SimpleFeatureType) javaObject);
        }
        if (wrapped == null) {
            wrapped = super.wrapAsJavaObject(cx, scope, javaObject, staticType);
        }
        
        return wrapped;
    }

}
