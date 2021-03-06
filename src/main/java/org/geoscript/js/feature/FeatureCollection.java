package org.geoscript.js.feature;

import java.util.NoSuchElementException;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.geoscript.js.GeoObject;
import org.geoscript.js.geom.Bounds;
import org.geotools.data.DataUtilities;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.geometry.jts.ReferencedEnvelope;
import org.geotools.process.vector.SimpleProcessingCollection;
import org.geotools.util.logging.Logging;
import org.locationtech.jts.geom.Envelope;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.JavaScriptException;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeGenerator;
import org.mozilla.javascript.NativeIterator;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.mozilla.javascript.annotations.JSSetter;
import org.mozilla.javascript.annotations.JSStaticFunction;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;

public class FeatureCollection extends GeoObject implements Wrapper {

    /** serialVersionUID */
    private static final long serialVersionUID = 7771735276222136537L;

    static Logger LOGGER = Logging.getLogger("org.geoserver.script.js");

    private SimpleFeatureCollection collection;

    /**
     * JavaScript layer associated with this collection (if any).
     */
    private Scriptable layer;
    
    /**
     * Prototype constructor.
     */
    public FeatureCollection() {
    }

    /**
     * Constructor from config object.
     * @param config
     */
    private FeatureCollection(NativeObject config) {
        Object obj = config.get("features", config);
        if (obj instanceof Function) {
            collection = new JSFeatureCollection(this, config);
        } else if (obj instanceof NativeArray) {
            collection = new JSFeatureArray((NativeArray) obj);
        }
    }
    
    /**
     * Constructor from array.
     * @param array
     */
    private FeatureCollection(NativeArray array) {
        collection = new JSFeatureArray(array);
    }
    
    /**
     * Constructor from config object (without new keyword).
     * @param scope
     * @param config
     */
    public FeatureCollection(Scriptable scope, NativeObject config) {
        this(config);
        setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(FeatureCollection.class));
    }

    /**
     * Constructor from feature array (without new keyword).
     * @param scope
     * @param array
     */
    public FeatureCollection(Scriptable scope, NativeArray array) {
        this(array);
        setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(FeatureCollection.class));
    }

    /**
     * Constructor with SimpleFeatureCollection (from Java).
     * @param scope
     * @param collection
     */
    public FeatureCollection(Scriptable scope, SimpleFeatureCollection collection) {
        this.collection = collection;
        setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(FeatureCollection.class));
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
        if (args.length != 1) {
            throw ScriptRuntime.constructError("Error", "Constructor takes a single argument");
        }
        FeatureCollection collection = null;
        Object arg = args[0];
        if (arg instanceof NativeObject) {
            NativeObject config = (NativeObject) arg;
            if (inNewExpr) {
                collection = new FeatureCollection(config);
            } else {
                collection = new FeatureCollection(config.getParentScope(), config);
            }
        } else if (arg instanceof NativeArray) {
            NativeArray array = (NativeArray) arg;
            if (inNewExpr) {
                collection = new FeatureCollection(array);
            } else {
                collection = new FeatureCollection(array.getParentScope(), array);
            }
        } else {
            throw ScriptRuntime.constructError("Error", "Could not create collection from argument: " + Context.toString(arg));
        }
        return collection;
    }

    /**
     * Set the JavaScript layer associated with this collection.
     * @param layer
     */
    @JSSetter
    public void setLayer(Scriptable layer) {
        this.layer = layer;
    }
    
    @JSGetter
    public Scriptable getLayer() {
        return layer;
    }
    
    @JSGetter
    public int getSize() {
        return collection.size();
    }
    
    @JSGetter
    public Bounds getBounds() {
        return new Bounds(getParentScope(), collection.getBounds());
    }
    
    @JSGetter
    public Schema getSchema() {
        return new Schema(getParentScope(), collection.getSchema());
    }
    
    @JSFunction
    public void forEach(Function function, Scriptable thisArg) {
        Scriptable scope = getParentScope();
        if (thisArg == Context.getUndefinedValue()) {
            thisArg = scope;
        }
        Iterator iterator = (Iterator) __iterator__(true);
        Context context = Context.enter();
        int i = 0;
        try {
            while (iterator.hasNext()) {
                Object[] args = { iterator.next() , i };
                Object ret = function.call(context, scope, thisArg, args);
                if (ret.equals(false)) {
                    break;
                }
                ++i;
            }
        } finally {
            iterator.close();
            Context.exit();
        }
    }

    @JSFunction
    public FeatureCollection map(final Function function) {
        final Scriptable scope = getParentScope();
        final Context context = getCurrentContext();
        final SimpleFeatureIterator mappedIterator = new SimpleFeatureIterator() {

            SimpleFeatureIterator iterator = collection.features();

            public SimpleFeature next() throws NoSuchElementException {
                Feature feature = new Feature(scope, iterator.next());
                Object[] args = {feature};
                Object newFeature = function.call(context, scope, scope, args);
                if (!(newFeature instanceof Feature)) {
                    throw ScriptRuntime.constructError("Error", 
                            "Map function must return a feature");
                }
                return (SimpleFeature) ((Feature) newFeature).unwrap();
            }
            
            public boolean hasNext() {
                return iterator.hasNext();
            }
            
            public void close() {
                iterator.close();
            }
        };
        SimpleProcessingCollection mappedCollection = new SimpleProcessingCollection() {
            
            @Override
            public int size() {
                return collection.size();
            }
            
            @Override
            public ReferencedEnvelope getBounds() {
                return collection.getBounds();
            }
            
            @Override
            public SimpleFeatureIterator features() {
                return mappedIterator;
            }
            
            @Override
            protected SimpleFeatureType buildTargetFeatureType() {
                SimpleFeatureIterator iterator = collection.features();
                SimpleFeatureType featureType = null;
                if (iterator.hasNext()) {
                    Feature feature = new Feature(scope, iterator.next());
                    Object[] args = {feature};
                    try {
                        Object newFeature = function.call(context, scope, scope, 
                                args);
                        if (!(newFeature instanceof Feature)) {
                            throw ScriptRuntime.constructError("Error", 
                                    "Map function must return a feature");
                        }
                        featureType = (SimpleFeatureType) ((Feature) newFeature)
                               .getSchema().unwrap();
                    } finally {
                        iterator.close();
                    }
                }
                return featureType;
            }
        };
        return new FeatureCollection(scope, mappedCollection);
    }

    @JSFunction 
    public NativeArray get(Scriptable lengthObj) {
        int length = 1;
        if (lengthObj != Context.getUndefinedValue()) {
            length = (int) Context.toNumber(lengthObj);
        }
        Context cx = getCurrentContext();
        Scriptable scope = getParentScope();
        NativeArray features = (NativeArray) cx.newArray(scope, length);
        Iterator iterator = (Iterator) __iterator__(true);
        int i=0;
        while (i<length && iterator.hasNext()) {
            features.put(i, features, iterator.next());
            ++i;
        }
        features.put("length", features, i);
        return features;
    }
    
    @JSFunction
    public Object __iterator__(boolean b) {
        Iterator iterator = new Iterator(getParentScope(), collection.features());
        if (layer != null) {
            iterator.setLayer(layer);
        }
        return iterator;
    }

    @JSStaticFunction
    public static FeatureCollection from_(Scriptable collectionObj) {
        SimpleFeatureCollection collection = null;
        if (collectionObj instanceof Wrapper) {
            Object obj = ((Wrapper) collectionObj).unwrap();
            if (obj instanceof SimpleFeatureCollection) {
                collection = (SimpleFeatureCollection) obj;
            }
        }
        if (collection == null) {
            throw ScriptRuntime.constructError("Error", "Cannot create collection from " + Context.toString(collectionObj));
        }
        return new FeatureCollection(getTopLevelScope(collectionObj), collection);
    }

    /**
     * Provides a config object with GeoJSON structure.  Note that this will
     * iterate through and serialize all features.
     */
    @JSGetter
    public Scriptable getConfig() {
        Scriptable config = super.getConfig();

        // add features
        Context cx = getCurrentContext();
        Scriptable scope = getParentScope();
        Scriptable features = cx.newArray(scope, 0);
        SimpleFeatureIterator iterator = collection.features();
        int i = -1;
        while (iterator.hasNext()) {
            ++i;
            Feature feature = new Feature(scope, iterator.next());
            Scriptable featureConfig = feature.getConfig();
            featureConfig.delete("schema"); // to be added at top level
            features.put(i, features, featureConfig);
        }
        config.put("features", config, features);

        // add schema
        Schema schema = new Schema(scope, collection.getSchema());
        config.put("schema", config, schema.getConfig());

        return config;
    }

    public Object unwrap() {
        return collection;
    }
    
    static class JSFeatureArray extends SimpleProcessingCollection {
    
        NativeArray array;
    
        public JSFeatureArray(NativeArray array) {
            this.array = array;
        }

        @Override
        public SimpleFeatureIterator features() {
            return new JSFeatureArrayIterator(array);
        }

        @Override
        public ReferencedEnvelope getBounds() {
            return DataUtilities.bounds(features());
        }

        @Override
        protected SimpleFeatureType buildTargetFeatureType() {
            SimpleFeatureType featureType = null;
            SimpleFeatureIterator iterator = features();
            if (iterator.hasNext()) {
                SimpleFeature feature = iterator.next();
                featureType = feature.getFeatureType();
            }
            return featureType;
        }

        @Override
        public int size() {
            return array.size();
        }
    
    }
    
    static class JSFeatureArrayIterator implements SimpleFeatureIterator {
    
        int current = -1;
        NativeArray array;

        public JSFeatureArrayIterator(NativeArray array) {
            this.array = array;
        }

        public boolean hasNext() {
            return array.size() > current + 1;
        }

        public SimpleFeature next() throws NoSuchElementException {
            SimpleFeature feature = null;
            if (hasNext()) {
                ++current;
                Object obj = array.get(current, array);
                if (obj instanceof Feature) {
                    feature = (SimpleFeature) ((Feature) obj).unwrap();
                } else if (obj instanceof NativeObject) {
                    NativeObject config = (NativeObject) obj;
                    feature = (SimpleFeature) new Feature(config.getParentScope(), config).unwrap();
                } else {
                    throw new NoSuchElementException("Expected a feature instance at index " + current);
                }
            } else {
                throw new NoSuchElementException("hasNext() returned false!");
            }
            return feature;
        }

        public void close() {
            current = -1;
        }
    }
    
    static class JSFeatureCollection extends SimpleProcessingCollection {
    
        FeatureCollection collection;
        Scriptable scope;

        SimpleFeatureType featureType;
        Function featuresFunc;
        Function closeFunc;
        Function sizeFunc;
        Function boundsFunc;

        public JSFeatureCollection(FeatureCollection collection, Scriptable config) {
            super();
            
            this.collection = collection;
            scope = config.getParentScope();
            
            // required next function
            featuresFunc = (Function) getRequiredMember(config, "features", Function.class);

            // optional close function
            closeFunc = (Function) getOptionalMember(config, "close", Function.class);

            // optional size function
            sizeFunc = (Function) getOptionalMember(config, "size", Function.class);

            // optional bounds function
            boundsFunc = (Function) getOptionalMember(config, "bounds", Function.class);

        }

        @Override
        public SimpleFeatureIterator features() {
            return new JSFeatureIterator(collection, featuresFunc, closeFunc);
        }

        @Override
        public ReferencedEnvelope getBounds() {
            ReferencedEnvelope refEnv;
            if (boundsFunc != null) {
                Context context = Context.enter();
                Object retObj;
                try {
                    retObj = boundsFunc.call(context, scope, collection, new Object[0]);
                } finally {
                    Context.exit();
                }
                if (retObj instanceof Bounds) {
                    refEnv = (ReferencedEnvelope) ((Bounds) retObj).unwrap();
                } else {
                    throw ScriptRuntime.constructError("Error", "The bounds function must return a bounds.  Got: " + Context.toString(retObj));
                }
            } else {
                refEnv = DataUtilities.bounds(features());
            }
            return refEnv;
        }

        @Override
        protected SimpleFeatureType buildTargetFeatureType() {
            if (featureType == null) {
                JSFeatureIterator iterator = (JSFeatureIterator) features();
                try {
                    featureType = iterator.getFeatureType();
                } finally {
                    iterator.close();
                }
            }
            return featureType;
        }

        @Override
        public int size() {
            int size = 0;
            if (sizeFunc != null) {
                Context context = Context.enter();
                Object retObj;
                try {
                    retObj = sizeFunc.call(context, scope, collection, new Object[0]);
                } finally {
                    Context.exit();
                }
                size = (int) Context.toNumber(retObj);
            } else {
                size = DataUtilities.count(features());
            }
            return size;
        }
    
    }
    
    static class JSFeatureIterator implements SimpleFeatureIterator {
    
        Scriptable scope;
        FeatureCollection collection;
        Function featuresFunc;
        Function closeFunc;
        
        NativeGenerator generator;
        SimpleFeature next;
        SimpleFeatureType featureType;
        
        boolean closed = false;
        
        public JSFeatureIterator(FeatureCollection collection, Function featuresFunc, Function closeFunc) {
            scope = collection.getParentScope();
            this.collection = collection;
            this.featuresFunc = featuresFunc;
            this.closeFunc = closeFunc;
        }
        
        /**
         * Get the feature type from the first feature created.
         * @return
         */
        public SimpleFeatureType getFeatureType() {
            if (featureType == null) {
                try {
                    createNextFeature();
                } catch (Exception e) {
                    LOGGER.log(Level.SEVERE, "Feature creation failed", e);
                    throw ScriptRuntime.constructError("Error", 
                            "Unable to get a feature from the collection");
                }
                if (next != null) {
                    featureType = next.getFeatureType();
                }
            }
            return featureType;
            
        }

        public boolean hasNext() {
            createNextFeature();
            return next != null;
        }

        /**
         * Call the provided `next` function to create the next feature.
         */
        private void createNextFeature() {
            if (generator == null) {
                Context context = Context.enter();
                try {
                    Object retObj = featuresFunc.call(context, scope, collection, new Object[0]);
                    if (retObj instanceof NativeGenerator) {
                        generator = (NativeGenerator) retObj;
                    } else {
                        throw ScriptRuntime.constructError("Error", 
                                "Expected features method to return a Generator.  Got: " + Context.toString(retObj));
                    }
                } finally {
                    Context.exit();
                }
            }
            if (next == null) {
                SimpleFeature feature = null;
                Object retObj = null;
                Context context = Context.enter();
                try {
                    retObj = ScriptableObject.callMethod(context, generator, "next", new Object[0]);
                } catch (JavaScriptException e) {
                    // pass on StopIteration
                    Object stopIteration = NativeIterator.getStopIterationObject(scope);
                    if (!e.getValue().getClass().equals(stopIteration.getClass())) {
                        throw e;
                    }
                } finally {
                    Context.exit();
                }
                if (retObj != null) {
                    if (retObj instanceof Feature) {
                        feature = (SimpleFeature) ((Feature) retObj).unwrap();
                    } else {
                        throw ScriptRuntime.constructError("Error", 
                                "Expected a feature from next method.  Got: " + Context.toString(retObj));
                    }
                }
                next = feature;
            }
        }

        public SimpleFeature next() throws NoSuchElementException {
            SimpleFeature feature;
            if (hasNext()) {
                createNextFeature();
                feature = next;
                next = null;
            } else {
                throw new NoSuchElementException("hasNext() returned false!");
            }
            if (feature == null) {
                throw new NoSuchElementException("No more features to create");
            }
            return feature;
        }

        public void close() {
            if (!closed) {
                if (closeFunc != null) {
                    Context context = Context.enter();
                    try {
                        closeFunc.call(context, scope, collection, new Object[0]);
                    } finally {
                        Context.exit();
                    }
                }
                if (generator != null) {
                    ScriptableObject.callMethod(generator, "close", new Object[0]);
                }
            }
            closed = true;
        }
    
    }

}
