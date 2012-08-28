The process module
~~~~~~~~~~~~~~~~~~

The :doc:`process <process>` module provides a constructor for Process objects.

.. code-block:: javascript

    js> var PROCESS = require("geoscript/process");


:class:`process.Process`
========================

.. class:: process.Process(config)

    :arg config: `Object` Process configuration.

Config Properties
-----------------

.. describe:: description

    ``String``
    Full description of the process, including all input and output fields.

.. describe:: inputs

    ``Object``
    Proces inputs.

.. describe:: outputs

    ``Object``
    Proces outputs.

.. describe:: run

    ``Function``
    The function to be executed when running the process.

.. describe:: title

    ``String``
    Title for the process.



Properties
----------


.. attribute:: Process.description

    ``String``
    Full description of the process, including all input and output fields.

.. attribute:: Process.inputs

    ``Object``
    Proces inputs.

.. attribute:: Process.outputs

    ``Object``
    Proces outputs.

.. attribute:: Process.title

    ``String``
    Title for the process.









