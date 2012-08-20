package org.geoscript.js.feature;

import org.geoscript.js.GeoObject;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.JavaScriptException;
import org.mozilla.javascript.NativeIterator;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.opengis.feature.simple.SimpleFeature;

public class Iterator extends GeoObject {

    /** serialVersionUID */
    private static final long serialVersionUID = 123388411616403866L;
    
    SimpleFeatureIterator iterator;
    Scriptable layer;
    
    /**
     * Prototype constructor.
     */
    public Iterator() {
    }
    
    public Iterator(Scriptable scope, SimpleFeatureIterator iterator) {
        this.iterator = iterator;
        setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Iterator.class));
    }
    
    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        throw ScriptRuntime.constructError("Error", "Iterators are for internal use only");
    }

    public void setLayer(Scriptable layer) {
        this.layer = layer;
    }

    @JSFunction
    public Boolean hasNext() {
        boolean has = iterator.hasNext();
        if (!has) {
            close();
        }
        return has;
    }
    
    @JSFunction
    public Feature next() {
        Feature feature = null;
        if (hasNext()) {
            SimpleFeature simpleFeature = iterator.next();
            feature = new Feature(getParentScope(), simpleFeature);
            if (layer != null) {
                feature.setLayer(layer);
            }
        } else {
            throw new JavaScriptException(
                    NativeIterator.getStopIterationObject(getParentScope()), null, 0);
        }
        return feature;
    }
    
    public void close() {
        try {
            iterator.close();
        } catch (Exception e) {
            // pass
        }
    }


}
