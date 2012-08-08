package org.geoscript.js;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeJSON;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;

public class GeoObject extends ScriptableObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 5069578216502688712L;
    
    @JSGetter
    public Scriptable getConfig() {
        Scriptable scope = getParentScope();
        Context cx = getCurrentContext();
        Scriptable obj = cx.newObject(scope);
        obj.put("type", obj, getClass().getSimpleName());
        return obj;
    }
    
    @JSGetter
    public Object getJson() {
        Scriptable config = getConfig();
        Scriptable scope = getParentScope();
        Context cx = getCurrentContext();
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
     * String representation of an array.
     * @param array
     * @return
     */
    protected String arrayRepr(NativeArray array) {
        String repr = "[";
        int length = array.size();
        for (int i=0; i<length; ++i) {
            Object item = array.get(i);
            if (item instanceof NativeArray) {
                repr += arrayRepr((NativeArray) item);
            } else if (item instanceof String) {
                repr += '"' + (String) item + '"';
            } else {
                repr += Context.toString(item);
            }
            if (i < length -1) {
                repr += ", ";
            }
        }
        return repr + "]";
    }

    
    @JSFunction
    public String toString() {
        String full = toFullString();
        if (full.length() > 0) {
            full = " " + full;
        }
        if (full.length() > 60) {
            full = full.substring(0, 61) + "...";
        }
        return "<" + getClass().getSimpleName() + full + ">";
    }
    
    /**
     * Descriptive string representation of this object.
     * @return
     */
    public String toFullString() {
        return "";
    }
    
    /**
     * Get the context associated with the current thread.
     * @return The current context.
     */
    protected static Context getCurrentContext() {
        Context cx = Context.getCurrentContext();
        if (cx == null) {
            throw new RuntimeException("No context associated with current thread.");
        }
        return cx;
    }


}
