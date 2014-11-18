package org.geoscript.js.geom;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.linearref.LengthIndexedLine;

public class LineString extends Geometry implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = -5048539260091857410L;

    /**
     * Prototype constructor.
     * @return 
     */
    public LineString() {
    }

    /**
     * Constructor for config object.
     * @param config
     */
    public LineString(NativeObject config) {
        NativeArray array = (NativeArray) config.get("coordinates", config);
        Coordinate[] coords = arrayToCoords(array);
        setGeometry(factory.createLineString(coords));
    }


    /**
     * Constructor for config object (without new keyword).
     * @param scope
     * @param config
     */
    public LineString(Scriptable scope, NativeObject config) {
        this(config);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(LineString.class));
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public LineString(Scriptable scope, com.vividsolutions.jts.geom.LineString geometry) {
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(LineString.class));
        setGeometry(geometry);
    }

    /**
     * JavaScript constructor.
     * @param cx
     * @param args
     * @param ctorObj
     * @param inNewExpr
     * @return
     */
    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        if (args.length != 1) {
            throw ScriptRuntime.constructError("Error", "LineString constructor takes a single argument");
        }
        NativeObject config = prepConfig(cx, (Scriptable) args[0]);
        LineString line = null;
        if (inNewExpr) {
            line = new LineString(config);
        } else {
            line = new LineString(config.getParentScope(), config);
        }
        return line;
    }

    /**
     * Getter for coordinates
     * @return
     */
    @JSGetter
    public NativeArray getCoordinates() {
        return coordsToArray(getGeometry().getCoordinates());
    }
    
    @JSGetter
    public Point getEndPoint() {
        com.vividsolutions.jts.geom.Point end = ((com.vividsolutions.jts.geom.LineString) getGeometry()).getEndPoint();
        return new Point(getParentScope(), end);
    }

    @JSGetter
    public Point getStartPoint() {
        com.vividsolutions.jts.geom.Point start = ((com.vividsolutions.jts.geom.LineString) getGeometry()).getStartPoint();
        return new Point(getParentScope(), start);
    }

    @JSGetter
    public NativeArray getEndPoints() {
        Context cx = getCurrentContext();
        return (NativeArray) cx.newArray(getParentScope(), new Object[] {getStartPoint(), getEndPoint()});
    }
    
    @JSFunction
    public LineString reverse() {
        return (LineString) GeometryWrapper.wrap(getParentScope(), getGeometry().reverse());
    }

    @JSFunction
    public Point interpolatePoint(double position) {
        LengthIndexedLine indexedLine = new LengthIndexedLine(this.getGeometry());
        Coordinate c = indexedLine.extractPoint(position * getLength());
        return new Point(getParentScope(), factory.createPoint(c));
    }

    @JSFunction
    public double locatePoint(Point point) {
        LengthIndexedLine indexedLine = new LengthIndexedLine(this.getGeometry());
        double position = indexedLine.indexOf(point.getGeometry().getCoordinate());
        double percentAlong = position / getLength();
        return percentAlong;
    }

    @JSFunction
    public Point placePoint(Point point) {
        LengthIndexedLine indexedLine = new LengthIndexedLine(this.getGeometry());
        double position = indexedLine.indexOf(point.getGeometry().getCoordinate());
        Coordinate c = indexedLine.extractPoint(position);
        return new Point(getParentScope(), factory.createPoint(c));
    }

    @JSFunction
    public LineString subLine(double start, double end) {
        LengthIndexedLine indexedLine = new LengthIndexedLine(this.getGeometry());
        double length = getLength();
        return new LineString(getParentScope(),
                (com.vividsolutions.jts.geom.LineString) indexedLine.extractLine(start * length, end * length));
    }

    /**
     * Returns underlying JTS geometry.
     */
    public com.vividsolutions.jts.geom.LineString unwrap() {
        return (com.vividsolutions.jts.geom.LineString) getGeometry();
    }

}
