package org.geoscript.js.geom;

import java.lang.reflect.InvocationTargetException;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.FunctionObject;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;

import com.vividsolutions.jts.geom.LinearRing;

public class Polygon extends Geometry implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 2047700235863381036L;

    /**
     * Prototype constructor.
     * @return 
     */
    public Polygon() {
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     * @throws InvocationTargetException 
     * @throws InstantiationException 
     * @throws IllegalAccessException 
     */
    public Polygon(Scriptable scope, com.vividsolutions.jts.geom.Polygon geometry) throws IllegalAccessException, InstantiationException, InvocationTargetException {
        this.setParentScope(scope);
        Scriptable prototype = getOrCreatePrototype(scope, getClass());
        this.setPrototype(prototype);
        setGeometry(geometry);
    }

    /**
     * Constructor for coordinate array.
     * @param context
     * @param scope
     * @param array
     */
    public Polygon(NativeArray array) {
        LinearRing shell = factory.createLinearRing(arrayToCoords((NativeArray) array.get(0)));
        int numHoles = array.size() - 1;
        LinearRing[] holes = new LinearRing[numHoles];
        for (int i=0; i<numHoles; ++i) {
            holes[i] = factory.createLinearRing(arrayToCoords((NativeArray) array.get(i)));
        }
        setGeometry(factory.createPolygon(shell, holes));
    }
    
    /**
     * Finishes JavaScript constructor initialization.  
     * Sets up the prototype chain using superclass.
     * 
     * @param scope
     * @param ctor
     * @param prototype
     * @throws NoSuchMethodException
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @throws InvocationTargetException
     */
    public static void finishInit(Scriptable scope, FunctionObject ctor, Scriptable prototype) 
    throws NoSuchMethodException, IllegalAccessException, InstantiationException, InvocationTargetException {
        prototype.setPrototype(getOrCreatePrototype(scope, Geometry.class));
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
        Polygon poly = null;
        Object arg = args[0];
        if (arg instanceof NativeArray) {
            poly = new Polygon((NativeArray) arg);
        }
        return poly;
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
        com.vividsolutions.jts.geom.Polygon poly = (com.vividsolutions.jts.geom.Polygon) getGeometry();
        int length = 1 + poly.getNumInteriorRing();
        NativeArray array = (NativeArray) cx.newArray(scope, length);
        array.put(0, array, coordsToArray(poly.getExteriorRing().getCoordinates()));
        for (int i=1; i<length; ++i) {
            array.put(i, array, coordsToArray(poly.getInteriorRingN(i-1).getCoordinates()));
        }
        return array;
    }

    /**
     * Returns underlying JTS geometry.
     */
    public com.vividsolutions.jts.geom.Polygon unwrap() {
        return (com.vividsolutions.jts.geom.Polygon) getGeometry();
    }

}
