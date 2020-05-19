.. _quickstart:

Quick Start
===========

Getting GeoScript JS
--------------------

To install GeoScript JS, :ref:`download the latest <download>` release and extract the zip archive.

Running GeoScript JS
--------------------

After extracting the release archive, you can open the GeoScript shell and import any of the GeoScript modules by running `bin/geoscript`.

.. code-block:: javascript

    ~/geoscript-js$ ./bin/geoscript-js

    >> var geom = require("geoscript/geom");
    >> var p1 = new geom.Point([0, 0]);        
    >> var p2 = new geom.Point([10, 20]);
    >> p1.distance(p2);
    22.360679774997898
    >> var poly = p2.buffer(23);
    >> poly.contains(p1);
    true
    >> quit()

You can also use the uber jar that contains all dependencies and is runnable::

    java -jar geoscript-js-1.2.0-app.jar
