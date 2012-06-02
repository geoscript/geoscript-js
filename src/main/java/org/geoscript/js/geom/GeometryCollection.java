package org.geoscript.js.geom;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.FunctionObject;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;

public class GeometryCollection extends Geometry implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 669981017408451671L;
    
    private static Scriptable prototype;
    
    public Class<?> restrictedType = null;

    /**
     * Prototype constructor.
     * @return 
     */
    public GeometryCollection() {
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public GeometryCollection(Scriptable scope, com.vividsolutions.jts.geom.GeometryCollection geometry) {
        this.setParentScope(scope);
        this.setPrototype(GeometryCollection.prototype);
        setGeometry(geometry);
    }

    /**
     * Constructor for coordinate array.
     * @param context
     * @param scope
     * @param array
     */
    public GeometryCollection(NativeArray array) {
        int numComponents = array.size();
        com.vividsolutions.jts.geom.Geometry[] geometries = new com.vividsolutions.jts.geom.Geometry[numComponents];
        for (int i=0; i<numComponents; ++i) {
            Object obj = array.get(i);
            if (obj instanceof com.vividsolutions.jts.geom.Geometry) {
                geometries[i] = (com.vividsolutions.jts.geom.Geometry) obj;
            } else if (obj instanceof NativeArray) {
                int dim = getArrayDimension((NativeArray) obj);
                if (dim < 0 || dim > 2) {
                    throw new RuntimeException("Coordinate array must contain point, line, or polygon coordinate values");
                }
                switch (dim) {
                case 0:
                    geometries[i] = new Point((NativeArray) obj).unwrap();
                    break;
                case 1:
                    geometries[i] = new LineString((NativeArray) obj).unwrap();
                    break;
                case 2:
                    geometries[i] = new Polygon((NativeArray) obj).unwrap();
                    break;
                }
            }
            if (restrictedType != null) {
                if (restrictedType != geometries[i].getClass()) {
                    throw new RuntimeException("Component geometry must be of type " + restrictedType.getName());
                }
            }
        }
        com.vividsolutions.jts.geom.GeometryCollection collection = createCollection(geometries);
        setGeometry(collection);
    }
    
    public com.vividsolutions.jts.geom.GeometryCollection createCollection(com.vividsolutions.jts.geom.Geometry[] geometries) {
        return new com.vividsolutions.jts.geom.GeometryCollection(geometries, factory);
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
     * Finishes JavaScript constructor initialization.  
     * Sets up the prototype chain using superclass.
     * 
     * @param scope
     * @param ctor
     * @param prototype
     */
    public static void finishInit(Scriptable scope, FunctionObject ctor, Scriptable prototype) {
        prototype.setPrototype(getOrCreatePrototype(scope, Geometry.class));
        GeometryCollection.prototype = prototype;
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
        GeometryCollection collection = null;
        Object arg = args[0];
        if (arg instanceof NativeArray) {
            collection = new GeometryCollection((NativeArray) arg);
        }
        return collection;
    }

    /**
     * Getter for coordinates
     * @return
     */
    @JSGetter
    public NativeArray getCoordinates() {
        Context cx = Context.getCurrentContext();
        if (cx == null) {
            throw new RuntimeException("No context associated with current thread.");
        }
        Scriptable scope = getParentScope();
        com.vividsolutions.jts.geom.GeometryCollection geometry = (com.vividsolutions.jts.geom.GeometryCollection) getGeometry();
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
        Context cx = Context.getCurrentContext();
        if (cx == null) {
            throw new RuntimeException("No context associated with current thread.");
        }
        Scriptable scope = getParentScope();
        com.vividsolutions.jts.geom.GeometryCollection geometry = (com.vividsolutions.jts.geom.GeometryCollection) getGeometry();
        int length = geometry.getNumGeometries();
        NativeArray array = (NativeArray) cx.newArray(scope, length);
        for (int i=0; i<length; ++i) {
            array.put(i, array, GeometryWrapper.wrap(scope, geometry.getGeometryN(i)));
        }
        return array;
    }

    /**
     * Returns underlying JTS geometry.
     */
    public com.vividsolutions.jts.geom.GeometryCollection unwrap() {
        return (com.vividsolutions.jts.geom.GeometryCollection) getGeometry();
    }


}
