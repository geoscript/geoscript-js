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

public class LineString extends Geometry implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = -5048539260091857410L;

    private static Scriptable prototype;

    /**
     * Prototype constructor.
     * @return 
     */
    public LineString() {
    }

    /**
     * Constructor from JTS geometry.
     * @param geometry
     */
    public LineString(Scriptable scope, com.vividsolutions.jts.geom.LineString geometry) {
        this.setParentScope(scope);
        this.setPrototype(LineString.prototype);
        setGeometry(geometry);
    }

    /**
     * Constructor for coordinate array.
     * @param context
     * @param scope
     * @param array
     */
    public LineString(NativeArray array) {
        int size = array.size();
        Coordinate[] coords = new Coordinate[size];
        for (int i=0; i<size; ++i) {
            Object item = array.get(i);
            if (item instanceof NativeArray) {
                coords[i] = arrayToCoord((NativeArray) item);
            }
        }
        setGeometry(factory.createLineString(coords));
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
        LineString.prototype = prototype;
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
        LineString line = null;
        Object arg = args[0];
        if (arg instanceof NativeArray) {
            line = new LineString((NativeArray) arg);
        }
        return line;
    }

    /**
     * Getter for coordinates
     * @return
     */
    @JSGetter
    public NativeArray getCoordinates() {
        return coordsToArray(getParentScope(), getGeometry().getCoordinates());
    }

    /**
     * Returns underlying JTS geometry.
     */
    public com.vividsolutions.jts.geom.LineString unwrap() {
        return (com.vividsolutions.jts.geom.LineString) getGeometry();
    }

}
