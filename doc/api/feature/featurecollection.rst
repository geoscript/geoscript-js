:class:`feature.FeatureCollection`
==================================

.. class:: feature.FeatureCollection(config)

    :arg Object config: Configuration object.

    Create a new feature collection.  A feature collection provides an iterator
    for feature objects.  All features in the collection must share the same
    schema.


Example Use
-----------

The most common way to create a feature collection is to provide a generator
function for creating new features (note the ``yield`` keyword below):

.. code-block:: javascript

    >> var {Feature, FeatureCollection} = require("geoscript/feature");
    >> var Point = require("geoscript/geom").Point;

    >> var collection = new FeatureCollection({
    ..     features: function() {
    ..         for (var i=0; i<10; ++i) {
    ..             yield new Feature({
    ..                 properties: {
    ..                     loc: new Point([i, -i]),
    ..                     name: "My Feature " + i
    ..                 }
    ..             });
    ..         }
    ..     }
    .. });

    >> for (var feature in collection) {
    ..     print(feature);
    .. }
    <Feature loc: <Point>, name: "My Feature 0">
    <Feature loc: <Point>, name: "My Feature 1">
    <Feature loc: <Point>, name: "My Feature 2">
    <Feature loc: <Point>, name: "My Feature 3">
    <Feature loc: <Point>, name: "My Feature 4">
    <Feature loc: <Point>, name: "My Feature 5">
    <Feature loc: <Point>, name: "My Feature 6">
    <Feature loc: <Point>, name: "My Feature 7">
    <Feature loc: <Point>, name: "My Feature 8">
    <Feature loc: <Point>, name: "My Feature 9">


Config Properties
-----------------

.. describe:: features

    :class:`Function` | :class:`Array`
    Most commonly, a feature generator function is provided.  This function
    should yield new :class:`feature.Feature` instances.  Alternatively, an 
    array of features may be provided.

    Using a generator function:

    .. code-block:: javascript

        >> // generate a million features
        >> var collection = new FeatureCollection({
        ..     features: function() {
        ..         for (var i=0; i<1e6; ++i) {
        ..             yield new Feature({
        ..                 properties: {
        ..                     loc: new Point([Math.random(), Math.random()])
        ..                 }
        ..             });
        ..         }
        ..     }
        .. });

    Using an array of features:

    .. code-block:: javascript

        >> // provide a collection of two features
        >> var collection = new FeatureCollection({
        ..     features: [
        ..         new Feature({properties: {loc: new Point([1, 2])}}),
        ..         new Feature({properties: {loc: new Point([1, 2])}})
        ..     ]
        .. });


.. describe:: size

    :class:`Function`
    An optional function to return the size of the collection.  By default
    the size property will be calculated on demand, by iterating through all
    features in the collection.  Because this can be very expensive, it is a
    good idea to provide a size function at construction for large collections
    of known size.  Note that this configuration option doesn't apply when an
    array of features is provided for the ``features`` config property.

    .. code-block:: javascript

        >> var knownSize = 10;
        >> var collection = new FeatureCollection({
        ..     features: function() {
        ..         for (var i=0; i<knownSize; ++i) {
        ..             yield new Feature({properties: {foo: "bar"}});
        ..         }
        ..     },
        ..     size: function() {
        ..         return knownSize;
        ..     }
        .. });

        >> collection.size
        10

.. describe:: bounds

    :class:`Function`
    An optional function to return the bounds of the collection.  By default
    the bounds of a collection will be calculated on demand by iterating through
    all features.  If the bounds is known ahead of time, a function should be
    provided that returns it.  Note that this configuration option doesn't apply
    when an array of features is provided for the ``features`` config property.

    .. code-block:: javascript

        >> var Bounds = require("geoscript/geom").Bounds;
        >> 
        >> var collection = new FeatureCollection({
        ..     features: function() {
        ..         yield new Feature({properties: {geom: new Point([-150, -45])}});
        ..         yield new Feature({properties: {geom: new Point([150, 45])}});
        ..     },
        ..     bounds: function() {
        ..         // making the bounds a bit bigger than feature bounds for demonstration
        ..         return new Bounds([-155, -50, 155, 55]);
        ..     }
        .. });

        >> collection.bounds
        <Bounds [-155.0, -50.0, 155.0, 55.0]>

.. describe:: close

    :class:`Function`
    An optional function that will be called when the iterator is closed.  If
    you need to do any cleanup when the iterator is closed, perform that cleanup
    in a close function.

    .. code-block:: javascript

        >> var called = false;

        >> var collection = new FeatureCollection({
        ..     features: function() {
        ..         for (var i=0; i<5; ++i) {
        ..             yield new Feature({properties: {index: i}});
        ..         }
        ..     },
        ..     close: function() {
        ..         called = true;
        ..     }
        .. });

        >> for (var feature in collection) {
        ..     // do something with each feature
        .. }

        >> // confirm that close method was called
        >> called
        true


Properties
----------


.. attribute:: FeatureCollection.bounds

    :class:`geom.Bounds`
    The bounds of all features in the collection.  Note that by default, this
    will be calculated on demand by iterating through all features.  To avoid
    this, supply a ``bounds`` function at construction.

.. attribute:: FeatureCollection.size

    :class:`Number`
    The number of features in the collection.  Note that this will be calculated
    on demand by iterating through all features.  To avoid this, supply a 
    ``size`` function at construction.

.. attribute:: FeatureCollection.schema

    :class:`feature.Schema`
    The common schema for all features in the collection.

.. attribute:: Feature.json

    :class:`String`
    The JSON representation of the feature collection (see http://geojson.org).


Methods
-------


.. function:: FeatureCollection.forEach

    :arg callback: ``Function`` A function to be called with each feature.  The
        callback will receive two arguments: the :class:`feature.Feature` and
        the current index.
    
    .. code-block:: javascript

        >> var collection = new FeatureCollection({
        ..     features: function() {
        ..         for (var i=0; i<3; ++i) {
        ..             yield new Feature({properties: {name: "feature_" + i}});
        ..         }
        ..     }
        .. });
        >> 
        >> collection.forEach(print)
        <Feature name: "feature_0"> 0
        <Feature name: "feature_1"> 1
        <Feature name: "feature_2"> 2


