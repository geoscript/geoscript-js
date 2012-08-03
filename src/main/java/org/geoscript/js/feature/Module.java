package org.geoscript.js.feature;

import java.lang.reflect.InvocationTargetException;

import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class Module {
    
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
        
        ScriptableObject.defineClass(scope, Field.class, false, true);
        ScriptableObject.defineClass(scope, Schema.class, false, true);
    }


}
