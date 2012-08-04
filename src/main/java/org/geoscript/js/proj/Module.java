package org.geoscript.js.proj;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;

import org.geoscript.js.GeoObject;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class Module {

    static HashMap<String, Scriptable> prototypes;

    /**
     * Define all proj constructors in the given module scope.  If the 
     * provided scope is not a "top level" scope, constructors will be defined
     * in the top level scope for the given scope.
     * @param scope
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @throws InvocationTargetException
     */
    public static void init(Scriptable scope) throws IllegalAccessException, InstantiationException, InvocationTargetException {
        
        scope = ScriptableObject.getTopLevelScope(scope);
        
        String name = ScriptableObject.defineClass(scope, Projection.class, false, true);
        prototypes = new HashMap<String, Scriptable>();
        prototypes.put(name, ScriptableObject.getClassPrototype(scope, name));
    }

    protected static Scriptable getClassPrototype(Class<? extends GeoObject> cls) {
        String name = cls.getName();
        if (prototypes == null || !prototypes.containsKey(name)) {
            throw new RuntimeException(
                    "Attempt to access prototype before requiring module: " + name);
        }
        return prototypes.get(name);
    }

}
