package org.geoscript.js.geom;

import org.geoscript.js.io.JSON;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;

public class GeometryCollection extends Geometry implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 669981017408451671L;
    
    public Class<?> restrictedType = null;

    /**
     * Prototype constructor.
     * @return 
     */
    public GeometryCollection() {
    }

    /**
     * Constructor for coordinate array.
     * @param context
     * @param scope
     * @param array
     */
    public GeometryCollection(NativeArray array) {
        setGeometry(collectionFromArray(array));
    }
    
    /**
     * Create a JTS geometry collection from a JS array
     * @param array
     * @return
     */
    private org.locationtech.jts.geom.GeometryCollection collectionFromArray(NativeArray array) {
        Scriptable scope = array.getParentScope();
        Context context = getCurrentContext();
        int numComponents = array.size();
        org.locationtech.jts.geom.Geometry[] geometries = new org.locationtech.jts.geom.Geometry[numComponents];
        for (int i=0; i<numComponents; ++i) {
            Object obj = array.get(i);
            if (obj instanceof org.locationtech.jts.geom.Geometry) {
                geometries[i] = (org.locationtech.jts.geom.Geometry) obj;
            } else if (obj instanceof NativeObject) {
                Geometry geomObj = (Geometry) JSON.readObj((NativeObject) obj);
                geometries[i] = (org.locationtech.jts.geom.Geometry) geomObj.unwrap();
            } else if (obj instanceof NativeArray) {
                int dim = getArrayDimension((NativeArray) obj);
                if (dim < 0 || dim > 2) {
                    throw new RuntimeException("Coordinate array must contain point, line, or polygon coordinate values");
                }
                switch (dim) {
                case 0:
                    geometries[i] = new Point(scope, prepConfig(context, (Scriptable) obj)).unwrap();
                    break;
                case 1:
                    geometries[i] = new LineString(scope, prepConfig(context, (Scriptable) obj)).unwrap();
                    break;
                case 2:
                    geometries[i] = new Polygon(scope, prepConfig(context, (Scriptable) obj)).unwrap();
                    break;
                default:
                    throw ScriptRuntime.constructError("Error", "Can't handle provided coordinate array; " + Context.toString(obj));
                }
            }
            if (restrictedType != null) {
                if (restrictedType != geometries[i].getClass()) {
                    throw new RuntimeException("Component geometry must be of type " + restrictedType.getName());
                }
            }
        }
        return createCollection(geometries);
    }

    /**
     * Constructor from array (without new keyword).
     * @param scope
     * @param array
     */
    public GeometryCollection(Scriptable scope, NativeArray array) {
        this(array);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(GeometryCollection.class));
    }
    
    /**
     * Constructor from config object.
     * @param config
     */
    public GeometryCollection(NativeObject config) {
        NativeArray array = (NativeArray) getRequiredMember(config, "geometries", NativeArray.class, "Array");
        setGeometry(collectionFromArray(array));
    }
    
    /**
     * Constructor from config object (without new keyword).
     * @param scope
     * @param config
     */
    public GeometryCollection(Scriptable scope, NativeObject config) {
        this(config);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(GeometryCollection.class));
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public GeometryCollection(Scriptable scope, org.locationtech.jts.geom.GeometryCollection geometry) {
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(GeometryCollection.class));
        setGeometry(geometry);
    }

    public org.locationtech.jts.geom.GeometryCollection createCollection(org.locationtech.jts.geom.Geometry[] geometries) {
        return new org.locationtech.jts.geom.GeometryCollection(geometries, factory);
    }
    
    protected int getArrayDimension(NativeArray array) {
        int dim = -1;
        Object obj = array;
        while (obj instanceof NativeArray && ((NativeArray) obj).size() > 0) {
            ++dim;
            obj = ((NativeArray) obj).get(0);
        }
        return dim;
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
            throw ScriptRuntime.constructError("Error", "GeometryCollection constructor takes a single argument");
        }
        NativeArray array = getCoordinatesArray(args[0]);
        GeometryCollection collection = null;
        if (inNewExpr) {
            collection = new GeometryCollection(array);
        } else {
            collection = new GeometryCollection(array.getParentScope(), array);
        }
        return collection;
    }
    
    protected static NativeArray getCoordinatesArray(Object arg) {
        NativeArray array;
        if (arg instanceof NativeArray) {
            array = (NativeArray) arg;
        } else if (arg instanceof Scriptable) {
            array = (NativeArray) getRequiredMember((Scriptable) arg, "coordinates", NativeArray.class, "Array");
        } else {
            throw ScriptRuntime.constructError("Error", "Invalid arguments");
        }
        return array;
    }

    /**
     * Getter for coordinates
     * @return
     */
    @JSGetter
    public NativeArray getCoordinates() {
        Context cx = getCurrentContext();
        Scriptable scope = getParentScope();
        org.locationtech.jts.geom.GeometryCollection geometry = (org.locationtech.jts.geom.GeometryCollection) getGeometry();
        int length = geometry.getNumGeometries();
        NativeArray array = (NativeArray) cx.newArray(scope, length);
        for (int i=0; i<length; ++i) {
            NativeArray coords = ((Geometry) GeometryWrapper.wrap(scope, geometry.getGeometryN(i))).getCoordinates();
            array.put(i, array, coords); 
        }
        return array;
    }
    
    @JSGetter
    public NativeArray getComponents() {
        Context cx = getCurrentContext();
        Scriptable scope = getParentScope();
        org.locationtech.jts.geom.GeometryCollection geometry = (org.locationtech.jts.geom.GeometryCollection) getGeometry();
        int length = geometry.getNumGeometries();
        NativeArray array = (NativeArray) cx.newArray(scope, length);
        for (int i=0; i<length; ++i) {
            array.put(i, array, GeometryWrapper.wrap(scope, geometry.getGeometryN(i)));
        }
        return array;
    }

    @JSGetter
    public Scriptable getConfig() {
        Scriptable obj = super.getConfig();
        if (restrictedType == null) {
            obj.delete("coordinates");
            NativeArray components = getComponents();
            int length = components.size();
            Context cx = getCurrentContext();
            Scriptable scope = getParentScope();
            Scriptable geometries = cx.newArray(scope, length);
            for (int i=0; i<length; ++i) {
                Geometry comp = (Geometry) components.get(i, components);
                geometries.put(i, geometries, comp.getConfig());
            }
            obj.put("geometries", obj, geometries);
        } else {
            obj = super.getConfig();
        }
        return obj;
    }

    /**
     * Returns underlying JTS geometry.
     */
    public org.locationtech.jts.geom.GeometryCollection unwrap() {
        return (org.locationtech.jts.geom.GeometryCollection) getGeometry();
    }


}
