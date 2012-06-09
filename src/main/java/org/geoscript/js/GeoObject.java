package org.geoscript.js;

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

}
