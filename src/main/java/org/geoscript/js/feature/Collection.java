package org.geoscript.js.feature;

import org.geoscript.js.GeoObject;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.JavaScriptException;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeIterator;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.opengis.feature.simple.SimpleFeature;

public class Collection extends GeoObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 7771735276222136537L;

    private SimpleFeatureCollection collection;

    private SimpleFeatureIterator iterator;
    
    private Feature current;
    
    private int index = -1;
    
    /**
     * Prototype constructor.
     */
    public Collection() {
    }

    /**
     * Constructor with SimpleFeatureCollection (from Java).
     * @param scope
     * @param collection
     */
    public Collection(Scriptable scope, SimpleFeatureCollection collection) {
        this(collection);
        setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Collection.class));
    }
    
    private Collection(SimpleFeatureCollection collection) {
        this.collection = collection;
        iterator = collection.features();
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
        if (!inNewExpr) {
            throw ScriptRuntime.constructError("Error", "Call constructor with new keyword.");
        }
        Collection collection = null;
        Object arg = args[0];
        if (arg instanceof Wrapper) {
            arg = ((Wrapper) arg).unwrap();
            if (arg instanceof SimpleFeatureCollection) {
                collection = new Collection((SimpleFeatureCollection) arg);
            }
        }
        if (collection == null) {
            throw ScriptRuntime.constructError("Error", "Collection must be constructed from a SimpleFeatureCollection.");
        }
        return collection;
    }
    
    @JSGetter
    public int getIndex() {
        return index;
    }
    
    @JSGetter
    public Feature getCurrent() {
        return current;
    }
    
    @JSFunction
    public void forEach(Function function, Scriptable thisArg) {
        Context cx = getCurrentContext();
        Scriptable scope = getParentScope();
        if (thisArg == Context.getUndefinedValue()) {
            thisArg = scope;
        }
        try {
            for (int i=0; hasNext(); ++i) {
                Object[] args = { next(), i };
                Object ret = function.call(cx, scope, thisArg, args);
                if (ret.equals(false)) {
                    break;
                }
            }
            close();
        } finally {
            close();
        }
    }

    @JSFunction
    public Boolean hasNext() {
        boolean has = (iterator != null && iterator.hasNext());
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
            ++index;
            current = feature;
        } else {
            throw new JavaScriptException(
                    NativeIterator.getStopIterationObject(getParentScope()), null, 0);
        }
        return feature;
    }
    
    @JSFunction 
    public NativeArray read(int length) {
        Context cx = getCurrentContext();
        Scriptable scope = getParentScope();
        NativeArray results = (NativeArray) cx.newArray(scope, length);
        int i;
        for (i=0; i<length; ++i) {
            if (hasNext()) {
                results.put(i, results, next());
            } else {
                break;
            }
        }
        results.put("length", results, i);
        return results;
    }
    
    @JSFunction 
    public Object get(Scriptable lengthObj) {
        int length = 1;
        if (lengthObj != Context.getUndefinedValue()) {
            length = (int) Context.toNumber(lengthObj);
        }
        NativeArray results = read(length);
        close();
        Object features;
        if (length == 1) {
            features = results.get(0);
        } else {
            features = results;
        }
        return features;
    }
    
    @JSFunction
    public Collection skip(int length) {
        for (int i=0; i<length; ++i) {
            if (hasNext()) {
                iterator.next();
                ++index;
            } else {
                break;
            }
        }
        return this;
    }

    @JSFunction
    public void close() {
        if (iterator != null) {
            iterator.close();
            iterator = null;
        }
        current = null;
    }

    @JSFunction
    public Object __iterator__(boolean b) {
        return this;
    }


    public Object unwrap() {
        return collection;
    }

}
