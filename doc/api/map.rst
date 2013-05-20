The map module
~~~~~~~~~~~~~~

The :doc:`map <map>` module provides map rendering functionality.

.. code-block:: javascript

    >> var Map = require("geoscript/map").Map;


:class:`map.Map`
================

.. class:: map.Map(config)

    :arg config: ``Object`` Configuration object.

    Create a rule for rendering features.



Config Properties
-----------------

.. describe:: layers

    ``Array``
    List of :class:`layer.Layer` objects making up this map.

.. describe:: projection

    :class:`proj.Projection`
    Optional projection for the map.  If set, calls to :func:`render` will
    result in a map image in this projection.  If not set, the projection
    of the first layer will be used.


Properties
----------

.. attribute:: Map.projection

    :class:`proj.Projection`
    The projection for rendering layers.


Methods
-------

.. function:: Map.add

    :arg layer: :class:`layer.Layer`
    
    Add a layer to the map.

.. function:: Map.render

    Render the map's collection of layers as an image.
    
    TODO: document render options

