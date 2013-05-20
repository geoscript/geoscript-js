The process module
~~~~~~~~~~~~~~~~~~

The :doc:`process <process>` module provides a constructor for Process objects.
A process is essentially a runnable function with additional metadata about
the functions' arguments (referred to as process inputs), return value (or
process outputs), title, and description.

The following constructs a process that performs some simple arithmetic.

.. code-block:: javascript

    >> var Process = require("geoscript/process").Process;
    >> var add = Process({
    ..   title: "Add",
    ..   description: "Adds two numbers",
    ..   inputs: {
    ..     a: {
    ..       type: "Number",
    ..       title: "First",
    ..       description: "The first number"
    ..     },
    ..     b: {
    ..       type: "Number",
    ..       title: "Second",
    ..       description: "The second number"
    ..     }
    ..   },
    ..   outputs: {
    ..     result: {
    ..       type: "Number",
    ..       title: "Sum",
    ..       description: "The sum of the two input numbers"
    ..     }
    ..   },
    ..   run: function(inputs) {
    ..     return {result: inputs.a + inputs.b};
    ..   }
    .. });

Now that this process is created and well described, it can be run with the
following:

.. code-block:: javascript

    >> var outputs = add.run({a: 2, b: 3});
    >> outputs.result
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
    Proces inputs.  Property names correspond to named inputs.  Property values
    are objects with ``type`` (required), ``title``, ``description``,
    ``minOccurs``, and ``maxOccurs`` properties (optional unless noted).

    Below is an example ``inputs`` object with three named inputs:

    .. code-block:: javascript

        {
          start: {
            type: "Date",
            title: "Start Time"
          },
          end: {
            type: "Date",
            title: "End Time",
            description: "Optional end time",
            minOccurs: 0
          },
          geom: {
            type: "Polygon",
            title: "Area of Interest"
          }
        }

    For a description and list of supported ``type`` values, see the
    :ref:`type_mapping` section.  If you need to reference a type for which
    there is not a mapping, you can supply the class directly instead of
    providing a string (e.g. ``Packages.com.example.SomeClass``).

.. describe:: outputs

    ``Object``
    Proces outputs.  Property names correspond to named outputs.  Property
    values are objects with ``type`` (required), ``title``, ``description``,
    ``minOccurs``, and ``maxOccurs`` properties (optional unless noted).

    Below is an example ``outputs`` object with one named output:

    .. code-block:: javascript

        {
          result: {
            type: "FeatureCollection",
            title: "Resulting features"
          }
        }

    For a description and list of supported ``type`` values, see the
    :ref:`type_mapping` section.  If you need to reference a type for which
    there is not a mapping, you can supply the class directly instead of
    providing a string (e.g. ``Packages.com.example.SomeClass``).


.. describe:: run

    ``Function``
    The function to be executed when running the process.  This function is
    expected to take a single ``inputs`` argument with a property for each of
    the named inputs.  The function should return an object with a property for
    each of the named outputs.

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


Methods
-------

.. function:: Process.run

    :arg inputs: ``Object`` Inputs object
    :returns: ``Object`` Outputs object

    Execute the process with the given inputs.


Static Methods
--------------

.. function:: Process.get(id)

    :arg id: ``String`` Process identifier (e.g. "geo:buffer")
    :returns: ``Process``

    Get a registered process.  Returns ``null`` if no process was found from
    the provided identifier.

    The example below uses the static :func:`Process.get` method to access and 
    run the ``geo:buffer`` process.  (Note this is a contrived example as all 
    geometries already have a :func:`Geometry.buffer` method that accomplishes 
    the same.)

    .. code-block:: javascript

        >> var Process = require("geoscript/process").Process
        >> var Point = require("geoscript/geom").Point;

        >> var buffer = Process.get("geo:buffer");
        >> Object.keys(buffer.inputs);
        geom,distance,quadrantSegments,capStyle
        >> Object.keys(buffer.outputs);
        result

        >> var point = Point([-110, 45]);
        >> var outputs = buffer.run({geom: point, distance: 10});
        >> outputs.result;
        <Polygon [[[-100, 45], [-100.19214719596769, 43.04909677983872], [-10...>


.. function:: Process.getNames

    :returns: ``Array`` A list of identifiers for all registered processes.

    Get a list of all processes that are registered as part of the underlying
    libraries (does not include dynamically generated processes).






