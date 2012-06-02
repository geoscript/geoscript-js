package org.geoscript.js.geom;

import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class GeometryWrapper {

    public static ScriptableObject wrap(Scriptable scope, com.vividsolutions.jts.geom.Geometry geometry) {
        ScriptableObject wrapped = null;
        try {
            if (geometry instanceof com.vividsolutions.jts.geom.Point) {
                wrapped = new Point(scope, (com.vividsolutions.jts.geom.Point) geometry);
            } else if (geometry instanceof com.vividsolutions.jts.geom.LineString) {
                wrapped = new LineString(scope, (com.vividsolutions.jts.geom.LineString) geometry);
            } else if (geometry instanceof com.vividsolutions.jts.geom.Polygon) {
                wrapped = new Polygon(scope, (com.vividsolutions.jts.geom.Polygon) geometry);
            }
        } catch (Exception e) {
            throw new RuntimeException("Trouble wrapping geometry", e);
        }
        return wrapped;
    }


}
