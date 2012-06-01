Projection basics:

    js> var proj = require("geoscript/proj");
    js> var p = new proj.Projection("epsg:4326");
    js> p instanceof proj.Projection
    true
    js> p.id
    EPSG:4326
    js> p.json
    {"type":"Projection","id":"EPSG:4326"}
