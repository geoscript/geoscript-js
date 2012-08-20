.. module:: map
    :synopsis: Map rendering functionality.

The :mod:`map` module
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The :mod:`map` module provides map rendering functionality.

.. code-block:: javascript

    js> var MAP = require("geoscript/map");


:class:`map.Map`
================

.. class:: Map

    :arg config: ``Object`` Configuration object.

    Create a rule for rendering features.



Config Properties
-----------------

.. describe:: layers

    ``Array``
    List of :class:`layer.Layer` objects making up this map.

.. describe:: projection

    :class:`proj.Projection`
    Optional projection for the map.  If set, calls to :meth:`render` will
    result in a map image in this projection.  If not set, the projection
    of the first layer will be used.


Properties
----------

.. attribute:: Map.projection

    :class:`proj.Projection`
    The projection for rendering layers.


Methods
-------

.. method:: Map.add

    :arg layer: :class:`layer.Layer`
    
    Add a layer to the map.

.. method:: Map.render

    Render the map's collection of layers as an image.
    
    TODO: document render options

