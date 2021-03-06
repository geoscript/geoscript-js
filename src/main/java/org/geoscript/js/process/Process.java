package org.geoscript.js.process;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.geoscript.js.GeoObject;
import org.geotools.data.Parameter;
import org.geotools.feature.NameImpl;
import org.geotools.process.ProcessException;
import org.geotools.process.ProcessFactory;
import org.geotools.process.Processors;
import org.geotools.data.util.NullProgressListener;
import org.geotools.util.SimpleInternationalString;
import org.geotools.util.logging.Logging;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.mozilla.javascript.annotations.JSStaticFunction;
import org.opengis.feature.type.Name;
import org.opengis.util.InternationalString;
import org.opengis.util.ProgressListener;

public class Process extends GeoObject implements Wrapper {

    static Logger LOGGER = Logging.getLogger("org.geoserver.script.js");

    /** serialVersionUID */
    private static final long serialVersionUID = 6359663951846232066L;
    
    String title;
    String description;
    
    Map<String, Parameter<?>> inputs;
    Map<String, Parameter<?>> outputs;

    org.geotools.process.Process process;
    
    /**
     * Prototype constructor.
     */
    public Process() {
    }

    /**
     * Constructor from config object.
     * @param config
     */
    private Process(Scriptable config) {
        
        title = (String) getOptionalMember(config, "title", String.class);
        description = (String) getOptionalMember(config, "description", String.class);
        
        Scriptable inputsObj = (Scriptable) getRequiredMember(config, "inputs", Scriptable.class, "Object");
        inputs = createParameterMap(inputsObj);

        Scriptable outputsObj = (Scriptable) getRequiredMember(config, "outputs", Scriptable.class, "Object");
        outputs = createParameterMap(outputsObj);

        Function runFunc = (Function) getRequiredMember(config, "run", Function.class);
        process = new JSProcess(this, runFunc);
    }

    /**
     * Constructor from config object (without new keyword).
     * @param scope
     * @param config
     */
    private Process(Scriptable scope, Scriptable config) {
        this(config);
        setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Process.class));
    }
    
    /**
     * Constructor from metadata args.
     * @param scope
     * @param title
     * @param description
     * @param inputs
     * @param outputs
     * @param process
     */
    public Process(Scriptable scope, InternationalString title, 
            InternationalString description, Map<String, 
            Parameter<?>> inputs, Map<String, Parameter<?>> outputs, 
            org.geotools.process.Process process) {
        this.title = title == null ? null : title.toString();
        this.description = description == null ? null : title.toString();
        this.inputs = inputs;
        this.outputs = outputs;
        this.process = process;
        setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Process.class));

    }
    
    @JSFunction
    public NativeObject run(Scriptable inputsObj) {
        if (!(inputsObj instanceof NativeObject)) {
            throw ScriptRuntime.constructError("Error", "The run method takes an inputs object as argument");
        }
        Map<String, Object> inputsMap = jsObjectToMap(inputsObj);

        // validate inputs
        for (Entry<String, Parameter<?>> entry : inputs.entrySet()) {
            String key = entry.getKey();
            Parameter<?> param = entry.getValue();
            if (param.minOccurs > 0) {
                if (!inputsMap.containsKey(key)) {
                    throw ScriptRuntime.constructError("Error", "Missing required input: " + key);
                }
                if (param.minOccurs > 1) {
                    Object value = inputsMap.get(key);
                    if (!(value instanceof NativeArray)) {
                        throw ScriptRuntime.constructError("Error", "Expected an array of values for input: " + key);
                    } else {
                        int size = ((NativeArray) value).size();
                        if (size < param.minOccurs) {
                            throw ScriptRuntime.constructError("Error", "Not enough values for input: " + key);
                        }
                    }
                }
            }
        }
        
        Map<String, Object> outputsMap = process.execute(inputsMap, null);
        Object obj = javaToJS(outputsMap, getParentScope());
        if (!(obj instanceof NativeObject)) {
            throw ScriptRuntime.constructError("Error", "Unable to parse process outputs");
        }
        return (NativeObject) obj;
    }

    private Map<String, Parameter<?>> createParameterMap(Scriptable obj) {
        Object[] ids = obj.getIds();
        Map<String, Parameter<?>> map = new HashMap<String, Parameter<?>>();
        for (Object idObj : ids) {
            String id = (String) idObj;
            Scriptable param = (Scriptable) getRequiredMember(obj, id, Scriptable.class, "Object");
            map.put(id, createParameter(id, param));
        }
        return map;
    }

    private Parameter<?> createParameter(String name, Scriptable paramObj) {
        
        if (!paramObj.has("type", paramObj)) {
            throw ScriptRuntime.constructError("Error", "Missing required type member");
        }
        Object typeObj = paramObj.get("type", paramObj);
        Class<?> binding = null;
        if (typeObj instanceof String) {
            String typeName = (String) typeObj;
            Type type;
            try {
                type = Type.valueOf(typeName);
            } catch (IllegalArgumentException e) {
                throw ScriptRuntime.constructError("Error", "Unsupported parameter type: " + typeName);
            }
            binding = type.getBinding();
        } else if (typeObj instanceof Wrapper) {
            typeObj = ((Wrapper) typeObj).unwrap();
            if (typeObj instanceof Class<?>) {
                binding = (Class<?>) typeObj;
            }
        }
        if (binding == null) {
            throw ScriptRuntime.constructError("Error", "Unable to create parameter binding for type: " + Context.toString(typeObj));
        }
        
        String title = (String) getOptionalMember(paramObj, "title", String.class);
        InternationalString i18nTitle = null;
        if (title != null) {
            i18nTitle = new SimpleInternationalString(title);
        }

        String desc = (String) getOptionalMember(paramObj, "description", String.class);
        InternationalString i18nDesc = null;
        if (desc != null) {
            i18nDesc = new SimpleInternationalString(desc);
        }
        
        Object minOccursObj = paramObj.get("minOccurs", paramObj);
        int minOccurs = 1;
        if (minOccursObj instanceof Number) {
            minOccurs = ((Number) minOccursObj).intValue();
            minOccurs = minOccurs > -1 ? minOccurs : 0;
        }

        Object maxOccursObj = paramObj.get("maxOccurs", paramObj);
        int maxOccurs = minOccurs > 0 ? minOccurs : 1;
        if (maxOccursObj instanceof Number) {
            maxOccurs = ((Number) maxOccursObj).intValue();
            maxOccurs = maxOccurs >= minOccurs ? maxOccurs : Integer.MAX_VALUE;
        }

        @SuppressWarnings({ "rawtypes", "unchecked" })
        Parameter<?> parameter = new Parameter(
                name, binding, i18nTitle, i18nDesc, true, minOccurs, maxOccurs, 
                null, null);
        
        return parameter;
    }

    @JSGetter
    public String getTitle() {
        return title;
    }

    @JSGetter
    public String getDescription() {
        return description;
    }
    
    @JSGetter
    public NativeObject getInputs() {
        return createJSParameterMap(inputs);
    }
    
    @JSGetter
    public NativeObject getOutputs() {
        return createJSParameterMap(outputs);
    }

    private NativeObject createJSParameterMap(Map<String, Parameter<?>> map) {
        NativeObject obj = (NativeObject) getCurrentContext().newObject(getParentScope());
        for (String id : map.keySet()) {
            Parameter<?> param = map.get(id);
            obj.put(id, obj, createJSParameter(param));
        }
        return obj;
    }

    private Object createJSParameter(Parameter<?> param) {
        NativeObject obj = (NativeObject) getCurrentContext().newObject(getParentScope());
        
        Class<?> binding = param.getType();
        String typeName = Type.getName(binding);
        if (typeName != null) {
            obj.put("type", obj, typeName);
        } else {
            obj.put("type", obj, Context.javaToJS(binding, getParentScope()));
        }
        
        obj.put("name", obj, param.getName());
        
        InternationalString i18nTitle = param.getTitle();
        if (i18nTitle != null) {
            obj.put("title", obj, i18nTitle.toString());
        }

        InternationalString i18nDescription = param.getDescription();
        if (i18nDescription != null) {
            obj.put("description", obj, i18nDescription.toString());
        }
        
        int minOccurs = param.getMinOccurs();
        if (minOccurs > -1) {
            obj.put("minOccurs", obj, minOccurs);
        }

        int maxOccurs = param.getMaxOccurs();
        if (maxOccurs > -1) {
            obj.put("maxOccurs", obj, maxOccurs);
        }
        
        Object defaultValue = param.getDefaultValue();
        if (defaultValue != null) {
            obj.put("defaultValue", obj, defaultValue);
        }

        return obj;
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
            throw ScriptRuntime.constructError("Error", "Constructor takes a single config argument.");
        }
        Process process = null;
        Object arg = args[0];
        if (arg instanceof Scriptable) {
            Scriptable config = (Scriptable) arg;
            if (inNewExpr) {
                process = new Process(config);
            } else {
                process = new Process(config.getParentScope(), config);
            }
        } else {
            throw ScriptRuntime.constructError("Error", "Could not construct process from given argument: " + arg);
        }
        return process;
    }

    @JSStaticFunction
    public static NativeArray getNames() {
        List<String> processNames = new ArrayList<String>();
        Set<ProcessFactory> factories = Processors.getProcessFactories();
        for (ProcessFactory factory : factories) {
            Set<Name> names = factory.getNames();
            for (Name name : names) {
                processNames.add(name.toString());
            }
        }
        Context context = getCurrentContext();
        return (NativeArray) context.newArray(
                ScriptRuntime.getTopCallScope(context), processNames.toArray());
    }
    
    @JSStaticFunction
    public static Process get(Scriptable processNameObj) {
        Process jsProcess = null;
        String[] parts = processNameObj.toString().split(":");
        Name name = new NameImpl(parts[0], parts[1]);
        ProcessFactory factory = Processors.createProcessFactory(name);
        if (factory != null) {
            org.geotools.process.Process process = factory.create(name);
            Scriptable scope = ScriptableObject.getTopLevelScope(processNameObj);
            jsProcess = new Process(scope, factory.getTitle(name), 
                    factory.getDescription(name), factory.getParameterInfo(name), 
                    factory.getResultInfo(name, null), process);
        }
        return jsProcess;
    }

    public Object unwrap() {
        return new MetaProcess(process, title, description, inputs, outputs);
    }

    
    private class JSProcess implements org.geotools.process.Process {
    
        private Process process;
        private Function runFunc;
        
        public JSProcess(Process process, Function runFunc) {
            this.process = process;
            this.runFunc = runFunc;
        }

        public Map<String, Object> execute(Map<String, Object> inputs,
                ProgressListener monitor) throws ProcessException {
            if (monitor == null) {
                monitor = new NullProgressListener();
            }
            Scriptable outputsObj;
            Map<String, Object> outputs = null;
            Context cx = Context.enter();
            Scriptable scope = runFunc.getParentScope();
            try {
                Object inputsObj = javaToJS(inputs, scope);
                outputsObj = (Scriptable) runFunc.call(cx, scope, 
                        process, new Object[] {inputsObj});
                outputs = jsObjectToMap(outputsObj);
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Failed to execute process", e);
                monitor.exceptionOccurred(e);
                return null;
            } finally {
                Context.exit();
                monitor.dispose();
            }
            return outputs;
        }
    }
    
}
