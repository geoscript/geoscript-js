.. module:: geoscript.feature
    :synopsis: Feature related functionality.

:mod:`geoscript.feature`
========================

Create a feature with attributes and a geometry.

.. code-block:: javascript

    js> var feature = require('geoscript/feature');
    js> var geom = require('geoscript/geom');
    js> var f = new feature.Feature({
      >     atts: {
      >         foo: 'bar',
      >         g: new geom.Point([1, 2])
      >     }
      > });

Set attributes with `set` and get them with `get`.

.. code-block:: javascript

    js> f.get('foo')
    bar
    js> f.set('foo', 'baz');
    js> f.get('foo')
    baz

Access the geometry with the `geom` method.
    
.. code-block:: javascript

    js> f.geom()
    POINT (1 2)
    
Access feature schema with the `schema` property.

.. code-block:: javascript

    js> var schema = f.schema;
    js> schema instanceof feature.Schema
    true
    js> schema.atts.length
    2
    js> schema.atts[0]
    foo,String
    js> schema.atts[1]
    g,Point
    
