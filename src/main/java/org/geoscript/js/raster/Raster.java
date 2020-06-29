package org.geoscript.js.raster;

import org.geoscript.js.GeoObject;
import org.geoscript.js.geom.Bounds;
import org.geoscript.js.geom.Point;
import org.geoscript.js.proj.Projection;
import org.geotools.coverage.grid.GridCoordinates2D;
import org.geotools.coverage.grid.GridCoverage2D;
import org.geotools.coverage.grid.GridEnvelope2D;
import org.geotools.coverage.grid.GridGeometry2D;
import org.geotools.geometry.DirectPosition2D;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.mozilla.javascript.*;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.opengis.coverage.SampleDimension;
import org.opengis.geometry.DirectPosition;
import org.opengis.geometry.Envelope;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.TransformException;

import java.util.*;

public class Raster extends GeoObject implements Wrapper {

    private GridCoverage2D coverage;

    public Raster() {
        // Prototype
    }

    public Raster(GridCoverage2D coverage) {
        this.coverage = coverage;
    }

    public Raster(Scriptable scope, GridCoverage2D coverage) {
        this(coverage);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Raster.class));
    }

    @JSGetter
    public String getName() {
        return this.coverage.getName().toString();
    }

    @JSGetter
    public Projection getProj() {
        return new Projection(this.getParentScope(), this.coverage.getCoordinateReferenceSystem2D());
    }

    @JSGetter
    public Bounds getBounds() {
        Envelope env = coverage.getEnvelope();
        CoordinateReferenceSystem crs = env.getCoordinateReferenceSystem();
        if (crs == null) {
            crs = this.coverage.getCoordinateReferenceSystem2D();
        }
        double[] l = env.getLowerCorner().getCoordinate();
        double[] u = env.getUpperCorner().getCoordinate();
        ReferencedEnvelope referencedEnvelope = new ReferencedEnvelope(l[0], u[0], l[1], u[1], crs);
        return new Bounds(this.getParentScope(), referencedEnvelope);
    }

    @JSGetter
    public NativeArray getSize() {
        GridEnvelope2D gridEnvelope2D = coverage.getGridGeometry().getGridRange2D();
        return (NativeArray) javaToJS(Arrays.asList(
                (int) gridEnvelope2D.getWidth(),
                (int) gridEnvelope2D.getHeight()
        ), this.getParentScope());
    }

    @JSGetter
    public int getCols() {
        return (int) getSize().get(0);
    }

    @JSGetter
    public int getRows() {
        return (int) getSize().get(1);
    }

    @JSGetter
    public NativeArray getBands() {
        List<Band> bands = new ArrayList<>();
        for(int i = 0; i<coverage.getNumSampleDimensions(); i++) {
            SampleDimension d = coverage.getSampleDimension(i);
            Band band = new Band(this.getParentScope(), d);
            bands.add(band);
        }
        return (NativeArray) javaToJS(bands, this.getParentScope());
    }

    @JSFunction
    public Point getPoint(int x, int y) {
        GridGeometry2D gg = coverage.getGridGeometry();
        try {
            DirectPosition2D dp = (DirectPosition2D) gg.gridToWorld(new GridCoordinates2D(x, y));
            Map<String,Object> coords = new HashMap<>();
            coords.put("coordinates", Arrays.asList(dp.x, dp.y));
            return new Point(this.getParentScope(), (NativeObject) javaToJS(coords, this.getParentScope()));
        } catch (TransformException e) {
            throw ScriptRuntime.constructError("Error", "Error getting Point from pixel coordinates for Raster.");
        }
    }

    @JSFunction
    public Object getValue(Object pointOrPixel) {
        Point point;
        if (pointOrPixel instanceof Point) {
            point = (Point) pointOrPixel;
        } else {
            NativeObject obj = (NativeObject) pointOrPixel;
            int x = (int) obj.get("x", this.getParentScope());
            int y = (int) obj.get("y", this.getParentScope());
            point = getPoint(x, y);
        }
        DirectPosition dp = new DirectPosition2D(coverage.getCoordinateReferenceSystem2D(), (double) point.getX(), (double) point.getY());
        Object result =  coverage.evaluate(dp);
        return javaToJS(result, getParentScope());
    }

    @Override
    public String toString() {
        return this.getName();
    }

    @Override
    public Object unwrap() {
        return coverage;
    }

    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        if (inNewExpr) {
            return new Raster(null);
        } else {
            return new Raster(ctorObj.getParentScope(), null);
        }
    }

}
