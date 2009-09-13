Quick-Start
===========

GeoScript JS is packaged for the Narwhal_ platform.

Getting Narwhal
---------------

You can get Narwhal by downloading and extracting a zip archive, or cloning the
repository from http://github.com.

* Download the `zip archive
  <http://github.com/tlrobinson/narwhal/zipball/master>`_ and extract it
  somewhere on your system (I'll assume your home directory here).

*or*

* Clone the repository::

    ~$ git clone git://github.com/tlrobinson/narwhal.git

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

The GeoScript JS source is also hosted on http://github.com. As above, you can
get the source by downloading the zip archive or cloning the repository.

* Download the `zip archive
  <http://github.com/tschaub/geoscript/zipball/master>`_ and extract it
  somewhere on your system (I'll assume you extract it to your home
  directory).

*or*

* Clone the repository::

    ~$ git clone git://github.com/tschaub/geoscript.git


.. _Narwhal: http://narwhaljs.org


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
    js> var geom = require('geoscript/geom');
    js> var p1 = new geom.Point([0, 0])
    js> var p2 = new geom.Point([10, 20])
    js> p1.distance(p2)
    22.360679774997898
    js> var poly = p2.buffer(23)
    js> poly.contains(p1)
    true

    