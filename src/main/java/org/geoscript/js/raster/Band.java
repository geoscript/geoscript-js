package org.geoscript.js.raster;

import org.geoscript.js.GeoObject;
import org.geotools.coverage.TypeMap;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.Wrapper;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;
import org.opengis.coverage.SampleDimension;

import javax.measure.Unit;
import java.awt.image.DataBuffer;
import java.util.Arrays;

public class Band extends GeoObject implements Wrapper {
    
    private SampleDimension sampleDimension;

    public Band() {
    }

    public Band(SampleDimension sampleDimension) {
        this.sampleDimension = sampleDimension;
    }

    public Band(Scriptable scope, SampleDimension sampleDimension) {
        this(sampleDimension);
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Band.class));
    }

    @JSGetter
    public double getMin() {
        return this.sampleDimension.getMinimumValue();
    }

    @JSGetter
    public double getMax() {
        return this.sampleDimension.getMaximumValue();
    }

    @JSGetter
    public Object getNoData() {
        return javaToJS(this.sampleDimension.getNoDataValues(), this.getParentScope());
    }

    @JSFunction
    public boolean isNoData(double value) {
        double[] values = this.sampleDimension.getNoDataValues();
        return Arrays.asList(values).contains(value);
    }

    @JSGetter
    public double getScale() {
        return this.sampleDimension.getScale();
    }

    @JSGetter
    public double getOffset() {
        return this.sampleDimension.getOffset();
    }

    @JSGetter
    public String getType() {
        int type = TypeMap.getDataBufferType(this.sampleDimension.getSampleDimensionType());
        if (type == DataBuffer.TYPE_BYTE) {
            return "byte";
        } else if (type == DataBuffer.TYPE_DOUBLE) {
            return "double";
        } else if (type == DataBuffer.TYPE_FLOAT) {
            return "float";
        } else if (type == DataBuffer.TYPE_INT) {
            return "int";
        } else if (type == DataBuffer.TYPE_SHORT) {
            return "short";
        } else if (type == DataBuffer.TYPE_USHORT) {
            return "short";
        } else {
            return "undefined";
        }
    }

    @JSGetter
    public String getDescription() {
        return this.sampleDimension.getDescription().toString();
    }

    @Override
    public Object unwrap() {
        return this.sampleDimension;
    }

    @Override
    public String toString() {
        return getDescription();
    }

    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean inNewExpr) {
        if (inNewExpr) {
            return new Band(null);
        } else {
            return new Band(ctorObj.getParentScope(), null);
        }
    }

}
