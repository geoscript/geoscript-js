.. _quickstart:

Quick Start
===========

GeoScript JS is a package of CommonJS_ modules that uses the Mozilla Rhino JavaScript interpreter and depends on the GeoTools library.  Currently these dependencies are managed with Maven.  The easiest way to get set up with GeoScript JS is to clone the repository with Git_ and install dependencies with Maven_ (2.2.1).

Getting GeoScript JS
--------------------

To get the GeoScript JS source, clone the repository with `git`.

    git clone git://github.com/tschaub/geoscript-js.git

Next, use `mvn` to pull down dependencies and run tests.

    cd geoscript-js
    mvn install

Running GeoScript JS
--------------------

After getting the package source and installing dependencies, you can open the JavaScript console and import any of the GeoScript modules.

.. code-block:: javascript

    ~/geoscript-js$ ./geoscript

    js> var geom = require("geoscript/geom");
    js> var p1 = new geom.Point([0, 0]);        
    js> var p2 = new geom.Point([10, 20]);
    js> p1.distance(p2);
    22.360679774997898
    js> var poly = p2.buffer(23);
    js> poly.contains(p1);
    true
    js> quit()


.. _CommonJS: http://commonjs.org/
.. _Git: http://git-scm.com/
.. _Maven: http://maven.apache.org/
