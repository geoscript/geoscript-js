package org.geoscript.js.index;

import org.geoscript.js.geom.Bounds;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.annotations.JSConstructor;
import org.mozilla.javascript.annotations.JSFunction;
import org.mozilla.javascript.annotations.JSGetter;

public class Quadtree extends SpatialIndex {

    public Quadtree() {
        super(new org.locationtech.jts.index.quadtree.Quadtree());
    }

    public Quadtree(Scriptable scope) {
        this();
        this.setParentScope(scope);
        this.setPrototype(Module.getClassPrototype(Quadtree.class));
    }


    @JSFunction
    public void insert(Bounds bounds, Object item) {
        this.index.insert(bounds.unwrap(), item);
    }

    @JSFunction
    public Object query(Bounds bounds) {
        return javaToJS(this.index.query(bounds.unwrap()), getParentScope());
    }

    @JSGetter
    public int getSize() {
        return ((org.locationtech.jts.index.quadtree.Quadtree)this.index).size();
    }

    @JSFunction
    public Object queryAll() {
        return javaToJS(((org.locationtech.jts.index.quadtree.Quadtree)this.index).queryAll(), getParentScope());
    }

    @JSFunction
    public boolean remove(Bounds bounds, Object item) {
        return this.index.remove(bounds.unwrap(), item);
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
            return new Quadtree();
        } else {
            return new Quadtree(ctorObj.getParentScope());
        }
    }

}
