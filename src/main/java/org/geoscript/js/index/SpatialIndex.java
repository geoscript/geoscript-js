package org.geoscript.js.index;

import org.geoscript.js.GeoObject;
import org.mozilla.javascript.Wrapper;

public abstract class SpatialIndex extends GeoObject implements Wrapper {

    protected final org.locationtech.jts.index.SpatialIndex index;

    public SpatialIndex(org.locationtech.jts.index.SpatialIndex index) {
        this.index = index;
    }

    @Override
    public Object unwrap() {
        return index;
    }
}
