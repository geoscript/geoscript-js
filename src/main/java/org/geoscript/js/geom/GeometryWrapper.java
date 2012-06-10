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
            } else if (geometry instanceof com.vividsolutions.jts.geom.GeometryCollection) {
                wrapped = new GeometryCollection(scope, (com.vividsolutions.jts.geom.GeometryCollection) geometry);
            } else if (geometry instanceof com.vividsolutions.jts.geom.MultiPoint) {
                wrapped = new MultiPoint(scope, (com.vividsolutions.jts.geom.MultiPoint) geometry);
            } else if (geometry instanceof com.vividsolutions.jts.geom.MultiLineString) {
                wrapped = new MultiLineString(scope, (com.vividsolutions.jts.geom.MultiLineString) geometry);
            } else if (geometry instanceof com.vividsolutions.jts.geom.MultiPolygon) {
                wrapped = new MultiPolygon(scope, (com.vividsolutions.jts.geom.MultiPolygon) geometry);
            }
        } catch (Exception e) {
            throw new RuntimeException("Trouble wrapping geometry", e);
        }
        return wrapped;
    }


}
