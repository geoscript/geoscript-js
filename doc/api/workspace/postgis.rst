:class:`workspace.PostGIS`
==========================

.. class:: workspace.PostGIS(config)

    :arg config: ``Object`` Configuration object.

    Create a workspace from a PostGIS enabled database.


Config Properties
-----------------


.. describe:: database

    ``String``
    Database name (required).

.. describe:: host

    ``String``
    Hostname for database connection.  Default is ``"localhost"``.

.. describe:: password

    ``String``
    Password for database connection.  Default is ``"postgres"``.

.. describe:: port

    ``Number``
    Port for database connection.  Default is ``5432``.

.. describe:: schema

    ``String``
    The named database schema containing the tables to be accessed.
    Default is ``"public"``.

.. describe:: user

    ``String``
    Username for database connection.  Default is ``"postgres"``.




Properties
----------


.. attribute:: PostGIS.layers

    ``Array``
    The available layers in the workspace.

.. attribute:: PostGIS.names

    ``Array``
    The available layer names in the workspace.




Methods
-------


.. function:: PostGIS.add

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

.. function:: PostGIS.close

    Close the workspace.  This discards any existing connection to the
    underlying data store and discards the reference to the store.

.. function:: PostGIS.get

    :arg name: ``String`` Layer name.
    :returns: :class:`layer.Layer`
    
    Get a layer by name.  Returns ``undefined`` if name doesn't correspond
    to a layer source in the workspace.







