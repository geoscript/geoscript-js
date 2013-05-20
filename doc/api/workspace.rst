The workspace module
====================

The :doc:`workspace <workspace>` module provides a provides constructors for 
different workspace types.

.. code-block:: javascript

    >> var workspace = require("geoscript/workspace");


Constructors
------------

.. toctree::
    :glob:
    :maxdepth: 1
    
    workspace/*


Properties
----------

.. attribute:: workspace.memory

    :class:`workspace.Memory`
    A memory workspace that will be used to collect all temporary layers
    created without a specific workspace.


