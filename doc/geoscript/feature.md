The [feature]<@feature> Module
==============================

    js> var feature = require('geoscript/feature');
    js> var geom = require('geoscript/geom');
    js> var f = new feature.Feature({
      >     atts: {foo: 'bar'},
      >     geom: new geom.Point([1, 2])
      > });
    js> f
    {"foo":"bar"}; POINT (1 2)
    
    js> f.set('foo', 'baz');
    js> f.get('foo')
    baz
    
    js> f.geom
    POINT (1 2)
    

