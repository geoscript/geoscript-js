package org.geoscript.js;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.WrapFactory;

import com.vividsolutions.jts.geom.Geometry;

public class GeoScriptWrapFactory extends WrapFactory {

    @Override
    public Scriptable wrapAsJavaObject(Context cx, Scriptable scope, Object javaObject,
            Class<?> staticType) {
        
        if (javaObject instanceof Geometry) {
            // wrap it
        }
        
        return super.wrapAsJavaObject(cx, scope, javaObject, staticType);
    }

}
