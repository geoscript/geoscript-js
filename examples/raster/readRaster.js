var raster = require('geoscript/raster');
var proj = require('geoscript/proj');

var format = new raster.Format({source: 'raster.tif'});
print("Format names: " + format.names);
var tif = format.read({});
print("Raster: " + tif);
print("Name: " + tif.name);
print("Projection: " + tif.proj);
print("Size: " + tif.size);

var pngFormat = new raster.Format({source: 'raster.png'});
pngFormat.write(tif, {});