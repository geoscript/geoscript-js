package org.geoscript.js.geom;

import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class Wrapper {

    public static ScriptableObject wrap(Scriptable scope, com.vividsolutions.jts.geom.Point geometry) {
        return new Point(scope, geometry);
    }
    public static ScriptableObject wrap(Scriptable scope, com.vividsolutions.jts.geom.LineString geometry) {
        return new LineString(scope, geometry);
    }

}
