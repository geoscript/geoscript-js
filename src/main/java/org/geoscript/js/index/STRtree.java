package org.geoscript.js.index;

import org.geoscript.js.geom.Bounds;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;

import java.util.List;

public class STRtree extends SpatialIndex {

    public STRtree() {
        super(new org.locationtech.jts.index.strtree.STRtree());
    }

    public STRtree(Scriptable scope) {
        this();
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(STRtree.class));
    }

    @JSFunction
    public void insert(Bounds bounds, Object item) {
        this.index.insert(bounds.unwrap(), item);
    }

    @JSFunction
    public List query(Bounds bounds) {
        return this.index.query(bounds.unwrap());
    }

    @JSGetter
    public int getSize() {
        return ((org.locationtech.jts.index.strtree.STRtree)this.index).size();
    }

    /**
     * JavaScript constructor.
     * @param cx
     * @param args
     * @param ctorObj
     * @param isNewExpr
     * @return
     */
    @JSConstructor
    public static Object constructor(Context cx, Object[] args, Function ctorObj, boolean isNewExpr) {
        if (isNewExpr) {
            return new STRtree();
        } else {
            return new STRtree(ctorObj.getParentScope());
        }
    }

}
