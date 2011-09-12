# geoscript.js

## GeoScript in JavaScript

Copyright (c) 2009-2011 Tim Schaub

Released under the MIT license.  Please see the license.txt for full detail.

### Download and Installation

The latest release of GeoScript JS can be found on the [downloads page](http://geoscript.org/js/download.html).  To install, extract the zip archive somewhere onto your filesystem.  In the `bin` folder you'll find a `geoscript` executable.  Adding this `bin` folder to your path makes for easy launching of GeoScript from anywhere.

### Running GeoScript JS

Change into the directory where you extracted the GeoScript JS download.  From there, you can launch the GeoScript JS shell.

    ./bin/geoscript

Once running the shell, you can pull in GeoScript modules with `require`.

    js> var geom = require("geoscript/geom")
    js> var p = new geom.Point([1, 2])
    js> p.buffer(10)
    <Polygon [[[11, 2], [10.807852804032304, 0.04909677983871763], [10.23...>

When you're done in the shell, exit with `quit()`.

    js> quit()

To run a script that uses the GeoScript JS modules, include the path to your script.

    ./bin/geoscript yourscript.js

### Learning GeoScript JS

See the [GeoScript JS website](http://geoscript.org/js/) for details on getting started using GeoScript JS.

### Getting set up for development

Clone the repository and then use Maven to pull in dependencies and run tests.

    git clone git://github.com/tschaub/geoscript-js.git
    cd geoscript-js
    mvn install

After pulling down the dependencies, you can launch the shell and use GeoScript JS modules as described above.
