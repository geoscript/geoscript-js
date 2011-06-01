# geoscript.js

## GeoScript in JavaScript

Copyright (c) 2009-2011 Tim Schaub

Released under the MIT license.  Please see the license.txt for full detail.

### Using GeoScript JS

See the [GeoScript JS website](http://geoscript.org/js/) for details on getting 
started using GeoScript JS.

### Getting set up for development

Clone the repository and then use Maven to pull in dependencies and run tests.

    git clone git://github.com/tschaub/geoscript-js.git
    cd geoscript-js
    mvn install

After pulling down the dependencies, you can launch the Rhino shell with the included `geoscript` script.
    
    ./geoscript

Once running the shell, you can pull in GeoScript modules with `require`.

    js> var geom = require("geoscript/geom")
    js> var p = new geom.Point([1, 2])
    js> p.buffer(10)
    <Polygon [[[11, 2], [10.807852804032304, 0.04909677983871763], [10.23...>
