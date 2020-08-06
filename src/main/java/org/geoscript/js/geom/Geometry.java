package org.geoscript.js.geom;

import java.lang.reflect.Member;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import org.locationtech.jts.algorithm.construct.LargestEmptyCircle;
import org.locationtech.jts.algorithm.construct.MaximumInscribedCircle;
import org.locationtech.jts.densify.Densifier;
import org.geoscript.js.GeoObject;
import org.geoscript.js.proj.Projection;
import org.geotools.geometry.jts.GeometryCoordinateSequenceTransformer;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.geotools.referencing.CRS;
import org.locationtech.jts.triangulate.ConformingDelaunayTriangulationBuilder;
import org.locationtech.jts.triangulate.DelaunayTriangulationBuilder;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.FunctionObject;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeJavaMethod;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.mozilla.javascript.annotations.JSSetter;
import org.mozilla.javascript.annotations.JSStaticFunction;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.TransformException;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Envelope;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.operation.buffer.VariableBuffer;
import org.locationtech.jts.operation.buffer.BufferOp;
import org.locationtech.jts.operation.buffer.BufferParameters;
import org.locationtech.jts.triangulate.VoronoiDiagramBuilder;
import org.locationtech.jts.simplify.DouglasPeuckerSimplifier;

public class Geometry extends GeoObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 8771743870215086281L;

    private org.locationtech.jts.geom.Geometry geometry;
    
    protected static GeometryFactory factory = new GeometryFactory();
    
    private Projection projection;

    /**
     * Geometry prototype constructor.
     */
    public Geometry() {
    }
    
    org.locationtech.jts.geom.Geometry getGeometry() {
        return geometry;
    }
    
    void setGeometry(org.locationtech.jts.geom.Geometry geometry) {
        this.geometry = geometry;
    }
    
    @Override
    public Object get(String name, Scriptable start) {
        Object member = null;
        if (geometry != null) {
            member = getNativeMethod(name);
        }
        if (member == null) {
            member = super.get(name, start);
        }
        return member;
    }
    

    /**
     * Convert the provided object into an acceptable geometry config object.
     * @param context
     * @param configObj
     * @return
     */
    protected static NativeObject prepConfig(Context context, Scriptable configObj) {
        Scriptable scope = configObj.getParentScope();
        NativeObject config = null;
        if (configObj instanceof NativeObject) {
            getRequiredMember(configObj, "coordinates", NativeArray.class, "Array");
            config = (NativeObject) configObj;
        } else if (configObj instanceof NativeArray) {
            NativeArray array = (NativeArray) configObj;
            config = (NativeObject) context.newObject(scope);
            config.put("coordinates", config, array);
        } else {
            throw ScriptRuntime.constructError("Error", 
                    "Geometry config must be an array or an object with a coordinates member");
        }
        return config;
    }
    
    /**
     * Create a JavaScript method from an underlying JTS Geometry method where
     * possible.
     * @param name Method name
     * @return
     */
    Object getNativeMethod(String name) {
        NativeJavaMethod nativeMethod = null;
        Method method = null;

        List<String> unary = Arrays.asList(
                "isEmpty", "isRectangle", "isSimple", "isValid");

        if (unary.contains(name)) {
            try {
                method = geometry.getClass().getMethod(name);
            } catch (Exception e) {
                throw new RuntimeException("Unable to find method: " + name, e);
            }
            return new NativeJavaMethod(method, name);
        }
        
        List<String> binary = Arrays.asList(
                "contains", "coveredBy", "covers", "crosses", "disjoint", 
                "equals", "equalsExact", "overlaps", "intersects", "touches",
                "within");
        
        if (binary.contains(name)) {
            try {
                method = geometry.getClass().getMethod(name, org.locationtech.jts.geom.Geometry.class);
            } catch (Exception e) {
                throw new RuntimeException("Unable to find method: " + name, e);
            }
            try {
                return new BinaryFunction(name, method, getParentScope(), this);
            } catch (Exception e) {
                throw new RuntimeException("Failed to create binary method for " + name, e);
            }
        }
        
        List<String> constructive0 = Arrays.asList(
                "clone", "convexHull", "getBoundary", "getEnvelope");

        if (constructive0.contains(name)) {
            try {
                method = geometry.getClass().getMethod(name);
            } catch (Exception e) {
                throw new RuntimeException("Unable to find method: " + name, e);
            }
            try {
                return new ConstructiveFunction0(name, method, getParentScope(), this);
            } catch (Exception e) {
                throw new RuntimeException("Failed to create constructive method for " + name, e);
            }
        }
        
        List<String> constructive1 = Arrays.asList(
                "difference", "intersection", "symDifference", "union");

        if (constructive1.contains(name)) {
            try {
                method = geometry.getClass().getMethod(name, org.locationtech.jts.geom.Geometry.class);
            } catch (Exception e) {
                throw new RuntimeException("Unable to find method: " + name, e);
            }
            try {
                return new ConstructiveFunction1(name, method, getParentScope(), this);
            } catch (Exception e) {
                throw new RuntimeException("Failed to create constructive method for " + name, e);
            }
        }

        return nativeMethod;
    }
    
    @JSGetter
    public Bounds getBounds() {
        Envelope env = geometry.getEnvelopeInternal();
        CoordinateReferenceSystem crs = null;
        if (projection != null) {
            crs = projection.unwrap();
        }
        ReferencedEnvelope refEnv = new ReferencedEnvelope(env, crs);
        return new Bounds(getParentScope(), refEnv);
    }
    
    @JSGetter
    public Point getCentroid() {
        Geometry geom = (Geometry) GeometryWrapper.wrap(getParentScope(), geometry.getCentroid());
        if (projection != null) {
            geom.projection = projection;
        }
        return (Point) geom;
    }
    
    @JSFunction
    public Geometry transform(Object projObj) {
        Projection fromProj = projection;
        if (fromProj == null) {
            throw new RuntimeException("Geometry must have a projection before transforming.");
        }
        Projection toProj = null;
        if (projObj instanceof Projection) {
            toProj = (Projection) projObj;
        } else if (projObj instanceof String) {
            toProj = new Projection(getParentScope(), (String) projObj);
        } else {
            throw new RuntimeException("Argument must be a Projection instance or string identifier.");
        }
        GeometryCoordinateSequenceTransformer gt = new GeometryCoordinateSequenceTransformer();
        try {
            gt.setMathTransform(CRS.findMathTransform(fromProj.unwrap(), toProj.unwrap()));
        } catch (FactoryException e) {
            throw new RuntimeException("Failed to find transform.", e);
        }
        org.locationtech.jts.geom.Geometry transGeom;
        try {
            transGeom = gt.transform((org.locationtech.jts.geom.Geometry) this.unwrap());
        } catch (TransformException e) {
            throw new RuntimeException("Failed to transform.", e);
        }
        Geometry transformed = (Geometry) GeometryWrapper.wrap(getParentScope(), transGeom);
        transformed.projection = toProj;
        return transformed;
    }
    
    @JSFunction 
    public double distance(Geometry other) {
        other = sameProjection(this, other);
        return geometry.distance((org.locationtech.jts.geom.Geometry) other.unwrap());
    }
    
    @JSFunction
    public Geometry buffer(double distance, NativeObject options) {
        BufferParameters params = new BufferParameters();
        if (options != null) {
            Object segsObj = options.get("segs", options);
            if (segsObj instanceof Integer) {
                params.setQuadrantSegments((Integer) segsObj);
            }
            Object singleObj = options.get("single", options);
            if (singleObj instanceof Boolean) {
                params.setSingleSided((Boolean) singleObj);
            }
            Object capsObj = options.get("caps", options);
            if (capsObj instanceof Integer) {
                params.setEndCapStyle((Integer) capsObj);
            }
        }
        org.locationtech.jts.geom.Geometry buffered = BufferOp.bufferOp(getGeometry(), distance, params);
        Geometry wrapped = (Geometry) GeometryWrapper.wrap(getParentScope(), buffered);
        if (projection != null) {
            wrapped.projection = projection;
        }
        return wrapped;
    }

    @JSFunction
    public Geometry variableBuffer(NativeArray distances) {
        if (distances.size() == 2) {
            return (Geometry) GeometryWrapper.wrap(getParentScope(), VariableBuffer.buffer(getGeometry(), getDouble(distances.get(0)), getDouble(distances.get(1))));
        } else if (distances.size() == 3) {
            return (Geometry) GeometryWrapper.wrap(getParentScope(), VariableBuffer.buffer(getGeometry(), getDouble(distances.get(0)), getDouble(distances.get(1)), getDouble(distances.get(2))));
        }  else {
            return (Geometry) GeometryWrapper.wrap(getParentScope(), VariableBuffer.buffer(getGeometry(), distances.stream().mapToDouble(d -> getDouble(d)).toArray()));
        }
    }

    private double getDouble(Object obj) {
        return ((Number) obj).doubleValue();
    }

    @JSGetter
    public Projection getProjection() {
        return projection;
    }
    
    @JSSetter
    public void setProjection(Object projObj) {
        Projection projection = null;
        if (projObj != null) {
            if (projObj instanceof Projection) {
                projection = (Projection) projObj;
            } else if (projObj instanceof String) {
                projection = new Projection(getParentScope(), (String) projObj);
            } else {
                throw ScriptRuntime.constructError("Error", "Set projection with Projection object or string identifier.");
            }
            if (this.projection != null && !projection.equals(this.projection)) {
                throw ScriptRuntime.constructError("Error", "Geometry projection already set.  Use the transform method to transform coordinates.");
            }
        }
        this.projection = projection;
    }
    
    @JSGetter
    public double getArea() {
        double area = 0;
        if (geometry != null) {
            area = geometry.getArea();
        }
        return area;
    }
    
    @JSFunction
    public ScriptableObject simplify(double tolerance) {
        org.locationtech.jts.geom.Geometry geom = DouglasPeuckerSimplifier.simplify(geometry, tolerance);
        ScriptableObject simplified = GeometryWrapper.wrap(getParentScope(), geom);
        ((Geometry) simplified).projection = projection;
        return simplified;
    }

    @JSFunction
    public ScriptableObject densify(double tolerance) {
        org.locationtech.jts.geom.Geometry geom = Densifier.densify(geometry, tolerance);
        ScriptableObject densified = GeometryWrapper.wrap(getParentScope(), geom);
        ((Geometry) densified).projection = projection;
        return densified;
    }

    @JSFunction
    public ScriptableObject createVoronoiDiagram() {
        VoronoiDiagramBuilder builder = new VoronoiDiagramBuilder();
        builder.setSites(geometry);
        ScriptableObject voronoiDiagram = GeometryWrapper.wrap(getParentScope(), builder.getDiagram(Geometry.factory));
        ((Geometry) voronoiDiagram).projection = projection;
        return voronoiDiagram;
    }

    @JSFunction
    public ScriptableObject randomPoints(int number) {
        org.locationtech.jts.shape.random.RandomPointsBuilder builder = new org.locationtech.jts.shape.random.RandomPointsBuilder(factory);
        builder.setExtent(geometry);
        builder.setNumPoints(number);
        org.locationtech.jts.geom.Geometry geom = builder.getGeometry();
        ScriptableObject points = GeometryWrapper.wrap(getParentScope(), geom);
        ((Geometry) points).projection = projection;
        return points;
    }

    @JSFunction
    public Geometry getMaximumInscribedCircle(NativeObject config) {
        double tolerance = getDouble(config.getOrDefault("tolerance", 1.0));
        MaximumInscribedCircle algorithm = new MaximumInscribedCircle(getGeometry(), tolerance);
        return (Geometry) GeometryWrapper.wrap(
                getParentScope(),
                algorithm.getCenter().buffer(algorithm.getRadiusLine().getLength())
        );
    }

    @JSFunction
    public ScriptableObject createDelaunayTriangles(boolean isConforming) {
        org.locationtech.jts.geom.Geometry geom;
        if (isConforming) {
            ConformingDelaunayTriangulationBuilder builder = new ConformingDelaunayTriangulationBuilder();
            builder.setSites(geometry);
            geom = builder.getTriangles(factory);
        }
        else {
            DelaunayTriangulationBuilder builder = new DelaunayTriangulationBuilder();
            builder.setSites(geometry);
            geom = builder.getTriangles(factory);
        }
        ScriptableObject triangles = GeometryWrapper.wrap(getParentScope(), geom);
        ((Geometry) triangles).projection = projection;
        return triangles;
    }

    @JSFunction
    public Geometry getLargestEmptyCircle(NativeObject config) {
        double tolerance = getDouble(config.getOrDefault("tolerance", 1.0));
        LargestEmptyCircle algorithm = new LargestEmptyCircle(getGeometry(), tolerance);
        return (Geometry) GeometryWrapper.wrap(
            getParentScope(),
            algorithm.getCenter().buffer(algorithm.getRadiusLine().getLength())
        );
    }

    @JSFunction
    public String getGeometryType() {
        return geometry.getGeometryType();
    }

    @JSGetter
    public double getLength() {
        double length = 0;
        if (geometry != null) {
            length = geometry.getLength();
        }
        return length;
    }

    @JSGetter
    public int getDimension() {
        int dimension = 0;
        if (geometry != null) {
            dimension = geometry.getDimension();
        }
        return dimension;
    }
    
    @JSGetter
    public Scriptable getConfig() {
        Scriptable obj = super.getConfig();
        obj.put("coordinates", obj, getCoordinates());
        if (projection != null) {
            obj.put("projection", obj, projection.getId());
        }
        return obj;
    }

    @JSGetter
    public NativeArray getCoordinates() {
        return null;
    }

    public Object unwrap() {
        return geometry;
    }

    /**
     * Convert a JavaScript array to an array of JTS Coordinates.
     * @param array An array of 2 or 3 element arrays.
     * @return
     */
    protected Coordinate[] arrayToCoords(NativeArray array) {
        int size = array.size();
        Coordinate[] coords = new Coordinate[size];
        for (int i=0; i<size; ++i) {
            Object item = array.get(i);
            if (item instanceof NativeArray) {
                coords[i] = arrayToCoord((NativeArray) item);
            } else if (item instanceof org.locationtech.jts.geom.Point) {
                coords[i] = ((org.locationtech.jts.geom.Point) item).getCoordinate();
            } else {
                throw new RuntimeException("Must provide array of numbers or array of points");
            }
        }
        return coords;
    }
    
    /**
     * Convert a JavaScript array to a JTS Coordinate.
     * @param array An array of length 2 or 3
     * @return Coordinate with x, y, and optional z value from array
     */
    protected Coordinate arrayToCoord(NativeArray array) {
        double x = Double.NaN;
        double y = Double.NaN;
        double z = Double.NaN;
        if (array.size() >= 2) {
            Object xObj = array.get(0);
            if (xObj instanceof Number) {
                x = ((Number) xObj).doubleValue();
            }
            Object yObj = array.get(1);
            if (yObj instanceof Number) {
                y = ((Number) yObj).doubleValue();
            }
        } 
        if (array.size() > 2) {
            Object zObj = array.get(2);
            if (zObj instanceof Number) {
                z = ((Number) zObj).doubleValue();
            }
        }
        Coordinate coord = new Coordinate(x, y, z);
        return coord;
    }
    
    /**
     * Convert a JTS Coordinate into a JavaScript array.
     * @param cx
     * @param scope
     * @param coord
     * @return
     */
    protected NativeArray coordToArray(Coordinate coord) {
        Scriptable scope = getParentScope();
        Context cx = getCurrentContext();
        Object[] elements = new Object[] {
                coord.x, coord.y
        };
        NativeArray array = (NativeArray) cx.newArray(scope, elements);
        double z = coord.z;
        if (!Double.isNaN(z)) {
            array.put(2, array, z);
        }
        return array;
    }
    
    /**
     * Convert a JTS Coordinate array into a JavaScript array.
     * @param scope
     * @param coords
     * @return
     */
    protected NativeArray coordsToArray(Coordinate[] coords) {
        Scriptable scope = getParentScope();
        Context cx = getCurrentContext();
        int length = coords.length;
        NativeArray array = (NativeArray) cx.newArray(scope, length);
        for (int i=0; i<length; ++i) {
            array.put(i, array, coordToArray(coords[i]));
        }
        return array;
    }

    private class BinaryFunction extends FunctionObject {

        /** serialVersionUID */
        private static final long serialVersionUID = 2395795118963401426L;
    
        Geometry geometry;
        Method trueMethod;
        
        public BinaryFunction(String name, Member methodOrConstructor,
                Scriptable scope) {
            super(name, methodOrConstructor, scope);
        }
        
        @SuppressWarnings("unused")
        public boolean nop(Geometry geometry) {
            return true;
        }
    
        BinaryFunction(String name, Method method, Scriptable scope, Geometry geometry) throws SecurityException, NoSuchMethodException {
            this(name, BinaryFunction.class.getMethod("nop", Geometry.class), scope);
            this.trueMethod = method;
            this.geometry = geometry;
        }
        
        @Override
        public Object call(Context cx, Scriptable scope, Scriptable thisObj,
                Object[] args) {
            
            Object otherObj = args[0];
            Geometry other;
            if (otherObj instanceof Geometry) {
                other = (Geometry) otherObj;
            } else {
                throw new RuntimeException("Must provide a geometry");
            }
            other = sameProjection(geometry, other);
            Boolean result;
            try {
                result = (Boolean) trueMethod.invoke(geometry.unwrap(), other.unwrap());
            } catch (Exception e) {
                throw new RuntimeException("Failed to invoke method", e);
            }
            return result;
        }
    }
    
    private class ConstructiveFunction0 extends FunctionObject {

        /** serialVersionUID */
        private static final long serialVersionUID = -96486854506406979L;

        Geometry geometry;
        Method trueMethod;
        
        public ConstructiveFunction0(String name, Member methodOrConstructor,
                Scriptable scope) {
            super(name, methodOrConstructor, scope);
        }
        
        @SuppressWarnings("unused")
        public org.locationtech.jts.geom.Geometry nop() {
            return null;
        }
    
        ConstructiveFunction0(String name, Method method, Scriptable scope, Geometry geometry) throws SecurityException, NoSuchMethodException {
            this(name, ConstructiveFunction0.class.getMethod("nop"), scope);
            this.trueMethod = method;
            this.geometry = geometry;
        }
        
        @Override
        public Object call(Context cx, Scriptable scope, Scriptable thisObj,
                Object[] args) {
            
            org.locationtech.jts.geom.Geometry result;
            try {
                result = (org.locationtech.jts.geom.Geometry) trueMethod.invoke(geometry.unwrap());
            } catch (Exception e) {
                throw new RuntimeException("Failed to invoke method", e);
            }
            ScriptableObject wrapped = GeometryWrapper.wrap(scope, result);
            if (geometry.projection != null) {
                ((Geometry) wrapped).projection = geometry.projection;
            }
            return wrapped;
        }
    }
    
    private class ConstructiveFunction1 extends FunctionObject {

        /** serialVersionUID */
        private static final long serialVersionUID = 7249580667784196575L;
    
        Geometry geometry;
        Method trueMethod;
        
        public ConstructiveFunction1(String name, Member methodOrConstructor,
                Scriptable scope) {
            super(name, methodOrConstructor, scope);
        }
        
        @SuppressWarnings("unused")
        public org.locationtech.jts.geom.Geometry nop(Geometry geometry) {
            return null;
        }
    
        ConstructiveFunction1(String name, Method method, Scriptable scope, Geometry geometry) throws SecurityException, NoSuchMethodException {
            this(name, ConstructiveFunction1.class.getMethod("nop", Geometry.class), scope);
            this.trueMethod = method;
            this.geometry = geometry;
        }
        
        @Override
        public Object call(Context cx, Scriptable scope, Scriptable thisObj,
                Object[] args) {
            
            Object otherObj = args[0];
            Geometry other;
            if (otherObj instanceof Geometry) {
                other = (Geometry) otherObj;
            } else {
                throw new RuntimeException("Must provide a geometry");
            }
            other = sameProjection(geometry, other);
            org.locationtech.jts.geom.Geometry result;
            try {
                result = (org.locationtech.jts.geom.Geometry) trueMethod.invoke(geometry.unwrap(), other.unwrap());
            } catch (Exception e) {
                throw new RuntimeException("Failed to invoke method", e);
            }
            ScriptableObject wrapped = GeometryWrapper.wrap(scope, result);
            if (geometry.projection != null) {
                ((Geometry) wrapped).projection = geometry.projection;
            }
            return wrapped;
        }
    }

    private Geometry sameProjection(Geometry thisGeom, Geometry otherGeom) {
        Projection thisProj = thisGeom.projection;
        if (thisProj != null) {
            Projection otherProj = otherGeom.projection;
            if (otherProj != null) {
                if (!thisProj.equals(otherProj)) {
                    otherGeom = otherGeom.transform(thisProj);
                }
            }
        }
        return otherGeom;
    }
    
    @JSStaticFunction
    public static Geometry from_(Scriptable geometryObj) {
        org.locationtech.jts.geom.Geometry geometry = null;
        if (geometryObj instanceof Wrapper) {
            Object obj = ((Wrapper) geometryObj).unwrap();
            if (obj instanceof org.locationtech.jts.geom.Geometry) {
                geometry = (org.locationtech.jts.geom.Geometry) obj;
            }
        }
        if (geometry == null) {
            throw ScriptRuntime.constructError("Error", "Cannot create geometry from " + Context.toString(geometryObj));
        }
        return (Geometry) GeometryWrapper.wrap(getTopLevelScope(geometryObj), geometry);
    }
    
    /**
     * Descriptive string representation of this object.
     * @return
     */
    public String toFullString() {
        return arrayRepr(getCoordinates());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Geometry geometry1 = (Geometry) o;
        return Objects.equals(geometry, geometry1.geometry) &&
                Objects.equals(projection, geometry1.projection);
    }

    @Override
    public int hashCode() {
        return Objects.hash(geometry, projection);
    }
}
