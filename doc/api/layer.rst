The layer module
~~~~~~~~~~~~~~~~

The :doc:`layer <layer>` module provides a constructor for Layer objects.

.. code-block:: javascript

    js> var LAYER = require("geoscript/layer");

:class:`layer.Layer`
====================

.. class:: layer.Layer(config)

    Create a new layer.  If a workspace is not provided, a temporary
    layer will be created.  If a layer is created without a schema, a
    default schema will be applied.


Example Use
-----------

Sample code to create a temporary layer:

.. code-block:: javascript

    js> var layer = new LAYER.Layer({name: "temp"});

    js> var layer = new LAYER.Layer({
      >     name: "temp2",
      >     fields: [{name: "geom", type: "Geometry"}]
      > });

    js> var FEATURE = require("geoscript/feature");
    js> var schema = new FEATURE.Schema({
      >     name: "temp3",
      >     fields: [{name: "geom", type: "Geometry"}]
      > });
    js> var layer = new LAYER.Layer({schema: schema});

Config Properties
-----------------

.. describe:: style

    :class:`style.Style`
    Optional style to be used when rendering this layer as part of a map.
    In addition to a style instance, a style config object can be provided.

.. describe:: title

    ``String``
    Optional title for the layer.


Properties
----------

.. attribute:: Layer.bounds

    :class:`geom.Bounds`
    The bounds for all features on this layer.

.. attribute:: Layer.count

    ``Number``
    The number of features contained in the layer.

.. attribute:: Layer.features

    :class:`feature.Collection`
    An iterator for accessing all features on the layer.
    
    Example use:
    
    .. code-block:: javascript
    
        js> layer.features.forEach(function(feature) {
          >     print(feature.toString());
          > });

.. attribute:: Layer.json

    ``String``
    The JSON representation of this layer.  This representation does not
    include members for each feature in the layer.

.. attribute:: Layer.name

    ``String``
    The layer name (read-only).

.. attribute:: Layer.projection

    :class:`proj.Projection`
    Optional projection for the layer.  If set, any features added to the
    layer will be transformed to this projection if they are in a different
    projection.  This must be set before features are added to the layer.

.. attribute:: Layer.schema

    :class:`feature.Schema`
    The schema for this layer (read-only).

.. attribute:: Layer.style

    :class:`style.Style`
    The style to be used when rendering this layer as part of a map.

.. attribute:: Layer.temporary

    ``Boolean``
    The layer has not been persisted to a workspace (read-only).

.. attribute:: Layer.title

    ``String``
    The layer title.  Defaults to the layer name.


Methods
-------

.. function:: Layer.add(feature)

    :arg feature: ``Object`` A :class:`feature.Feature` or a feature attribute
        values object.
    
    Add a feature to a layer.  Optionally, an object with feature attribute
    values may be provided.
    
    Example use:
    
    .. code-block:: javascript
    
        js> var GEOM = require("geoscript/geom");
        js> layer.add({geom: new GEOM.Point([0, 1])});
    

.. function:: Layer.clone(name)

    :arg name: ``String`` New layer name.  If not provided, one will be
        generated.
    :returns: :class:`layer.Layer` The layer clone.
    
    Create a temporary copy of this layer.

.. function:: Layer.get(id)

    :arg id: ``String`` or :class:`feature:Filter` Feature identifier.  
        Alternatively you can provide an arbitrary filter.  In the case of a 
        filter, only the first feature in the resulting query will be returned.
    :returns: :class:`feature.Feature`
    
    Get a single feature using the feature id.

.. function:: Layer.getBounds(filter)

    :arg filter: :class:`filter.Filter` Optional filter or CQL string.
    :returns: :class:`geom.Bounds`
    
    Get the bounds for all features on the layer.  Optionally, the bounds
    can be generated for all features that match the given filter.

.. function:: Layer.getCount(filter)

    :arg filter: :class:`filter.Filter` Optional filter or CQL string.
    :returns: ``Number``
    
    Get the number of features on the layer matching the given filter.

.. function:: Layer.query(filter)

    :arg filter: ``filter.Filter or String`` A filter or a CQL string.
    :returns: :class:`feature.Collection` An iterator for accessing queried
            features.
    
    Query for features from the layer.  The return will be an object with
    ``forEach``, ``hasNext``, and ``next`` methods.  If no filter is
    provided, all features will be included in the results.
    
    Example use:
    
    .. code-block:: javascript
    
        js> layer.query("name = 'foo'").forEach(function(feature) {
          >     print(feature.toString());
          > });

.. function:: Layer.remove(filter)

    :arg filter: :class:`filter.Filter` or ``String`` or
        :class:`feature.Feature`
    
    Remove features from a layer that match the given filter or CQL string.
    Alternatively, a feature can be provided to remove a single feature from
    the layer.
    
    Example use:
    
    .. code-block:: javascript
    
        js> var GEOM = require("geoscript/geom");
        js> layer.add({geom: new GEOM.Point([1, 2])});
        js> layer.remove("INTERSECTS(geom, POINT(1 2))");
    

.. function:: Layer.update

    Update any features that have been modified since the last update.  This
    persists feature changes.


