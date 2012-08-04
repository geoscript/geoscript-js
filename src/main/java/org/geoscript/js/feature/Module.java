package org.geoscript.js.feature;

import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.geoscript.js.GeoObject;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class Module {
    
    static HashMap<String, Scriptable> prototypes;

    /**
     * Define all feature related constructors in the given module scope.  If 
     * the provided scope is not a "top level" scope, constructors will be 
     * defined in the top level scope for the given scope.
     * @param scope
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @throws InvocationTargetException
     */
    public static void init(Scriptable scope) throws IllegalAccessException, InstantiationException, InvocationTargetException {
        scope = ScriptableObject.getTopLevelScope(scope);
        
        @SuppressWarnings("unchecked")
        List<Class<? extends GeoObject>> classes = Arrays.asList(
                Field.class, Schema.class);
        
        prototypes = new HashMap<String, Scriptable>();
        for (Class<? extends GeoObject> cls : classes) {
            String name = ScriptableObject.defineClass(scope, cls, false, true);
            Scriptable prototype = ScriptableObject.getClassPrototype(scope, name);
            prototypes.put(name, prototype);
        }
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
