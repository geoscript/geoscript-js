package org.geoscript.js.process;

import java.util.HashMap;
import java.util.Map;

import org.geoscript.js.GeoObject;
import org.geotools.data.Parameter;
import org.geotools.util.SimpleInternationalString;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptRuntime;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;
import org.opengis.util.InternationalString;

public class Process extends GeoObject {

    /** serialVersionUID */
    private static final long serialVersionUID = 6359663951846232066L;
    
    String title;
    String description;
    Function runFunc;
    
    Map<String, Parameter<?>> inputs;
    Map<String, Parameter<?>> outputs;

    
    /**
     * Prototype constructor.
     */
    public Process() {
    }

    public Process(Scriptable config) {
        
        runFunc = (Function) getRequiredMember(config, "run", Function.class);
        
        title = (String) getOptionalMember(config, "title", String.class);
        description = (String) getOptionalMember(config, "description", String.class);
        
        Object inputsObj = config.get("inputs", config);
        if (!(inputsObj instanceof Scriptable)) {
            throw ScriptRuntime.constructError("Error", "Missing required inputs member");
        } else {
            inputs = createParameterMap((Scriptable) inputsObj);
        }

        Object outputsObj = config.get("outputs", config);
        if (!(outputsObj instanceof Scriptable)) {
            throw ScriptRuntime.constructError("Error", "Missing required outputs member");
        } else {
            outputs = createParameterMap((Scriptable) outputsObj);
        }

    }

    private Map<String, Parameter<?>> createParameterMap(Scriptable obj) {
        Object[] ids = obj.getIds();
        Map<String, Parameter<?>> map = new HashMap<String, Parameter<?>>();
        for (Object idObj : ids) {
            String id = (String) idObj;
            Object paramObj = obj.get(id, obj);
            if (!(paramObj instanceof Scriptable)) {
                throw ScriptRuntime.constructError("Error", "Expected '" + id + "' value to be an object. Got: " + Context.toString(paramObj));
            }
            map.put(id, createParameter((Scriptable) paramObj));
        }
        return map;
    }

    private Parameter<?> createParameter(Scriptable paramObj) {
        
        String name = (String) getRequiredMember(paramObj, "name", String.class);
        String typeName = (String) getRequiredMember(paramObj, "type", String.class);
        Type type;
        try {
            type = Type.valueOf(typeName);
        } catch (IllegalArgumentException e) {
            throw ScriptRuntime.constructError("Error", "Unsupported parameter type: " + typeName);
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
        
        Boolean required = (Boolean) getOptionalMember(paramObj, "required", Boolean.class);
        if (required == null) {
            required = false;
        }
        
        Object minOccursObj = paramObj.get("minOccurs", paramObj);
        int minOccurs = -1;
        if (minOccursObj instanceof Number) {
            minOccurs = (Integer) minOccursObj;
        }

        Object maxOccursObj = paramObj.get("maxOccurs", paramObj);
        int maxOccurs = -1;
        if (maxOccursObj instanceof Number) {
            maxOccurs = (Integer) maxOccursObj;
        }

        Parameter<?> parameter = new Parameter(
                name, type.getBinding(), i18nTitle, i18nDesc, required, minOccurs, maxOccurs, 
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
            obj.put(id, createJSParameter(param));
        }
        return obj;
    }

    private Object createJSParameter(Parameter<?> param) {
        NativeObject obj = (NativeObject) getCurrentContext().newObject(getParentScope());
        
        String typeName = Type.getName(param.getType());
        if (typeName == null) {
            throw ScriptRuntime.constructError("Error", "Unsupported parameter type: " + Context.toString(param.getType()));
        }
        obj.put("type", obj, typeName);
        
        obj.put("name", obj, param.getName());
        
        obj.put("title", obj, param.getTitle().toString());
        obj.put("description", obj, param.getDescription().toString());
        
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
        if (!inNewExpr) {
            throw ScriptRuntime.constructError("Error", "Call constructor with new keyword.");
        }
        Process process = null;
        Object arg = args[0];
        if (arg instanceof Scriptable) {
            process = new Process((Scriptable) arg);
        }
        if (process == null) {
            throw ScriptRuntime.constructError("Error", "Could not construct process from given argument: " + arg);
        }
        return process;
    }

    
}
