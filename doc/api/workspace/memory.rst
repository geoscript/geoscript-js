:class:`workspace.Memory`
=========================

.. class:: workspace.Memory(config)

    Create a memory based workspace.


Properties
----------

.. attribute:: Memory.layers

    ``Array``
    The available layers in the workspace.

.. attribute:: Memory.names

    ``Array``
    The available layer names in the workspace.


Methods
-------


.. function:: Memory.add

    :arg layer: :class:`layer.Layer` The layer to be added.
    :arg options: ``Object`` Options for adding the layer.
    
    Options:
    
     * `name`: ``String`` Name for the new layer.
     * `filter`: :class:`filter.Filter` Filter to apply to features before adding.
     * `projection`: :class:`proj.Projection` Destination projection for the layer.
    
    :returns: :class:`layer.Layer`
    
    Create a new layer in this workspace with the features from an existing
    layer.  If a layer with the same name already exists in this workspace,
    you must provide a new name for the layer.

.. function:: Memory.close

    Close the workspace.  This discards any existing connection to the
    underlying data store and discards the reference to the store.

.. function:: Memory.get

    :arg name: ``String`` Layer name.
    :returns: :class:`layer.Layer`
    
    Get a layer by name.  Returns ``undefined`` if name doesn't correspond
    to a layer source in the workspace.







