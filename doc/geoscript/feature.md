The [feature]<@feature> Module
==============================

Create a feature with attributes and a geometry.

    js> var feature = require('geoscript/feature');
    js> var geom = require('geoscript/geom');
    js> var f = new feature.Feature({
      >     atts: {foo: 'bar'},
      >     geom: new geom.Point([1, 2])
      > });
    js> f
    {"foo":"bar"}; POINT (1 2)

Set attributes with `set` and get them with `get`.

    js> f.get('foo')
    bar
    js> f.set('foo', 'baz');
    js> f.get('foo')
    baz

Access the geometry with the `geom` property.
    
    js> f.geom
    POINT (1 2)
    

