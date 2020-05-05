package org.geoscript.js.geom;

import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class GeometryWrapper {

    public static ScriptableObject wrap(Scriptable scope, org.locationtech.jts.geom.Geometry geometry) {
        ScriptableObject wrapped = null;
        try {
            if (geometry instanceof org.locationtech.jts.geom.Point) {
                wrapped = new Point(scope, (org.locationtech.jts.geom.Point) geometry);
            } else if (geometry instanceof org.geotools.geometry.jts.CompoundCurve) {
                wrapped = new CompoundCurve(scope, (org.geotools.geometry.jts.CompoundCurve) geometry);
            } else if (geometry instanceof org.geotools.geometry.jts.CircularString) {
                wrapped = new CircularString(scope, (org.geotools.geometry.jts.CircularString) geometry);
            } else if (geometry instanceof org.locationtech.jts.geom.LineString) {
                wrapped = new LineString(scope, (org.locationtech.jts.geom.LineString) geometry);
            } else if (geometry instanceof org.locationtech.jts.geom.Polygon) {
                wrapped = new Polygon(scope, (org.locationtech.jts.geom.Polygon) geometry);
            } else if (geometry instanceof org.locationtech.jts.geom.MultiPoint) {
                wrapped = new MultiPoint(scope, (org.locationtech.jts.geom.MultiPoint) geometry);
            } else if (geometry instanceof org.locationtech.jts.geom.MultiLineString) {
                wrapped = new MultiLineString(scope, (org.locationtech.jts.geom.MultiLineString) geometry);
            } else if (geometry instanceof org.locationtech.jts.geom.MultiPolygon) {
                wrapped = new MultiPolygon(scope, (org.locationtech.jts.geom.MultiPolygon) geometry);
            } else if (geometry instanceof org.locationtech.jts.geom.GeometryCollection) {
                wrapped = new GeometryCollection(scope, (org.locationtech.jts.geom.GeometryCollection) geometry);
            }
        } catch (Exception e) {
            throw new RuntimeException("Trouble wrapping geometry", e);
        }
        return wrapped;
    }


}
