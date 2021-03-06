package org.geoscript.js.raster;

import org.geoscript.js.GeoObject;
import org.geoscript.js.geom.Bounds;
import org.geoscript.js.geom.Geometry;
import org.geoscript.js.geom.Point;
import org.geoscript.js.proj.Projection;
import org.geotools.coverage.Category;
import org.geotools.coverage.GridSampleDimension;
import org.geotools.coverage.grid.*;
import org.geotools.coverage.processing.CoverageProcessor;
import org.geotools.geometry.DirectPosition2D;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.geotools.process.raster.RangeLookupProcess;
import org.geotools.util.NumberRange;
import org.jaitools.numeric.Range;
import org.mozilla.javascript.*;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.opengis.coverage.SampleDimension;
import org.opengis.geometry.DirectPosition;
import org.opengis.geometry.Envelope;
import org.opengis.parameter.ParameterValueGroup;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.TransformException;

import javax.media.jai.RasterFactory;
import java.awt.*;
import java.awt.image.DataBuffer;
import java.awt.image.WritableRaster;
import java.util.*;
import java.util.List;

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
    public NativeObject getPixel(Point point) {
        GridGeometry2D gg = coverage.getGridGeometry();
        try {
            GridCoordinates2D gridCoordinates2D = gg.worldToGrid(new DirectPosition2D((double) point.getX(), (double) point.getY()));
            Map<String, Double> pixel = new HashMap<>();
            pixel.put("x", gridCoordinates2D.getX());
            pixel.put("y", gridCoordinates2D.getY());
            return (NativeObject) javaToJS(pixel, this.getParentScope());
        } catch (TransformException e) {
            throw ScriptRuntime.constructError("Error", "Error getting Pixel coordinate from Point for Raster.");
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

    @JSFunction
    public Raster crop(Object boundsOrGeometry) {
        CoverageProcessor processor = new CoverageProcessor();
        ParameterValueGroup params = processor.getOperation("CoverageCrop").getParameters();
        params.parameter("Source").setValue(coverage);
        if (boundsOrGeometry instanceof Bounds) {
            Bounds bounds = (Bounds) boundsOrGeometry;
            params.parameter("Envelope").setValue(new org.geotools.geometry.GeneralEnvelope(bounds.unwrap()));
        } else {
            Geometry geometry = (Geometry) boundsOrGeometry;
            params.parameter("ROI").setValue(geometry.unwrap());
        }
        GridCoverage2D newCoverage = (GridCoverage2D) processor.doOperation(params);
        return new Raster(this.getParentScope(), newCoverage);
    }

    @JSFunction
    public Raster reproject(Projection projection) {
        CoverageProcessor processor = new CoverageProcessor();
        ParameterValueGroup params = processor.getOperation("Resample").getParameters();
        params.parameter("Source").setValue(coverage);
        params.parameter("CoordinateReferenceSystem").setValue(projection.unwrap());
        GridCoverage2D newCoverage = (GridCoverage2D) processor.doOperation(params);
        return new Raster(this.getParentScope(), newCoverage);
    }

    @JSFunction
    public Raster reclassify(NativeArray ranges, NativeObject options) {
        int band = (int) options.getOrDefault("band", 0);
        double noData  = (double) options.getOrDefault("noData",0);
        List<Range> rangeList = new ArrayList<>();
        int[] pixelValues = new int[ranges.size()];
        for(int i = 0; i<ranges.size(); i++) {
            NativeObject rangeObj = (NativeObject) ranges.get(i);
            pixelValues[i] = getInt(rangeObj.get("value"));
            rangeList.add(Range.create(
                Double.parseDouble(rangeObj.get("min").toString()),
                (boolean) rangeObj.getOrDefault("minIncluded", true),
                Double.parseDouble(rangeObj.get("max").toString()),
                (boolean) rangeObj.getOrDefault("maxIncluded", true)
            ));
        }
        RangeLookupProcess process = new RangeLookupProcess();
        GridCoverage2D newCoverage = process.execute(this.coverage, band, rangeList, pixelValues, noData, null);
        return new Raster(this.getParentScope(), newCoverage);
    }

    @JSGetter
    public NativeObject getExtrema() {
        CoverageProcessor processor = new CoverageProcessor();
        ParameterValueGroup params = processor.getOperation("Extrema").getParameters();
        params.parameter("Source").setValue(coverage);
        GridCoverage2D coverage = (GridCoverage2D) processor.doOperation(params);
        Map<String, Object> values = new HashMap<>();
        values.put("min", coverage.getProperty("minimum"));
        values.put("max",coverage.getProperty("maximum"));
        return (NativeObject) javaToJS(values, this.getParentScope());
    }

    @JSFunction
    public Object getMinValue(int band) {
        double minValue = this.coverage.getSampleDimension(band).getMinimumValue();
        if (Double.isInfinite(minValue)) {
            minValue = ((double[])this.getExtrema().get("min"))[band];
        }
        return minValue;
    }

    @JSFunction
    public Object getMaxValue(int band) {
        double maxValue = this.coverage.getSampleDimension(band).getMaximumValue();
        if (Double.isInfinite(maxValue)) {
            maxValue = ((double[])this.getExtrema().get("max"))[band];
        }
        return maxValue;
    }

    @JSGetter
    public NativeArray getBlockSize() {
        int[] size = this.coverage.getOptimalDataBlockSizes();
        return (NativeArray) javaToJS(Arrays.asList(
                size[0],
                size[1]
        ), this.getParentScope());
    }

    @JSGetter
    public NativeArray getPixelSize() {
        Bounds bounds = this.getBounds();
        NativeArray size = this.getSize();
        return (NativeArray) javaToJS(Arrays.asList(
                ((double) bounds.getWidth()) / ((int)size.get(0)),
                ((double) bounds.getHeight()) / ((int)size.get(1))
        ), this.getParentScope());
    }

    private int getInt(Object obj) {
        if (obj instanceof Number) {
            return ((Number)obj).intValue();
        } else {
            return getInt(Double.parseDouble(obj.toString()));
        }
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
        NativeArray data = (NativeArray) args[0];
        Bounds bounds = (Bounds) args[1];

        double min = Double.MAX_VALUE;
        double max = Double.MIN_VALUE;
        float[][] matrix = new float[(int) data.getLength()][ (int) (data.getLength() > 0 ? ((NativeArray) data.get(0)).getLength() : 0)];
        for(int i = 0; i<data.getLength(); i++) {
            NativeArray datum = (NativeArray) data.get(i);
            for(int j = 0; j<datum.getLength(); j++) {
                float value = ((Number)datum.get(j)).floatValue();
                if (!Float.isNaN(value) && value < min) {
                    min = value;
                }
                if (!Float.isNaN(value) && value > max) {
                    max = value;
                }
                matrix[i][j] = value;
            }
        }

        int width = matrix[0].length;
        int height = matrix.length;

        WritableRaster writableRaster = RasterFactory.createBandedRaster(DataBuffer.TYPE_FLOAT, width, height, 1, null);
        for(int i = 0; i<width; i++) {
            for(int j = 0; j<height; j++) {
                writableRaster.setSample(i, j, 0, matrix[j][i]);
            }
        }

        GridCoverageFactory gridCoverageFactory = new GridCoverageFactory();
        Category category = new Category("Raster", Color.BLACK, NumberRange.create(min, max));
        GridSampleDimension gridSampleDimension = new GridSampleDimension("Raster", new Category[]{category}, null);
        GridCoverage2D coverage = gridCoverageFactory.create("Raster", writableRaster, bounds.unwrap(), new GridSampleDimension[]{gridSampleDimension});
        if (inNewExpr) {
            return new Raster(coverage);
        } else {
            return new Raster(ctorObj.getParentScope(), coverage);
        }
    }

}
