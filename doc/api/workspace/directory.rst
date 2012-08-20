
.. currentmodule:: workspace




:class:`workspace.Directory`
================================================================================

.. class:: Directory

    :arg path: ``String`` Path to the directory.

    Create a workspace from a directory.





Example Use
-----------

Sample code create a new workspace for accessing data on the filesystem:

.. code-block:: javascript

    js> var dir = new WORKSPACE.Directory("data/shp");
    js> dir
    <Directory ["states"]>
    js> var states = dir.get("states");
    js> states
    <Layer name: states, count: 49>

    




Properties
----------


.. attribute:: Directory.layers

    ``Array``
    The available layers in the workspace.

.. attribute:: Directory.names

    ``Array``
    The available layer names in the workspace.

.. attribute:: Directory.path

    ``String``
    The absolute directory path.




Methods
-------


.. method:: Directory.add

    :arg layer: :class:`layer.Layer` The layer to be added.
    :arg options: ``Object`` Options for adding the layer.
    
    Options:
     * `name`: ``String`` Name for the new layer.
     * `filter`: :class:`filter.Filter` Filter to apply to features before adding.
     * `projection: :class:`proj.Projection` Destination projection for the layer.
    
    :returns: :class:`layer.Layer`
    
    Create a new layer in this workspace with the features from an existing
    layer.  If a layer with the same name already exists in this workspace,
    you must provide a new name for the layer.

.. method:: Directory.close

    Close the workspace.  This discards any existing connection to the
    underlying data store and discards the reference to the store.

.. method:: Directory.get

    :arg name: ``String`` Layer name.
    :returns: :class:`layer.Layer`
    
    Get a layer by name.  Returns ``undefined`` if name doesn't correspond
    to a layer source in the workspace.







