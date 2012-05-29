package org.geoscript.js.geom;

import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class Wrapper {

    public static ScriptableObject wrap(Scriptable scope, com.vividsolutions.jts.geom.Geometry geometry) {
        ScriptableObject wrapped = null;
        if (geometry instanceof com.vividsolutions.jts.geom.Point) {
            wrapped = new Point(scope, (com.vividsolutions.jts.geom.Point) geometry);
        } else if (geometry instanceof com.vividsolutions.jts.geom.LineString) {
            wrapped = new LineString(scope, (com.vividsolutions.jts.geom.LineString) geometry);
        }
        return wrapped;
    }

}
