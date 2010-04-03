.. _quickstart:

Quick Start
===========

GeoScript JS is packaged for the Narwhal_ platform.

Getting Narwhal
---------------

You can get Narwhal by downloading and extracting a zip archive, or cloning the
repository from GitHub.

Download the `zip archive <http://github.com/280north/narwhal/zipball/master>`__ 
and extract it somewhere on your system (I'll assume your home directory here).

*or*

Clone the repository::

    ~$ git clone git://github.com/280north/narwhal.git

Now put the `narwhal` executable on your PATH::

    ~$ export PATH=$PATH:~/narwhal/bin

With this, you should be able to confirm that Narwhal is working. Open a
JavaScript console to test this::

    ~$ narwhal

You should be able to execute JavaScript statements here. When you are convinced
things work, ``quit()``. If things don't work, see the Narwhal_ site for more
details.


Getting GeoScript JS
--------------------

Download the latest GeoScript JS source from the :ref:`downloads <download>`
page.  Extract the source somewhere on your system (I'll assume you extract it 
to your home directory).

*or*

Clone the repository from GitHub::

    ~$ git clone git://github.com/tschaub/geoscript-js.git


Running GeoScript JS
--------------------

After getting the package source, you can open the JavaScript console and import
any of the GeoScript modules. First, you need to activate your environment so
Narwhal knows how to load the modules::

    ~$ cd geoscript
    ~/geoscript$ bin/sea

Now open a JavaScript console and experiment with GeoScript:

.. code-block:: javascript

    ~/geoscript$ js
    Rhino 1.7 release 3 PRERELEASE 2009 04 05
    js> var GEOM = require("geoscript/geom");
    js> var p1 = new GEOM.Point([0, 0]);
    js> var p2 = new GEOM.Point([10, 20]);
    js> p1.distance(p2);
    22.360679774997898
    js> var poly = p2.buffer(23);
    js> poly.contains(p1)
    true
    js> quit()


Running Tests
-------------

After activating your environment (``bin/sea``), you can run all tests with the
following::

    ~/geoscript$ js tests/all.js


.. _Narwhal: http://narwhaljs.org
