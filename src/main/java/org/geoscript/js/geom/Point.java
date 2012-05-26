package org.geoscript.js.geom;

import java.lang.reflect.InvocationTargetException;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.FunctionObject;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;

import com.vividsolutions.jts.geom.Coordinate;

public class Point extends Geometry implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 8771743870215086281L;
    
    private com.vividsolutions.jts.geom.Point geometry;
    
    Context context;
    Scriptable scope;
    
    /**
     * Point prototype constructor.
     * @return 
     */
    public Point() {
        new Geometry();
    }
    
    /**
     * Point constructor for coordinate array.
     * @param context
     * @param scope
     * @param array
     */
    public Point(Context context, Scriptable scope, NativeArray array) {
        this.context = context;
        this.scope = scope;
        Coordinate coord = arrayToCoord(array);
        geometry = factory.createPoint(coord);
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
        ScriptableObject.defineClass(scope, Geometry.class, false, true);
        Scriptable parentProto = ScriptableObject.getClassPrototype(scope, Geometry.class.getName());
        prototype.setPrototype(parentProto);
    }
    
    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        Point point = null;
        Object arg = args[0];
        if (arg instanceof NativeArray) {
            point = new Point(cx, ctorObj.getParentScope(), (NativeArray) arg);
        }
        return point;
    }
    
    /**
     * Getter for point.x
     * @return
     */
    @JSGetter
    public Object getX() {
        return geometry.getX();
    }

    /**
     * Getter for point.y
     * @return
     */
    @JSGetter
    public Object getY() {
        return geometry.getY();
    }

    /**
     * Getter for point.z
     * @return
     */
    @JSGetter
    public Object getZ() {
        return geometry.getCoordinate().z;
    }
    
    /**
     * Getter for point.coordinates
     * @return
     */
    @JSGetter
    public NativeArray getCoordinates() {
        return coordToArray(context, scope, geometry.getCoordinate());
    }

    /**
     * Returns underlying JTS geometry.
     */
    public com.vividsolutions.jts.geom.Point unwrap() {
        return geometry;
    }

    @Override
    public String getClassName() {
        return getClass().getName();
    }

}
