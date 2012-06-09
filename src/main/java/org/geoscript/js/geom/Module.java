package org.geoscript.js.geom;

import java.lang.reflect.InvocationTargetException;

import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class Module {

    /**
     * Define all geometry constructors in the given module scope.  If the 
     * provided scope is not a "top level" scope, constructors will be defined
     * in the top level scope for the given scope.
     * @param scope
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @throws InvocationTargetException
     */
    public static void init(Scriptable scope) throws IllegalAccessException, InstantiationException, InvocationTargetException {
        
        scope = ScriptableObject.getTopLevelScope(scope);
        
        ScriptableObject.defineClass(scope, Geometry.class, false, true);
        ScriptableObject.defineClass(scope, Point.class, false, true);
        ScriptableObject.defineClass(scope, LineString.class, false, true);
        ScriptableObject.defineClass(scope, Polygon.class, false, true);
        ScriptableObject.defineClass(scope, MultiPoint.class, false, true);
        ScriptableObject.defineClass(scope, MultiLineString.class, false, true);
        ScriptableObject.defineClass(scope, MultiPolygon.class, false, true);
        ScriptableObject.defineClass(scope, Bounds.class, false, true);
        
    }

}
