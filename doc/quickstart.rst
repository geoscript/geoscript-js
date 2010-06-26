.. _quickstart:

Quick Start
===========

GeoScript JS is packaged for the RingoJS_ platform (but should work on other 
CommonJS_ module loaders based on Rhino).

Getting RingoJS
---------------

GeoScript currently requires that you get the latest RingoJS source from GitHub.
In order to get the latest RingoJS running, you'll need Git_ and Ant_.

First, clone the RingoJS repository (alternatively you can `download the latest 
<http://github.com/ringo/ringojs/zipball/master>`__)::

    git clone git://github.com/ringo/ringojs.git

Change into the ``ringojs`` directory and build with Ant::

    ant jar

At this point, you should be able to confirm that RingoJS is working.  From the
``ringojs`` directory, start up the RingoJS shell::

    bin/ringo

You should be able to execute JavaScript statements in the shell. When you are 
convinced things work, ``quit()``. If things don't work, see the RingoJS_ site 
for more details.


Getting GeoScript JS
--------------------

Download the latest GeoScript JS source from the :ref:`downloads <download>`
page.  Extract the source to your ``ringojs/packages`` directory.  Alternatively
you can use ``ringo-admin`` to install the latest from GitHub::

    bin/ringo-admin install tschaub/geoscript-js


Running GeoScript JS
--------------------

After getting the package source, you can open the JavaScript console and import
any of the GeoScript modules.

.. code-block:: javascript

    ~/ringojs$ bin/ringo

    >> var GEOM = require("geoscript/geom");
    >> var p1 = new GEOM.Point([0, 0]);
    >> var p2 = new GEOM.Point([10, 20]);
    >> p1.distance(p2);
    22.360679774997898
    >> var poly = p2.buffer(23);
    >> poly.contains(p1)
    true
    >> quit()


Running Tests
-------------

You can run all the tests with the following::

    bin/ringo packages/geoscript/tests/all.js


.. _RingoJS: http://ringojs.org/
.. _CommonJS: http://commonjs.org/
.. _Git: http://git-scm.com/
.. _Ant: http://ant.apache.org/
