package org.geoscript.js;

import org.geoscript.js.geom.GeometryWrapper;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.WrapFactory;

public class GeoScriptWrapFactory extends WrapFactory {

    @Override
    public Scriptable wrapAsJavaObject(Context cx, Scriptable scope, Object javaObject,
            Class<?> staticType) {

        Scriptable wrapped = null;
        if (javaObject instanceof com.vividsolutions.jts.geom.Geometry) {
            wrapped = GeometryWrapper.wrap(scope, (com.vividsolutions.jts.geom.Geometry) javaObject);
        }
        if (wrapped == null) {
            wrapped = super.wrapAsJavaObject(cx, scope, javaObject, staticType);
        }
        
        return wrapped;
    }

}
