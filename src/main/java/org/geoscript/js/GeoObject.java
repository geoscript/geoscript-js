package org.geoscript.js;

import java.lang.reflect.InvocationTargetException;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.NativeJSON;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSGetter;

public class GeoObject extends ScriptableObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 5069578216502688712L;
    
    @JSGetter
    public Scriptable getConfig() {
        Scriptable scope = getParentScope();
        Context cx = Context.getCurrentContext();
        if (cx == null) {
            throw new RuntimeException("No context associated with current thread.");
        }
        Scriptable obj = cx.newObject(scope);
        obj.put("type", obj, getClass().getSimpleName());
        return obj;
    }
    
    @JSGetter
    public Object getJson() {
        Scriptable config = getConfig();
        Scriptable scope = getParentScope();
        Context cx = Context.getCurrentContext();
        Object json = NativeJSON.stringify(cx, scope, config, null, null);
        return json;
    }

    public Object unwrap() {
        return null;
    }

    @Override
    public String getClassName() {
        return getClass().getName();
    }

    /**
     * Retrieve a prototype for the given scriptable class.  If defineClass has
     * already been called for the given scope, the previously created prototype
     * will be returned.  If defineClass has not been called for the given,
     * it will be called and the resulting prototype will be returned.
     * @param scope
     * @param cls
     * @return
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @throws InvocationTargetException
     */
    protected static Scriptable getOrCreatePrototype(Scriptable scope, Class<? extends Scriptable> cls) throws IllegalAccessException, InstantiationException, InvocationTargetException {
        Scriptable prototype = ScriptableObject.getClassPrototype(scope, cls.getName());
        if (prototype == null) {
            ScriptableObject.defineClass(scope, cls, false, true);
            prototype = ScriptableObject.getClassPrototype(scope, cls.getName());
        }
        return prototype;
    }

}
