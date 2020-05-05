package org.geoscript.js.filter;

import org.geoscript.js.GeoObject;
import org.geoscript.js.feature.Feature;
import org.geotools.factory.CommonFactoryFinder;
import org.geotools.util.factory.GeoTools;
import org.geotools.filter.text.cql2.CQL;
import org.geotools.filter.text.cql2.CQLException;
import org.geotools.filter.text.ecql.ECQL;
import org.geotools.xsd.Encoder;
import org.mozilla.javascript.*;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.mozilla.javascript.annotations.JSStaticFunction;
import org.opengis.filter.FilterFactory2;
import org.opengis.filter.identity.FeatureId;

import javax.xml.namespace.QName;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Filter extends GeoObject implements Wrapper {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4426338466323185386L;

    private org.opengis.filter.Filter filter;

    private static FilterFactory2 factory = CommonFactoryFinder.getFilterFactory2(GeoTools.getDefaultHints());

    /**
     * The Prototype constructor
     */
    public Filter() {
    }

    public Filter(org.opengis.filter.Filter filter) {
        this.filter = filter;
    }

    public Filter(Scriptable scope, org.opengis.filter.Filter filter) {
        this(filter);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Filter.class));
    }

    public Filter(String cql) {
        this(fromCQL(cql));
    }

    public Filter(Scriptable scope, String cql) {
        this(scope, fromCQL(cql));
    }

    /**
     * Create a GeoTools Filter from a CQL String
     */
    private static org.opengis.filter.Filter fromCQL(String cql) {
        org.opengis.filter.Filter filter;
        try {
            filter = ECQL.toFilter(cql);
        } catch (CQLException ex1) {
            try {
                filter = CQL.toFilter(cql);
            } catch (CQLException ex2) {
                throw ScriptRuntime.constructError("Error", "Can't parse Filter CQL Expression: " + ex2.getMessage() +
                        " or ECQL Expression: " + ex1.getMessage());
            }
        }
        return filter;
    }

    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean isNewExpr) {
        if (args.length != 1) {
            return new Filter();
        }
        Filter filter;
        Object arg = args[0];
        String cql;
        if (arg instanceof String) {
            cql = (String) arg;
        } else if (arg instanceof NativeObject) {
            NativeObject config = (NativeObject) arg;
            cql = config.get("cql", config).toString();
        } else if (arg instanceof Filter) {
            cql = ((Filter) arg).getCql();
        } else {
            throw ScriptRuntime.constructError("Error", "Cannot create filter from provided value: " + Context.toString(ctorObj));
        }
        if (isNewExpr) {
            filter = new Filter(cql);
        } else {
            filter = new Filter(ctorObj.getParentScope(), cql);
        }
        return filter;
    }

    @JSFunction
    public boolean evaluate(Feature feature) {
        return filter.evaluate(feature.unwrap());
    }

    @JSGetter
    public Filter getNot() {
        return new Filter(factory.not(this.filter));
    }

    @JSFunction
    public Filter and(Scriptable filters) {
        if (filters instanceof NativeArray) {
            NativeArray array = (NativeArray) filters;
            array.add(this.filter);
            return Filter.staticAnd(array);
        } else {
            org.opengis.filter.Filter filter = factory.and(this.filter, ((Filter) filters).unwrap());
            return new Filter(getTopLevelScope(filters), filter);
        }
    }

    @JSFunction
    public Filter or(Scriptable filters) {
        if (filters instanceof NativeArray) {
            NativeArray array = (NativeArray) filters;
            array.add(this.filter);
            return Filter.staticOr(array);
        } else {
            org.opengis.filter.Filter filter = factory.or(this.filter, ((Filter) filters).unwrap());
            return new Filter(getTopLevelScope(filters), filter);
        }
    }

    @JSGetter
    public String getCql() {
        return ECQL.toCQL(this.filter);
    }

    @JSGetter("_filter")
    public org.opengis.filter.Filter getFilter() {
        return this.filter;
    }

    @JSGetter
    @Override
    public Scriptable getConfig() {
        Scriptable obj = super.getConfig();
        obj.put("type", obj, "Filter");
        obj.put("text", obj, getCql());
        return obj;
    }

    @JSFunction
    public String toXML(String version, boolean pretty) throws IOException {
        org.geotools.xsd.Encoder encoder;
        QName qname;
        if (version.equalsIgnoreCase("1.1")) {
            qname = org.geotools.filter.v1_1.OGC.getInstance().Filter;
            org.geotools.filter.v1_1.OGCConfiguration config = new org.geotools.filter.v1_1.OGCConfiguration();
            encoder = new Encoder(config);
        } else {
            qname = org.geotools.filter.v1_0.OGC.getInstance().Filter;
            org.geotools.filter.v1_0.OGCConfiguration config = new org.geotools.filter.v1_0.OGCConfiguration();
            encoder = new Encoder(config);
        }
        encoder.setIndenting(pretty);
        encoder.setOmitXMLDeclaration(true);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        encoder.encode(this.filter, qname, out);
        return new String(out.toByteArray());
    }

    @Override
    public String toFullString() {
        return getCql();
    }

    @Override
    public org.opengis.filter.Filter unwrap() {
        return filter;
    }

    @Override
    public String getClassName() {
        return getClass().getName();
    }

    private static List<org.opengis.filter.Filter> getFilters(NativeArray array) {
        List<org.opengis.filter.Filter> filters = new ArrayList<>();
        for (int i = 0; i < array.size(); i++) {
            Object item = array.get(i);
            Filter filter;
            if (item instanceof Filter) {
                filter = (Filter) item;
            } else if (item instanceof org.opengis.filter.Filter) {
                filter = new Filter(getTopLevelScope(array), (org.opengis.filter.Filter) item);
            } else {
                filter = new Filter(getTopLevelScope(array), array.get(i).toString());
            }
            filters.add(filter.unwrap());
        }
        return filters;
    }

    @JSStaticFunction("from_")
    public static Filter from(Scriptable filterObject) {
        org.opengis.filter.Filter filter = null;
        if (filterObject instanceof Wrapper) {
            Object obj = ((Wrapper) filterObject).unwrap();
            if (obj instanceof org.opengis.filter.Filter) {
                filter = (org.opengis.filter.Filter) obj;
            }
        }
        if (filter == null) {
            throw ScriptRuntime.constructError("Error", "Cannot create filter from " + Context.toString(filterObject));
        }
        return new Filter(getTopLevelScope(filterObject), filter);
    }

    @JSStaticFunction("and")
    public static Filter staticAnd(NativeArray array) {
        List<org.opengis.filter.Filter> filters = getFilters(array);
        return new Filter(getTopLevelScope(array), factory.and(filters));
    }

    @JSStaticFunction("or")
    public static Filter staticOr(NativeArray array) {
        List<org.opengis.filter.Filter> filters = getFilters(array);
        return new Filter(getTopLevelScope(array), factory.or(filters));
    }

    @JSStaticFunction("not")
    public static Filter staticNot(Scriptable obj) {
        Filter filter;
        String cql;
        if (obj instanceof NativeObject) {
            NativeObject config = (NativeObject) obj;
            cql = config.get("cql", config).toString();
        } else if (obj.getDefaultValue(null) instanceof String) {
            cql = obj.getDefaultValue(null).toString();
        } else {
            throw ScriptRuntime.constructError("Error", "Cannot create filter from provided value: " + Context.toString(obj));
        }
        filter = new Filter(cql);
        return new Filter(getTopLevelScope(obj), factory.not(filter.unwrap()));
    }

    @JSStaticFunction
    public static Filter fids(NativeArray array) {
        Set<FeatureId> featureIds = new HashSet<FeatureId>();
        for (int i = 0; i < array.size(); i++) {
            featureIds.add(factory.featureId(array.get(i).toString()));
        }
        return new Filter(getTopLevelScope(array), factory.id(featureIds));
    }

}
