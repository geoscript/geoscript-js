The process module
~~~~~~~~~~~~~~~~~~

The :doc:`process <process>` module provides a constructor for Process objects.
A process is essentially a runnable function with additional metadata about 
the functions' arguments (referred to as process inputs), return value (or 
process outputs), title, and description.

The following constructs a process that performs some simple arithmetic.

.. code-block:: javascript

    js> var Process = require("geoscript/process").Process;
    js> var add = new Process({
      >     title: "Add",
      >     description: "Adds two numbers",
      >     inputs: {
      >         a: {
      >             type: "Double",
      >             title: "First",
      >             description: "The first number"
      >         },
      >         b: {
      >             type: "Double",
      >             title: "Second",
      >             description: "The second number"
      >         }
      >     }, 
      >     outputs: {
      >         result: {
      >             type: "Double",
      >             title: "Sum",
      >             description: "The sum of the two input numbers"
      >         }
      >     },
      >     run: function(inputs) {
      >         return {result: inputs.a + inputs.b};
      >     }
      > });

Now that this process is created and well described, it can be run with the
following:

.. code-block:: javascript

    js> var outputs = add.run({a: 2, b: 3});
    js> outputs.result
    5


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









