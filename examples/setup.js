var ZIP = require("zip");

var dest = "data/shp";
ZIP.unzip("../tests/data/states.shp.zip", "data/shapefiles");
