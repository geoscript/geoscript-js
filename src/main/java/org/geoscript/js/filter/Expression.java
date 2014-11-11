package org.geoscript.js.filter;

import org.geoscript.js.GeoObject;
import org.geotools.factory.CommonFactoryFinder;
import org.geotools.filter.text.cql2.CQL;
import org.geotools.filter.text.cql2.CQLException;
import org.geotools.filter.text.ecql.ECQL;
import org.mozilla.javascript.*;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSGetter;
import org.mozilla.javascript.annotations.JSSetter;
import org.mozilla.javascript.annotations.JSStaticFunction;
import org.opengis.filter.FilterFactory;
import org.opengis.filter.expression.Literal;

public class Expression extends GeoObject implements Wrapper {

    /**
     * serialVersionUID
     */
    private static final long serialVersionUID = 4426338466323185386L;

    /**
     * The GeoTools Expression
     */
    private org.opengis.filter.expression.Expression expression;

    private static FilterFactory filterFactory = CommonFactoryFinder.getFilterFactory(null);

    /**
     * The prototype constructor
     */
    public Expression() {
    }

    public Expression(org.opengis.filter.expression.Expression expression) {
        this.expression = expression;
    }

    public Expression(Object value) {
        this(filterFactory.literal(value));
    }

    public Expression(Scriptable scope, org.opengis.filter.expression.Expression expression) {
        this(expression);
        setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Expression.class));
    }

    public Expression(Scriptable scope, Object value) {
        this(scope, filterFactory.literal(value));
    }

    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        if (args.length == 0) {
            return new Expression();
        }
        Expression expression = null;
        Object arg = args[0];
        Object value = null;
        if (arg instanceof String || arg instanceof Number) {
            value = arg;
        } else if (arg instanceof NativeObject) {
            NativeObject config = (NativeObject) arg;
            value = config.get("text", config);
        } else {
            throw ScriptRuntime.constructError("Error", "Cannot create Expression from provided value: " + Context.toString(ctorObj));
        }
        if (inNewExpr) {
            expression = new Expression(toExpression(value.toString()));
        } else {
            expression = new Expression(ctorObj.getParentScope(), toExpression(value.toString()));
        }
        return expression;
    }

    @JSGetter
    public String getText() {
        String text;
        if (this.getLiteral()) {
            Object value = ((Literal) this.expression).getValue();
            if (value instanceof String) {
                text = "'" + value + "'";
            } else {
                text = value.toString();
            }
        } else {
            text = this.expression.toString();
        }
        return text;
    }

    @JSSetter
    public void setText(String text) {
        this.expression = toExpression(text);
    }

    private static org.opengis.filter.expression.Expression toExpression(String text) {
        try {
            return ECQL.toExpression(text);
        } catch (CQLException ex1) {
            try {
                return CQL.toExpression(text);
            } catch (CQLException ex2) {
                throw ScriptRuntime.constructError("Error",
                        "Cannot parse the following text with " +
                        "CQL (" + ex2.getMessage() + ") or ECQL (" + ex1.getMessage() + ")!");
            }
        }
    }

    // TODO: Remove once Style API has been converted
    @JSGetter("_expression")
    public Object getExpression() {
        return this.expression;
    }

    @JSGetter
    public boolean getLiteral() {
        return this.expression instanceof Literal;
    }

    @JSGetter
    public Scriptable getConfig() {
        Scriptable config = super.getConfig();
        config.put("type", config, "Expression");
        config.put("text", config, getText());
        return config;
    }

    @Override
    public String toFullString() {
        return getText();
    }

    @Override
    public String getClassName() {
        return getClass().getName();
    }

    @Override
    public org.opengis.filter.expression.Expression unwrap() {
        return this.expression;
    }

    @JSStaticFunction("from_")
    public static Expression from(Scriptable scriptable) {
        org.opengis.filter.expression.Expression expr = null;
        if (scriptable instanceof Wrapper) {
            Object obj = ((Wrapper) scriptable).unwrap();
            if (obj instanceof org.opengis.filter.expression.Expression) {
                expr = (org.opengis.filter.expression.Expression) obj;
            }
        }
        if (expr == null) {
            throw ScriptRuntime.constructError("Error", "Cannot create expression from " + Context.toString(scriptable));
        }
        return new Expression(getTopLevelScope(scriptable), expr);
    }

    @JSStaticFunction
    public static Expression literal(Scriptable valueObj) {
        Object value = valueObj.getDefaultValue(null);
        return new Expression(getTopLevelScope(valueObj), value);
    }
}